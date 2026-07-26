import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Cloud,
  LayoutDashboard,
  Gauge,
  Sparkles,
  Lock,
  KeyRound,
  BarChart3,
  Code2,
  Boxes,
  Rocket,
  MessagesSquare,
} from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { StatusPill } from "@/components/brand/status-pill";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { formatNumber } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luamux — Powerful Lua Script Protection Platform" },
      {
        name: "description",
        content:
          "Luamux is a modern platform for protecting, licensing and distributing Lua and Roblox scripts. Obfuscation engine, key system, developer API and live analytics.",
      },
      { property: "og:title", content: "Luamux — Lua Script Protection Platform" },
      {
        property: "og:description",
        content:
          "Protect, license and distribute your Lua/Roblox scripts with the Luamux obfuscation engine, key system and developer API.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Zap, title: "Fast", body: "Sub-second obfuscation on scripts up to hundreds of KB, powered by our edge engine." },
  { icon: ShieldCheck, title: "Secure", body: "String encryption, control-flow obfuscation and anti-tamper baked into every build." },
  { icon: Cloud, title: "Cloud based", body: "Zero installs. Protect, publish and manage keys straight from the dashboard or API." },
  { icon: LayoutDashboard, title: "Modern dashboard", body: "A polished workspace for projects, scripts, keys, analytics and audit logs." },
  { icon: Gauge, title: "High performance", body: "Backed by a global edge with a live status page and per-key rate limiting." },
  { icon: Sparkles, title: "Easy to use", body: "Sensible defaults, copy-paste snippets, and shareable loadstring URLs in one click." },
];

const highlights = [
  {
    icon: Lock,
    title: "Protection that holds up",
    body: "Multiple layers — variable mangling, string encryption, control-flow wrapping and integrity checks — designed for real-world Roblox environments.",
  },
  {
    icon: KeyRound,
    title: "Full license control",
    body: "Issue keys per script with HWID locks, expiry, usage limits, captcha and Discord-server bypasses. Revoke and rotate any time.",
  },
  {
    icon: BarChart3,
    title: "Analytics you can act on",
    body: "See verification success rates, requests per second, and top scripts in real time. Trace leaks back to a single watermark ID.",
  },
];

const stats = [
  { label: "Projects protected", value: 12480 },
  { label: "Active users", value: 3820 },
  { label: "API requests / day", value: 942000 },
  { label: "Scripts served", value: 5210000 },
];

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const mv = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = formatNumber(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, value, mv]);

  return <span ref={ref}>0</span>;
}

function Home() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 flex justify-center">
              <Link
                to="/status"
                className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
              >
                <StatusPill tone="operational">All systems operational</StatusPill>
                <span className="hidden sm:inline">— live status</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <h1 className="text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              Powerful{" "}
              <span className="text-gradient">Lua Script</span>
              <br className="hidden md:block" /> Protection Platform
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Luamux is a modern platform for obfuscating, licensing and distributing your Lua and
              Roblox scripts. Ship serious code with real protection, granular key control and
              analytics that actually tell you what happened.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="glow-sm">
                <Link to="/register">
                  Get started free
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#" target="_blank" rel="noreferrer">
                  <MessagesSquare className="mr-1.5 h-4 w-4" />
                  Join Discord
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Hero mock */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="glass-strong overflow-hidden rounded-3xl p-2 md:p-3 glow">
              <div className="rounded-2xl border border-white/5 bg-[oklch(0.16_0.02_260)]">
                <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <div className="ml-3 hidden font-mono text-[11px] text-muted-foreground sm:block">
                    luamux.app / obfuscator
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <StatusPill tone="operational">live</StatusPill>
                  </div>
                </div>
                <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                  <aside className="hidden flex-col gap-1 border-r border-white/5 p-4 md:flex">
                    <div className="mb-3">
                      <Logo size={22} />
                    </div>
                    {[
                      { icon: LayoutDashboard, label: "Overview" },
                      { icon: Boxes, label: "Projects" },
                      { icon: Code2, label: "Scripts" },
                      { icon: ShieldCheck, label: "Obfuscator", active: true },
                      { icon: KeyRound, label: "Key System" },
                      { icon: BarChart3, label: "Analytics" },
                    ].map((i) => (
                      <div
                        key={i.label}
                        className={
                          "flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs " +
                          (i.active
                            ? "bg-primary/15 text-primary"
                            : "text-muted-foreground")
                        }
                      >
                        <i.icon className="h-3.5 w-3.5" />
                        {i.label}
                      </div>
                    ))}
                  </aside>
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Good to see you,</div>
                        <div className="font-display text-xl font-semibold">Ready to protect a script?</div>
                      </div>
                      <Button size="sm" className="glow-sm">
                        <Rocket className="mr-1.5 h-3.5 w-3.5" />
                        Obfuscate
                      </Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        { label: "Total Scripts", value: "1,284", delta: "+3.3%" },
                        { label: "API Requests", value: "319k", delta: "+5.4%", accent: true },
                        { label: "Active Keys", value: "13,920", delta: "+5.4%" },
                      ].map((c) => (
                        <div
                          key={c.label}
                          className={
                            "rounded-2xl border p-4 " +
                            (c.accent
                              ? "border-primary/30 bg-primary text-primary-foreground glow-sm"
                              : "border-white/5 bg-white/[0.02]")
                          }
                        >
                          <div className="text-xs opacity-70">{c.label}</div>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-display text-2xl font-semibold">{c.value}</span>
                            <span className="text-xs text-emerald-400">{c.delta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Requests / hour</div>
                          <div className="text-[11px] text-muted-foreground">Last 24h</div>
                        </div>
                        <div className="flex h-24 items-end gap-1.5">
                          {[40, 78, 55, 92, 60, 88, 70, 96, 62, 84, 55, 90].map((h, idx) => (
                            <div
                              key={idx}
                              className="flex-1 rounded-t-md bg-gradient-to-t from-primary/30 to-primary"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Recent verifications</div>
                          <div className="text-[11px] text-muted-foreground">live</div>
                        </div>
                        <ul className="space-y-2 text-xs">
                          {[
                            { k: "K-9F2A", ok: true, m: "roblox exec / hwid ok" },
                            { k: "K-7C11", ok: true, m: "captcha passed" },
                            { k: "K-A280", ok: false, m: "expired" },
                            { k: "K-Z33H", ok: true, m: "discord verified" },
                          ].map((v) => (
                            <li key={v.k} className="flex items-center justify-between">
                              <span className="font-mono text-muted-foreground">{v.k}</span>
                              <span className={v.ok ? "text-emerald-400" : "text-destructive"}>{v.m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to protect and ship Lua scripts"
            subtitle="One platform for obfuscation, licensing, distribution and analytics — with a developer API that plugs into your own tools."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass card-hover group rounded-2xl p-6"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary/20">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Luamux */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Why Luamux"
            title="Built for creators who ship serious scripts"
            subtitle="Every Luamux subsystem is designed around one goal — make it hard to steal, easy to sell, and simple to run."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-strong relative overflow-hidden rounded-3xl p-8"
              >
                <div
                  aria-hidden
                  className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
                />
                <h.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-display text-xl font-semibold">{h.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{h.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="glass-strong overflow-hidden rounded-3xl p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <div className="font-display text-4xl font-semibold md:text-5xl">
                    <AnimatedCounter value={s.value} />
                    <span className="text-primary">+</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center md:p-16 glow">
            <div
              aria-hidden
              className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-primary/25 to-transparent blur-3xl"
            />
            <h2 className="relative font-display text-3xl font-semibold md:text-5xl">
              Ready to protect your next script?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Create a free Luamux account, upload a script, and get a protected loadstring URL in
              under a minute.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="glow-sm">
                <Link to="/register">
                  Start protecting scripts
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/docs">Read the API docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-balance font-display text-3xl font-semibold md:text-5xl">
        {title}
      </h2>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
