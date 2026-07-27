import { createFileRoute } from "@tanstack/react-router";
import { getAdminDb } from "@/lib/firebase-admin";

// POST /api/jobs — called by the Discord bot (or any other obfuscation
// front-end) after a job finishes, NOT by the browser. It records one row
// per job so the dashboard Overview page can show real "data obfuscated" /
// "files uploaded" numbers instead of placeholders. Mirrors the auth
// pattern used by /api/health-check.
//
// Auth: same shared-secret scheme as the health check —
//   Authorization: Bearer <JOBS_INGEST_SECRET>
//
// Body (JSON):
//   {
//     "uid": "<firebase auth uid of the dashboard user>",
//     "fileName": "main.lua",
//     "bytesIn": 12345,
//     "bytesOut": 15200,
//     "ok": true
//   }
//
// The bot needs to know each user's Firebase `uid`. If users don't sign in
// with Discord yet, the simplest bridge is to store `uid` on the API key
// record the dashboard already issues, and have the bot look it up by that
// key when it reports a job.
export const Route = createFileRoute("/api/jobs")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.JOBS_INGEST_SECRET;
        const authHeader = request.headers.get("authorization");
        const bearerToken = authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : null;

        if (!secret || bearerToken !== secret) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "invalid json" }, { status: 400 });
        }

        const { uid, fileName, bytesIn, bytesOut, ok } = (body ?? {}) as Record<string, unknown>;

        if (typeof uid !== "string" || !uid) {
          return Response.json({ error: "uid is required" }, { status: 400 });
        }
        if (typeof bytesIn !== "number" || typeof bytesOut !== "number") {
          return Response.json({ error: "bytesIn and bytesOut must be numbers" }, { status: 400 });
        }

        const db = getAdminDb();
        try {
          await db.collection("jobs").add({
            uid,
            ts: Date.now(),
            fileName: typeof fileName === "string" && fileName ? fileName : "script.lua",
            bytesIn,
            bytesOut,
            ok: ok !== false,
          });
        } catch (err) {
          return Response.json({ error: "failed to record job" }, { status: 500 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
