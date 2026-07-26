import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchHealthChecks, statsForWindow, type HealthRecord } from "@/lib/health";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Zeox" }] }),
  component: AnalyticsPage,
});

const DAY_MS = 24 * 60 * 60 * 1000;

function AnalyticsPage() {
  const [records, setRecords] = useState<HealthRecord[] | null>(null);

  useEffect(() => {
    fetchHealthChecks(90).then(setRecords).catch(() => setRecords([]));
  }, []);

  const loading = records === null;
  const now = Date.now();
  const current = records ? statsForWindow(records, now - DAY_MS) : null;
  const previous = records ? statsForWindow(records, now - 2 * DAY_MS, now - DAY_MS) : null;
  const uptime90d = records ? statsForWindow(records, now - 90 * DAY_MS) : null;

  const fmtMs = (v: number | null) => (v === null ? "—" : `${v}ms`);
  const fmtPct = (v: number | null) => (v === null ? "—" : `${v.toFixed(2)}%`);
  const delta = (curr: number | null, prev: number | null, unit: "ms" | "%") => {
    if (curr === null || prev === null) return "";
    const d = curr - prev;
    if (Math.abs(d) < 0.005) return "";
    const sign = d > 0 ? "+" : "";
    return unit === "ms" ? `${sign}${Math.round(d)}ms` : `${sign}${d.toFixed(2)}%`;
  };

  const perf = [
    {
      label: "Avg response time",
      value: loading ? "…" : fmtMs(current!.avgResponseMs),
      delta: loading ? "" : delta(current!.avgResponseMs, previous!.avgResponseMs, "ms"),
    },
    {
      label: "Uptime (90d)",
      value: loading ? "…" : fmtPct(uptime90d!.uptimePct),
      delta: "",
    },
    {
      label: "Error rate (24h)",
      value: loading ? "…" : fmtPct(current!.errorRatePct),
      delta: loading ? "" : delta(current!.errorRatePct, previous!.errorRatePct, "%"),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Real uptime and response time from the health-check job.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {perf.map((p) => (
          <div key={p.label} className="rounded-2xl border border-white/5 bg-card p-5">
            <div className="text-xs text-muted-foreground">{p.label}</div>
            <div className="mt-1 font-display text-2xl font-semibold">{p.value}</div>
            {p.delta && (
              <div className={"text-xs " + (p.delta.startsWith("+") ? "text-destructive" : "text-emerald-400")}>
                {p.delta}
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && records!.length === 0 && (
        <div className="rounded-2xl border border-white/5 bg-card p-5 text-sm text-muted-foreground">
          No health-check data yet. Once `/api/health-check` is running on a schedule, real numbers will
          show up here within a day or two.
        </div>
      )}
    </motion.div>
  );
}
