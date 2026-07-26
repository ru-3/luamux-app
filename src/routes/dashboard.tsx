import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
  Settings,
  LifeBuoy,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}
const nav: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
  { to: "/dashboard/support", label: "Support", icon: LifeBuoy },
];

function DashboardLayout() {
  const { user, loading, configured, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && configured && !user) {
      navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [loading, configured, user, navigate, pathname]);

  // Close the drawer whenever a nav link fires a client-side navigation.
  useEffect(() => setSidebarOpen(false), [pathname]);

  if (!configured) {
    return <FirebaseNotConfigured />;
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading your dashboard…</div>
      </div>
    );
  }

  const displayName = user.displayName ?? user.email?.split("@")[0] ?? "user";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 left-1/3 -z-10 h-[500px] w-[700px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 30%, transparent), transparent 70%)" }}
      />

      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/5 bg-sidebar/70 backdrop-blur-xl lg:flex">
        <SidebarContent pathname={pathname} onNav={() => {}} />
      </aside>

      {/* Sidebar (mobile drawer) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-sidebar lg:hidden"
            >
              <SidebarContent pathname={pathname} onNav={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-background/70 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3 md:px-6">
            <button
              className="rounded-lg p-2 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search…"
                className="pl-9"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] p-1 pr-3 transition hover:border-white/15">
                    <Avatar className="h-7 w-7">
                      {user.photoURL && <AvatarImage src={user.photoURL} />}
                      <AvatarFallback className="bg-primary/20 text-xs text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm md:inline">{displayName}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-strong">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings">Account settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, onNav }: { pathname: string; onNav: () => void }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link to="/" className="inline-flex" onClick={onNav}>
          <Logo size={28} />
        </Link>
        <button className="rounded-lg p-2 lg:hidden" onClick={onNav} aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNav}
              className={cn(
                "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground transition",
                active
                  ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent)]"
                  : "hover:bg-white/5 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn("h-4 w-4 transition", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/5 p-3">
        <button
          onClick={async () => {
            await signOut();
            navigate({ to: "/" });
          }}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

function FirebaseNotConfigured() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass-strong max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="font-display text-xl font-semibold">Add your Firebase key</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The dashboard is wired up to Firebase Auth, Firestore, Realtime Database and Storage. Add
          your <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs">VITE_FIREBASE_API_KEY</code>{" "}
          to enable sign-in, projects, scripts, keys and analytics.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
