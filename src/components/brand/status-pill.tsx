import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "operational" | "degraded" | "outage" | "info";

const toneMap: Record<Tone, { dot: string; text: string; bg: string; label: string }> = {
  operational: {
    dot: "bg-[oklch(0.75_0.18_154)] text-[oklch(0.75_0.18_154)]",
    text: "text-[oklch(0.83_0.14_154)]",
    bg: "bg-[color-mix(in_oklab,oklch(0.75_0.18_154)_14%,transparent)]",
    label: "Operational",
  },
  degraded: {
    dot: "bg-[oklch(0.82_0.16_84)] text-[oklch(0.82_0.16_84)]",
    text: "text-[oklch(0.88_0.13_84)]",
    bg: "bg-[color-mix(in_oklab,oklch(0.82_0.16_84)_14%,transparent)]",
    label: "Degraded",
  },
  outage: {
    dot: "bg-destructive text-destructive",
    text: "text-destructive",
    bg: "bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)]",
    label: "Outage",
  },
  info: {
    dot: "bg-primary text-primary",
    text: "text-primary",
    bg: "bg-[color-mix(in_oklab,var(--primary)_14%,transparent)]",
    label: "Info",
  },
};

export function StatusDot({ tone = "operational", className }: { tone?: Tone; className?: string }) {
  const t = toneMap[tone];
  return (
    <span className={cn("relative inline-flex h-2.5 w-2.5", className)}>
      <span
        className={cn("absolute inset-0 rounded-full opacity-70 animate-ping-dot", t.dot.split(" ")[0])}
      />
      <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", t.dot.split(" ")[0])} />
    </span>
  );
}

export function StatusPill({
  tone = "operational",
  children,
  className,
}: {
  tone?: Tone;
  children?: ReactNode;
  className?: string;
}) {
  const t = toneMap[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium",
        t.bg,
        t.text,
        className,
      )}
    >
      <StatusDot tone={tone} />
      {children ?? t.label}
    </span>
  );
}
