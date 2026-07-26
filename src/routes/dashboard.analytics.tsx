import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber, formatRelative } from "@/lib/format";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Luamux" }] }),
  component: AnalyticsPage,
});

const req = Array.from({ length: 30 }, (_, i) => ({
  d: `${i + 1}`,
  requests: Math.round(2000 + Math.sin(i / 3) * 800 + Math.random() * 500),
}));

const verify = Array.from({ length: 30 }, (_, i) => ({
  d: `${i + 1}`,
  ok: Math.round(1400 + Math.sin(i / 4) * 500 + Math.random() * 300),
  fail: Math.round(80 + Math.random() * 60),
}));

const top = [
  { name: "combat-lib.lua", value: 4200 },
  { name: "main.lua", value: 3800 },
  { name: "ui.luau", value: 2400 },
  { name: "loader.lua", value: 1100 },
  { name: "helpers.lua", value: 700 },
];

const pie = [
  { name: "Success", value: 96, color: "oklch(0.75 0.18 154)" },
  { name: "Fail", value: 4, color: "oklch(0.63 0.21 25.5)" },
];

const perf = [
  { label: "Avg response time", value: "142ms", delta: "-6ms" },
  { label: "Uptime (90d)", value: "99.98%", delta: "" },
  { label: "Error rate", value: "0.21%", delta: "-0.03%" },
];

const recent = [
  { id: "L1", ep: "POST /v1/obfuscate", key: "Prod CLI", ms: 340, ok: true, ts: Date.now() - 30_000 },
  { id: "L2", ep: "POST /v1/obfuscate", key: "Discord bot", ms: 210, ok: true, ts: Date.now() - 90_000 },
  { id: "L3", ep: "GET /v1/keys/verify", key: "public", ms: 45, ok: true, ts: Date.now() - 120_000 },
  { id: "L4", ep: "GET /v1/keys/verify", key: "public", ms: 51, ok: false, ts: Date.now() - 200_000 },
  { id: "L5", ep: "POST /v1/obfuscate", key: "Prod CLI", ms: 388, ok: true, ts: Date.now() - 260_000 },
];

function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Understand traffic, verifications and performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {perf.map((p) => (
          <div key={p.label} className="rounded-2xl border border-white/5 bg-card p-5">
            <div className="text-xs text-muted-foreground">{p.label}</div>
            <div className="mt-1 font-display text-2xl font-semibold">{p.value}</div>
            {p.delta && <div className="text-xs text-emerald-400">{p.delta}</div>}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-3 font-display text-lg font-semibold">Requests over time</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={req}>
                <defs>
                  <linearGradient id="a-req" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.746 0.132 226.5)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.746 0.132 226.5)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="d" tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="requests" stroke="oklch(0.746 0.132 226.5)" fill="url(#a-req)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-3 font-display text-lg font-semibold">Verification split</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
                  {pie.map((p) => (
                    <Cell key={p.name} fill={p.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-3 font-display text-lg font-semibold">Top scripts</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "oklch(0.85 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="oklch(0.746 0.132 226.5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <div className="mb-3 font-display text-lg font-semibold">Key verifications (success vs fail)</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={verify}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="d" tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.7 0.03 260)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 260)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12, fontSize: 12 }} />
                <Legend />
                <Line type="monotone" dataKey="ok" stroke="oklch(0.75 0.18 154)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="fail" stroke="oklch(0.63 0.21 25.5)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-card p-5">
        <div className="mb-3 font-display text-lg font-semibold">Recent API activity</div>
        <div className="divide-y divide-white/5">
          {recent.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2.5 text-sm">
              <div className="flex items-center gap-3">
                <span className={"inline-flex h-5 w-5 items-center justify-center rounded-full " + (r.ok ? "bg-emerald-400/10 text-emerald-300" : "bg-destructive/10 text-destructive")}>
                  {r.ok ? "✓" : "×"}
                </span>
                <span className="font-mono text-xs">{r.ep}</span>
                <span className="text-muted-foreground">{r.key}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{r.ms}ms</span>
                <span>{formatRelative(r.ts)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
