import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BarChart3, Settings, LifeBuoy } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatusPill } from "@/components/brand/status-pill";
import { formatNumber, formatRelative } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

const usage = [
  { d: "Mon", req: 4200, ok: 4100 },
  { d: "Tue", req: 5100, ok: 4980 },
  { d: "Wed", req: 6700, ok: 6600 },
  { d: "Thu", req: 5400, ok: 5300 },
  { d: "Fri", req: 8300, ok: 8100 },
  { d: "Sat", req: 9600, ok: 9450 },
  { d: "Sun", req: 8800, ok: 8710 },
];

const activity = [
  { id: 1, type: "login", title: "Signed in from a new device", meta: "Chrome on Windows", ts: Date.now() - 60_000 },
  { id: 2, type: "settings", title: "Updated account settings", meta: "Profile details changed", ts: Date.now() - 8 * 60_000 },
  { id: 3, type: "support", title: "Support ticket opened", meta: "Awaiting response", ts: Date.now() - 22 * 60_000 },
];

function DashboardOverview() {
  const { user } = useAuth();
  const name = user?.displayName ?? user?.email?.split("@")[0] ?? "friend";
  const stats = [
    { label: "Requests today", value: "319,200", delta: "+5.4%", accent: true },
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

      <div className="grid gap-4 md:grid-cols-1">
        {stats.map((s) => (
          <div
            key={s.label}
            className={
              "rounded-2xl border p-5 " +
              (s.accent
                ? "border-primary/40 bg-primary text-primary-foreground glow"
                : "border-white/5 bg-card")
            }
          >
            <div className="flex items-center justify-between text-xs opacity-80">
              {s.label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold">{s.value}</span>
              <span className={"text-xs " + (s.accent ? "text-emerald-100" : "text-emerald-400")}>{s.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-semibold">Usage this week</div>
              <div className="text-xs text-muted-foreground">Requests vs successful verifications</div>
            </div>
            <Link to="/dashboard/analytics" className="text-xs text-primary hover:underline">
              Details <ArrowRight className="inline h-3 w-3" />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usage} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-req" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.746 0.132 226.5)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.746 0.132 226.5)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-ok" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.18 154)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.75 0.18 154)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="d" tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.02 260)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="req" stroke="oklch(0.746 0.132 226.5)" fill="url(#g-req)" strokeWidth={2} />
                <Area type="monotone" dataKey="ok" stroke="oklch(0.75 0.18 154)" fill="url(#g-ok)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-display text-lg font-semibold">Quick actions</div>
          </div>
          <div className="grid gap-2">
            {[
              { icon: BarChart3, label: "View analytics", to: "/dashboard/analytics" },
              { icon: Settings, label: "Account settings", to: "/dashboard/settings" },
              { icon: LifeBuoy, label: "Contact support", to: "/dashboard/support" },
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
          <div className="font-display text-lg font-semibold">Recent activity</div>
          <div className="text-xs text-muted-foreground">Last 24 hours</div>
        </div>
        <ul className="space-y-3">
          {activity.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.meta}</div>
              </div>
              <div className="whitespace-nowrap text-[11px] text-muted-foreground">{formatRelative(a.ts)}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-white/5 bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-display text-lg font-semibold">Requests per hour</div>
          <div className="text-xs text-muted-foreground">Live • {formatNumber(942)} req/s peak</div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Array.from({ length: 24 }, (_, i) => ({ h: `${i}:00`, v: 200 + Math.round(Math.sin(i / 2) * 120 + Math.random() * 80) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="h" tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="oklch(0.746 0.132 226.5)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
