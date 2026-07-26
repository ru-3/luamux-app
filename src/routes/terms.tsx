import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Luamux" },
      { name: "description", content: "Luamux terms of service." },
      { property: "og:title", content: "Terms — Luamux" },
      { property: "og:description", content: "Luamux terms of service." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 pb-24">
        <h1 className="font-display text-4xl font-semibold">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">
          These placeholder terms describe your use of the Luamux platform. Replace with your
          finalised legal copy before launch.
        </p>
      </div>
    </SiteShell>
  ),
});
