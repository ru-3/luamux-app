import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Luamux" },
      { name: "description", content: "Simple, transparent pricing for Luamux script protection, licensing and distribution." },
      { property: "og:title", content: "Pricing — Luamux" },
      { property: "og:description", content: "Free tier plus scalable plans for teams." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["Up to 5 protected scripts", "1,000 API requests / day", "Basic obfuscation", "Community support"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    features: [
      "Unlimited scripts",
      "50,000 API requests / day",
      "All protection features",
      "Watermarking + HWID locks",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Studio",
    price: "$79",
    period: "/ month",
    features: [
      "Everything in Pro",
      "500,000 API requests / day",
      "Team seats + audit log",
      "Custom rate limits",
      "SLA + dedicated support",
    ],
    cta: "Talk to us",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 pb-24 text-center">
        <h1 className="font-display text-4xl font-semibold md:text-6xl">
          Simple, honest <span className="text-gradient">pricing</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Start free, upgrade when you need more volume. No per-seat games, no gotcha overage
          charges — we tell you when you're about to run out.
        </p>

        <div className="mt-14 grid gap-5 text-left md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                "glass-strong relative overflow-hidden rounded-3xl p-8 " +
                (t.highlight ? "border-primary/40 glow" : "")
              }
            >
              {t.highlight && (
                <div className="absolute right-6 top-6 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                  Most popular
                </div>
              )}
              <div className="font-display text-lg font-semibold">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className={"mt-8 w-full " + (t.highlight ? "glow-sm" : "")} variant={t.highlight ? "default" : "outline"}>
                <Link to="/register">{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
