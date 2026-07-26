import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Luamux" },
      { name: "description", content: "Luamux privacy policy." },
      { property: "og:title", content: "Privacy — Luamux" },
      { property: "og:description", content: "How Luamux handles your data." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 pb-24">
        <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          Placeholder privacy policy. Replace with your finalised legal copy before launch.
        </p>
      </div>
    </SiteShell>
  ),
});
