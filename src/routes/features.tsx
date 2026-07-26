import { createFileRoute } from "@tanstack/react-router";
import { Zap, ShieldCheck, KeyRound, BarChart3, Cloud, Rocket, Lock, Boxes, Code2 } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Luamux" },
      { name: "description", content: "Explore every Luamux feature: obfuscation engine, key/license system, developer REST API, analytics and publish links." },
      { property: "og:title", content: "Features — Luamux" },
      { property: "og:description", content: "The full Luamux feature set." },
    ],
  }),
  component: FeaturesPage,
});

const groups = [
  {
    title: "Protection",
    body: "Layered source-level obfuscation tuned for Lua/Luau — strong enough for real-world Roblox targets.",
    items: [
      { icon: Lock, name: "String encryption", body: "XOR-encoded string tables decrypted at runtime with per-build keys." },
      { icon: ShieldCheck, name: "Anti-tamper", body: "Integrity check aborts execution if the script has been modified." },
      { icon: Code2, name: "Control-flow obfuscation", body: "Statements wrapped in opaque predicate blocks that resist casual reading." },
      { icon: Boxes, name: "Variable mangling", body: "Local identifiers renamed to short confusing tokens." },
    ],
  },
  {
    title: "Licensing",
    body: "A complete key/license system so you can gate access, trace leaks and revoke abuse instantly.",
    items: [
      { icon: KeyRound, name: "HWID-bound keys", body: "One key, one machine — with optional session limits." },
      { icon: Cloud, name: "Discord & captcha gates", body: "Require Discord membership or CAPTCHA to issue a key." },
      { icon: Rocket, name: "Publish & deploy", body: "Every protected script gets a shareable loadstring URL." },
      { icon: BarChart3, name: "Verification analytics", body: "Success / failure rates, top scripts, per-key usage." },
    ],
  },
  {
    title: "For developers",
    body: "A first-class REST API with rate limiting, so you can wire Luamux into your CLI, Discord bot or CI pipeline.",
    items: [
      { icon: Zap, name: "Fast REST API", body: "POST source, get a protected build back in one round trip." },
      { icon: Cloud, name: "Rate limiting", body: "Per-key, per-minute and per-day quotas visible in the dashboard." },
      { icon: BarChart3, name: "Unified job history", body: "Dashboard and API jobs stream into one audit log." },
    ],
  },
];

function FeaturesPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold md:text-6xl">
            The full <span className="text-gradient">Luamux</span> feature set
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Everything you need to protect, license and distribute Lua scripts — one platform,
            one dashboard, one API.
          </p>
        </div>

        <div className="mt-16 space-y-14">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="mb-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {g.title}
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">{g.body}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {g.items.map((i) => (
                  <div key={i.name} className="glass card-hover rounded-2xl p-5">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <i.icon className="h-4 w-4" />
                    </div>
                    <div className="mt-3 font-medium">{i.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{i.body}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
