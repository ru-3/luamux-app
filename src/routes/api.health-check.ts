import { createFileRoute } from "@tanstack/react-router";
import { getAdminDb } from "@/lib/firebase-admin";

// GET /api/health-check — meant to be called on a schedule (cron), not by
// end users or the frontend. It performs one real round-trip against
// Firestore and stores the result, which is what the Status page and the
// dashboard "Avg response time / Uptime / Error rate" cards read from.
//
// Protected by a shared secret so random visitors can't spam fake rows into
// the collection. Two ways to authenticate, pick whichever fits your cron:
//   - Vercel Cron: set env var CRON_SECRET. Vercel automatically sends
//     `Authorization: Bearer <CRON_SECRET>` on every cron invocation.
//   - Any other scheduler (GitHub Actions, cron-job.org, etc.): set
//     HEALTH_CHECK_SECRET and send it yourself as `x-health-check-secret`.
export const Route = createFileRoute("/api/health-check")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.HEALTH_CHECK_SECRET || process.env.CRON_SECRET;
        const authHeader = request.headers.get("authorization");
        const bearerToken = authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : null;
        const customHeader = request.headers.get("x-health-check-secret");
        const provided = customHeader || bearerToken;

        if (!secret || provided !== secret) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }

        const db = getAdminDb();
        const start = Date.now();
        let ok = true;

        try {
          // Real round-trip: write then read a tiny doc via the Admin SDK.
          await db.collection("_health").doc("ping").set({ ts: start }, { merge: true });
          await db.collection("_health").doc("ping").get();
        } catch (err) {
          ok = false;
        }

        const responseMs = Date.now() - start;

        try {
          await db.collection("healthChecks").add({ ts: start, ok, responseMs });
        } catch (err) {
          // If even writing the result fails, surface it — this means the
          // check itself couldn't be recorded, which is worth knowing.
          return Response.json(
            { ok: false, responseMs, error: "failed to record health check" },
            { status: 500 },
          );
        }

        return Response.json({ ok, responseMs });
      },
    },
  },
});
