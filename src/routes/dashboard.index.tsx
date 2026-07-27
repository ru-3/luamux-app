import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, BarChart3, Settings, LifeBuoy, FileText, ShieldCheck, Upload } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatusPill } from "@/components/brand/status-pill";
import { formatBytes, formatRelative } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import { fetchUserJobs, totalsForJobs, dailyBytes, type JobRecord } from "@/lib/usage";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { user } = useAuth();
  const name = user?.displayName ?? user?.email?.split("@")[0] ?? "friend";

  const [jobs, setJobs] = useState<JobRecord[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchUserJobs(user.uid)
      .then(setJobs)
      .catch(() => setJobs([]));
  }, [user]);

  const loading = jobs === null;
  const totals = jobs ? totalsForJobs(jobs) : null;
  const chartData = jobs ? dailyBytes(jobs, 7) : [];
  const recent = jobs ? jobs.slice(0, 6) : [];

  const stats = [
    {
      label: "Data obfuscated",
      value: loading ? "…" : formatBytes(totals!.bytesObfuscated),
      sub: loading ? "" : `${totals!.filesObfuscated} file${totals!.filesObfuscated === 1 ? "" : "s"}`,
      accent: true,
    },
    {
      label: "Data uploaded",
      value: loading ? "…" : formatBytes(totals!.bytesUploaded),
      sub: loading ? "" : `${totals!.filesUploaded} file${totals!.filesUploaded === 1 ? "" : "s"}`,
      accent: false,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Good to see you,</div>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">
            {name} <span className="text-gradient">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground">Here's what's happening with your account.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="operational">All systems operational</StatusPill>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className={
              "rounded-2xl border p-5 " +
              (s.accent ? "border-primary/40 bg-primary text-primary-foreground glow" : "border-white/5 bg-card")
            }
          >
            <div className="flex items-center justify-between text-xs opacity-80">
              {s.label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold">{s.value}</span>
              {s.sub && <span className={"text-xs " + (s.accent ? "text-primary-foreground/80" : "text-muted-foreground")}>{s.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-semibold">Obfuscated this week</div>
              <div className="text-xs text-muted-foreground">Bytes of output per day</div>
            </div>
            <Link to="/dashboard/analytics" className="text-xs text-primary hover:underline">
              Details <ArrowRight className="inline h-3 w-3" />
            </Link>
          </div>
          {!loading && totals!.filesObfuscated === 0 ? (
            <div className="flex h-64 items-center justify-center text-center text-sm text-muted-foreground">
              No jobs recorded yet. Once the obfuscator reports finished jobs, your weekly usage will show up here.
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g-req" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.746 0.132 226.5)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.746 0.132 226.5)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                  <XAxis dataKey="day" tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatBytes(Number(v))}
                    width={64}
                  />
                  <Tooltip
                    formatter={(v: number) => formatBytes(v)}
                    contentStyle={{
                      background: "oklch(0.18 0.02 260)",
                      border: "1px solid oklch(1 0 0 / 10%)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="bytes" stroke="oklch(0.746 0.132 226.5)" fill="url(#g-req)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-display text-lg font-semibold">Quick links</div>
          </div>
          <div className="grid gap-2">
            {[
              { icon: BarChart3, label: "View analytics", to: "/dashboard/analytics" },
              { icon: Settings, label: "Account settings", to: "/dashboard/settings" },
              { icon: LifeBuoy, label: "Contact support", to: "/dashboard/support" },
              { icon: FileText, label: "Terms & conditions", to: "/terms" },
              { icon: ShieldCheck, label: "Privacy policy", to: "/privacy" },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-primary/40"
              >
                <span className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <a.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm">{a.label}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-display text-lg font-semibold">Recent jobs</div>
          <div className="text-xs text-muted-foreground">Latest first</div>
        </div>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No jobs recorded yet. This list fills in as soon as the bot/API reports finished obfuscation jobs.
          </div>
        ) : (
          <ul className="space-y-3">
            {recent.map((j) => (
              <li key={j.id} className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm">{j.fileName}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatBytes(j.bytesIn)} → {j.ok ? formatBytes(j.bytesOut) : "failed"}
                    </div>
                  </div>
                </div>
                <div className="whitespace-nowrap text-[11px] text-muted-foreground">{formatRelative(j.ts)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
