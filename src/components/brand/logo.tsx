import logoUrl from "@/assets/zeox-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export function Logo({ className, size = 32, showWordmark = true, wordmarkClassName }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src={logoUrl}
        alt="Zeox"
        width={size}
        height={size}
        className="drop-shadow-[0_0_18px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
        style={{ width: size, height: size }}
      />
      {showWordmark && (
        <span
          className={cn(
            "font-display text-xl font-semibold tracking-tight text-foreground",
            wordmarkClassName,
          )}
        >
          Zeox
        </span>
      )}
    </div>
  );
}
