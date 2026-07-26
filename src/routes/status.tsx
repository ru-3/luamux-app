import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { StatusPill, StatusDot } from "@/components/brand/status-pill";
import { formatRelative } from "@/lib/format";
import { fetchHealthChecks, latest, statsForWindow, uptimeByDay, type HealthRecord } from "@/lib/health";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Status — Zeox" },
      { name: "description", content: "Live status of the Zeox platform." },
      { property: "og:title", content: "Zeox — System Status" },
      { property: "og:description", content: "Real-time uptime for the Zeox platform." },
    ],
  }),
  component: StatusPage,
});

const DAY_MS = 24 * 60 * 60 * 1000;

function StatusPage() {
  const [records, setRecords] = useState<HealthRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealthChecks(90)
      .then(setRecords)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load status"));
  }, []);

  if (error) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-5xl px-4 pb-24">
          <div className="glass-strong rounded-3xl p-8 text-center text-sm text-muted-foreground">
            Couldn't load status data: {error}
          </div>
        </section>
      </SiteShell>
    );
  }

  if (!records) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-5xl px-4 pb-24">
          <div className="glass-strong rounded-3xl p-8 text-center text-sm text-muted-foreground">
            Loading live status…
          </div>
        </section>
      </SiteShell>
    );
  }

  const last = latest(records);
  const noData = records.length === 0;
  const overall: "operational" | "outage" | "unknown" = noData ? "unknown" : last?.ok ? "operational" : "outage";
  const pillTone: "operational" | "degraded" | "outage" = overall === "unknown" ? "degraded" : overall;
  const stats24h = statsForWindow(records, Date.now() - DAY_MS);
  const bars = uptimeByDay(records, 90);

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={
            "glass-strong overflow-hidden rounded-3xl p-8 md:p-10 " +
            (pillTone === "operational" ? "glow" : "")
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                System status
              </div>
              <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
                {noData
                  ? "No data yet"
                  : overall === "operational"
                    ? "All Systems Operational"
                    : "Investigating an Issue"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {noData
                  ? "The health-check job hasn't reported in yet. Once it's running on a schedule, real status will show up here."
                  : `Last checked ${formatRelative(last!.ts)}.`}
              </p>
            </div>
            <StatusPill tone={pillTone}>
              {noData ? "No data" : overall === "operational" ? "All good" : "Investigating"}
            </StatusPill>
          </div>
        </motion.div>

        <div className="mt-10 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <StatusDot tone={pillTone} />
                <div>
                  <div className="font-medium">Zeox platform</div>
                  <div className="text-xs text-muted-foreground">Website + Firebase backend</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-emerald-400">
                  {stats24h.uptimePct === null ? "—" : `${stats24h.uptimePct.toFixed(2)}% uptime (24h)`}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {stats24h.avgResponseMs === null ? "no data" : `${stats24h.avgResponseMs}ms avg response`}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-end gap-[3px]">
              {bars.map((b, idx) => (
                <span
                  key={idx}
                  title={`${90 - idx}d ago — ${b}`}
                  className={
                    "h-6 flex-1 rounded-sm " +
                    (b === "operational"
                      ? "bg-[oklch(0.7_0.16_154)]/70 hover:bg-[oklch(0.75_0.18_154)]"
                      : b === "degraded"
                        ? "bg-[oklch(0.82_0.16_84)]/70 hover:bg-[oklch(0.85_0.18_84)]"
                        : "bg-white/5")
                  }
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>90 days ago</span>
              <span>Today</span>
            </div>
          </motion.div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Incident history</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No incidents recorded yet. This section will list real incidents as they happen.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
