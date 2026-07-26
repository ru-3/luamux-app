import { cn } from "@/lib/utils";

/**
 * Ambient background used on public pages: soft floating gradient orbs plus
 * a faint grid overlay. Absolutely positioned so it never affects layout.
 */
export function AmbientBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div
        className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-3xl animate-orb"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 45%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute top-40 -left-32 h-[420px] w-[420px] rounded-full blur-3xl animate-orb"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, oklch(0.7 0.18 285) 35%, transparent), transparent 70%)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="absolute bottom-0 -right-40 h-[500px] w-[500px] rounded-full blur-3xl animate-orb"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, oklch(0.7 0.15 200) 35%, transparent), transparent 70%)",
          animationDelay: "-10s",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
