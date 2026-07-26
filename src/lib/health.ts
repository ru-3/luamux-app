import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { getDb } from "./firebase";

/**
 * Real uptime/response-time data.
 *
 * Records are written by the `/api/health-check` server route (see that file),
 * which is meant to be pinged on a schedule (Vercel Cron, GitHub Actions, or
 * any external cron service). Each ping writes one row to the `healthChecks`
 * Firestore collection: { ts, ok, responseMs }.
 *
 * This file only reads that collection and turns it into the numbers the UI
 * needs. No mock data, no made-up percentages.
 */

export interface HealthRecord {
  id: string;
  ts: number;
  ok: boolean;
  responseMs: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function fetchHealthChecks(days = 90): Promise<HealthRecord[]> {
  const since = Date.now() - days * DAY_MS;
  const db = getDb();
  const q = query(
    collection(db, "healthChecks"),
    where("ts", ">=", since),
    orderBy("ts", "asc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as { ts: number; ok: boolean; responseMs: number };
    return { id: d.id, ts: data.ts, ok: Boolean(data.ok), responseMs: Number(data.responseMs) };
  });
}

export interface PeriodStats {
  avgResponseMs: number | null;
  uptimePct: number | null;
  errorRatePct: number | null;
  sampleCount: number;
}

export function statsForWindow(records: HealthRecord[], sinceMs: number, untilMs = Date.now()): PeriodStats {
  const window = records.filter((r) => r.ts >= sinceMs && r.ts < untilMs);
  if (window.length === 0) {
    return { avgResponseMs: null, uptimePct: null, errorRatePct: null, sampleCount: 0 };
  }
  const okCount = window.filter((r) => r.ok).length;
  const avgResponseMs = Math.round(window.reduce((sum, r) => sum + r.responseMs, 0) / window.length);
  const uptimePct = (okCount / window.length) * 100;
  return {
    avgResponseMs,
    uptimePct,
    errorRatePct: 100 - uptimePct,
    sampleCount: window.length,
  };
}

/** One bucket per day for the last `days` days, oldest first. */
export function uptimeByDay(records: HealthRecord[], days = 90): Array<"operational" | "degraded" | "unknown"> {
  const now = Date.now();
  const buckets: Array<"operational" | "degraded" | "unknown"> = [];
  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - (i + 1) * DAY_MS;
    const dayEnd = now - i * DAY_MS;
    const dayRecords = records.filter((r) => r.ts >= dayStart && r.ts < dayEnd);
    if (dayRecords.length === 0) {
      buckets.push("unknown");
      continue;
    }
    const failCount = dayRecords.filter((r) => !r.ok).length;
    buckets.push(failCount / dayRecords.length > 0.02 ? "degraded" : "operational");
  }
  return buckets;
}

export function latest(records: HealthRecord[]): HealthRecord | null {
  return records.length ? records[records.length - 1] : null;
}
