import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MessagesSquare, Mail, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/support")({
  head: () => ({ meta: [{ title: "Support — Luamux" }] }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Support</h1>
        <p className="text-sm text-muted-foreground">Talk to a human, browse the docs, or ping us on Discord.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: MessagesSquare, title: "Discord community", body: "Fastest way to reach us. Most questions get answered in minutes.", cta: "Open Discord", href: "#" },
          { icon: Mail, title: "Email support", body: "For account, billing and security questions.", cta: "support@luamux.app", href: "mailto:support@luamux.app" },
          { icon: BookOpen, title: "Documentation", body: "Guides, API reference and best practices.", cta: "Read the docs", to: "/docs" },
        ].map((c) => (
          <div key={c.title} className="glass card-hover rounded-2xl p-5">
            <c.icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display text-lg font-semibold">{c.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
            {c.to ? (
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to={c.to}>{c.cta}</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm" className="mt-4">
                <a href={c.href}>{c.cta}</a>
              </Button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
