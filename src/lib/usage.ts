import { collection, getDocs, orderBy, query, where, limit as fsLimit } from "firebase/firestore";
import { getDb } from "./firebase";

/**
 * Real per-user obfuscation usage.
 *
 * Records are written by the Discord bot / obfuscation engine, not by the
 * client — same pattern as `healthChecks` in `health.ts`. Each finished job
 * (whether it came from the bot or the API) should POST to
 * `/api/jobs` (see that route) with the signed-in user's Firebase UID, which
 * writes one row to the `jobs` collection:
 *
 *   { uid, ts, fileName, bytesIn, bytesOut, ok }
 *
 * This file only reads that collection. No mock numbers — if the bot hasn't
 * reported anything yet for this user, everything below returns zeroed
 * stats and the UI shows an empty state instead of fake activity.
 */

export interface JobRecord {
  id: string;
  uid: string;
  ts: number;
  fileName: string;
  bytesIn: number;
  bytesOut: number;
  ok: boolean;
}

export async function fetchUserJobs(uid: string, max = 500): Promise<JobRecord[]> {
  const db = getDb();
  const q = query(
    collection(db, "jobs"),
    where("uid", "==", uid),
    orderBy("ts", "desc"),
    fsLimit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Omit<JobRecord, "id">;
    return {
      id: d.id,
      uid: data.uid,
      ts: Number(data.ts),
      fileName: data.fileName ?? "script.lua",
      bytesIn: Number(data.bytesIn) || 0,
      bytesOut: Number(data.bytesOut) || 0,
      ok: Boolean(data.ok),
    };
  });
}

export interface UsageTotals {
  filesUploaded: number;
  filesObfuscated: number;
  bytesUploaded: number;
  bytesObfuscated: number;
}

export function totalsForJobs(jobs: JobRecord[]): UsageTotals {
  let bytesUploaded = 0;
  let bytesObfuscated = 0;
  let filesObfuscated = 0;
  for (const j of jobs) {
    bytesUploaded += j.bytesIn;
    if (j.ok) {
      bytesObfuscated += j.bytesOut;
      filesObfuscated += 1;
    }
  }
  return {
    filesUploaded: jobs.length,
    filesObfuscated,
    bytesUploaded,
    bytesObfuscated,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Bytes obfuscated per day, oldest first, for the last `days` days. */
export function dailyBytes(jobs: JobRecord[], days = 7): Array<{ day: string; bytes: number }> {
  const now = Date.now();
  const out: Array<{ day: string; bytes: number }> = [];
  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - (i + 1) * DAY_MS;
    const dayEnd = now - i * DAY_MS;
    const bytes = jobs
      .filter((j) => j.ok && j.ts >= dayStart && j.ts < dayEnd)
      .reduce((sum, j) => sum + j.bytesOut, 0);
    const label = new Date(dayEnd - 1).toLocaleDateString("en-US", { weekday: "short" });
    out.push({ day: label, bytes });
  }
  return out;
}
