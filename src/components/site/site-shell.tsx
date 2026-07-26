import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { AmbientBackdrop } from "@/components/brand/ambient-backdrop";

export function SiteShell({ children, showBackdrop = true }: { children: ReactNode; showBackdrop?: boolean }) {
  return (
    <div className="relative min-h-screen bg-background">
      {showBackdrop && <AmbientBackdrop />}
      <SiteHeader />
      <main className="pt-24">{children}</main>
      <SiteFooter />
    </div>
  );
}
