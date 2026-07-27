import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MessagesSquare, Mail, BookOpen, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/support")({
  head: () => ({ meta: [{ title: "Support — Luamux" }] }),
  component: SupportPage,
});

// Set this to your real Discord invite (e.g. https://discord.gg/xxxxxxx).
// Reading it from an env var means you don't have to touch this file again
// when the invite link changes — just set VITE_DISCORD_INVITE in your env.
const DISCORD_INVITE = import.meta.env.VITE_DISCORD_INVITE || "";

function SupportPage() {
  const contactCards = [
    {
      icon: MessagesSquare,
      title: "Discord community",
      body: "Fastest way to reach us. Most questions get answered in minutes.",
      cta: DISCORD_INVITE ? "Open Discord" : "Discord link not set",
      href: DISCORD_INVITE || undefined,
      disabled: !DISCORD_INVITE,
    },
    {
      icon: Mail,
      title: "Email support",
      body: "For account, billing and security questions.",
      cta: "support@luamux.app",
      href: "mailto:support@luamux.app",
    },
    {
      icon: BookOpen,
      title: "Documentation",
      body: "Guides, API reference and best practices.",
      cta: "Read the docs",
      to: "/docs",
    },
  ];

  const legalCards = [
    {
      icon: FileText,
      title: "Terms & conditions",
      body: "The rules for using Luamux and the obfuscation API.",
      cta: "Read the terms",
      to: "/terms",
    },
    {
      icon: ShieldCheck,
      title: "Privacy policy",
      body: "What data we collect and how it's used.",
      cta: "Read the policy",
      to: "/privacy",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Support</h1>
        <p className="text-sm text-muted-foreground">Talk to a human, browse the docs, or ping us on Discord.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {contactCards.map((c) => (
          <div key={c.title} className="glass card-hover rounded-2xl p-5">
            <c.icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display text-lg font-semibold">{c.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
            {c.to ? (
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to={c.to}>{c.cta}</Link>
              </Button>
            ) : c.disabled ? (
              <Button variant="outline" size="sm" className="mt-4" disabled>
                {c.cta}
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm" className="mt-4">
                <a href={c.href} target="_blank" rel="noreferrer">
                  {c.cta}
                </a>
              </Button>
            )}
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 font-display text-lg font-semibold">Legal</div>
        <div className="grid gap-4 md:grid-cols-2">
          {legalCards.map((c) => (
            <div key={c.title} className="glass card-hover rounded-2xl p-5">
              <c.icon className="h-5 w-5 text-primary" />
              <div className="mt-3 font-display text-lg font-semibold">{c.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to={c.to}>{c.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
