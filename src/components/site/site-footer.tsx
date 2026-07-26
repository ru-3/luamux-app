import { Link } from "@tanstack/react-router";
import { Github, MessagesSquare, Twitter } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { StatusPill } from "@/components/brand/status-pill";

const cols = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/pricing", label: "Pricing" },
      { to: "/docs", label: "API Docs" },
      { to: "/status", label: "Status" },
    ],
  },
  {
    title: "Platform",
    links: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/login", label: "Sign in" },
      { to: "/register", label: "Get started" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms" },
      { to: "/privacy", label: "Privacy" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-white/5 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo size={30} />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The modern platform for protecting, licensing and distributing Lua and Roblox scripts.
          </p>
          <div className="mt-4">
            <StatusPill tone="operational">All systems operational</StatusPill>
          </div>
          <div className="mt-6 flex items-center gap-3 text-muted-foreground">
            <a href="#" aria-label="Discord" className="rounded-lg p-2 hover:bg-white/5 hover:text-foreground">
              <MessagesSquare className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="rounded-lg p-2 hover:bg-white/5 hover:text-foreground">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="GitHub" className="rounded-lg p-2 hover:bg-white/5 hover:text-foreground">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {col.title}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Luamux. All rights reserved.</div>
          <div>Built for creators who ship serious scripts.</div>
        </div>
      </div>
    </footer>
  );
}
