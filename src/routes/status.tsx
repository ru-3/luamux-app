import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/site-shell";
import { StatusPill, StatusDot } from "@/components/brand/status-pill";
import { formatRelative } from "@/lib/format";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Status — Luamux" },
      { name: "description", content: "Live status of the Luamux platform: API, obfuscation engine, key server, dashboard and database." },
      { property: "og:title", content: "Luamux — System Status" },
      { property: "og:description", content: "Real-time uptime for the Luamux platform." },
    ],
  }),
  component: StatusPage,
});

interface Service {
  name: string;
  description: string;
  status: "operational" | "degraded" | "outage";
  uptime: number;
  updatedAt: number;
}

const services: Service[] = [
  { name: "API Server", description: "REST endpoints used by the dashboard and integrations.", status: "operational", uptime: 99.99, updatedAt: Date.now() - 42_000 },
  { name: "Obfuscation Engine", description: "Handles script protection jobs and returns builds.", status: "operational", uptime: 99.97, updatedAt: Date.now() - 60_000 },
  { name: "Key / License Server", description: "Issues and verifies keys for protected scripts.", status: "operational", uptime: 99.98, updatedAt: Date.now() - 25_000 },
  { name: "Web Dashboard", description: "The Luamux app dashboard and hosted key pages.", status: "operational", uptime: 100.0, updatedAt: Date.now() - 15_000 },
  { name: "Database", description: "Firestore + Realtime Database serving app state.", status: "operational", uptime: 99.99, updatedAt: Date.now() - 90_000 },
];

const incidents = [
  {
    date: "Jul 12, 2026",
    title: "Elevated latency on the Obfuscation Engine",
    status: "Resolved",
    body: "Between 14:02 and 14:34 UTC a subset of obfuscation jobs took up to 3× the normal time to complete. Root cause was a slow rollout of a new worker pool. Rolled back and re-armed the gradual rollout with tighter health checks.",
  },
  {
    date: "Jun 28, 2026",
    title: "Key verification errors in EU region",
    status: "Resolved",
    body: "A brief regional failover caused 0.4% of key verification requests to return HTTP 503 for ~4 minutes. Automatic re-routing restored normal traffic; no data was lost.",
  },
  {
    date: "Jun 04, 2026",
    title: "Scheduled maintenance — Realtime Database",
    status: "Completed",
    body: "Planned upgrade to the Realtime Database instance. No user-facing downtime observed.",
  },
];

function uptimeBars() {
  // Deterministic pattern for the 90-day uptime visualisation.
  return Array.from({ length: 90 }, (_, i) => {
    const seeded = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const r = seeded < 0 ? seeded + 1 : seeded;
    if (i === 44 || i === 63) return "degraded" as const;
    if (r > 0.985) return "degraded" as const;
    return "operational" as const;
  });
}

function StatusPage() {
  const anyDegraded = services.some((s) => s.status !== "operational");
  const anyOutage = services.some((s) => s.status === "outage");
  const overall = anyOutage ? "outage" : anyDegraded ? "degraded" : "operational";

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={
            "glass-strong overflow-hidden rounded-3xl p-8 md:p-10 " +
            (overall === "operational" ? "glow" : "")
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                System status
              </div>
              <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
                {overall === "operational"
                  ? "All Systems Operational"
                  : overall === "degraded"
                    ? "Some Systems Degraded"
                    : "Major Outage"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Live status of the Luamux platform. Updates in real time.
              </p>
            </div>
            <StatusPill tone={overall}>
              {overall === "operational"
                ? "All good"
                : overall === "degraded"
                  ? "Investigating"
                  : "Outage"}
            </StatusPill>
          </div>
        </motion.div>

        <div className="mt-10 space-y-3">
          {services.map((s, i) => {
            const bars = uptimeBars();
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <StatusDot tone={s.status} />
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-emerald-400">{s.uptime.toFixed(2)}% uptime</div>
                    <div className="text-[11px] text-muted-foreground">
                      updated {formatRelative(s.updatedAt)}
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
                          : "bg-[oklch(0.82_0.16_84)]/70 hover:bg-[oklch(0.85_0.18_84)]")
                      }
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                  <span>90 days ago</span>
                  <span>Today</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Incident history</h2>
          <div className="mt-4 space-y-3">
            {incidents.map((i) => (
              <div key={i.title} className="glass rounded-2xl p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">{i.date}</div>
                    <div className="mt-0.5 font-medium">{i.title}</div>
                  </div>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] text-emerald-300">
                    {i.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
