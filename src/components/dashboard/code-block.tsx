import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

/**
 * Simple monospaced code block with a copy-to-clipboard button. We do not
 * bother with syntax highlighting on public docs — it keeps the bundle small
 * and reads well on the dark theme.
 */
export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/5 bg-[oklch(0.14_0.02_260)]", className)}>
      {language && (
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {language}
        </div>
      )}
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md border border-white/10 bg-background/60 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur transition hover:text-foreground"
      >
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="max-h-[420px] overflow-auto p-4 font-mono text-[12.5px] leading-relaxed text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}
