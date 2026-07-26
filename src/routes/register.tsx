import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { AmbientBackdrop } from "@/components/brand/ambient-backdrop";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your Luamux account" },
      { name: "description", content: "Create a free Luamux account to protect, license and distribute your Lua/Roblox scripts." },
      { property: "og:title", content: "Create your Luamux account" },
      { property: "og:description", content: "Free Luamux account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp, signInWithGoogle, configured } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<null | "email" | "google">(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string; username?: string; form?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (username.trim().length < 3) e.username = "At least 3 characters";
    if (!/.+@.+\..+/.test(email)) e.email = "Enter a valid email";
    if (password.length < 8) e.password = "At least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!configured) return toast.error("Firebase is not configured yet.");
    if (!validate()) return;
    setBusy("email");
    try {
      await signUp(email, password, username.trim());
      toast.success("Welcome to Luamux");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setErrors({ form: (err as Error).message ?? "Sign up failed" });
    } finally {
      setBusy(null);
    }
  };

  const onGoogle = async () => {
    if (!configured) return toast.error("Firebase is not configured yet.");
    setBusy("google");
    try {
      await signInWithGoogle();
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message ?? "Google sign-in failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <AmbientBackdrop />
      <SiteHeader />
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 pt-24">
        <div className="grid w-full items-center gap-10 md:grid-cols-2">
          <div className="hidden md:block">
            <Logo size={40} />
            <h1 className="mt-8 font-display text-4xl font-semibold leading-tight">
              Start protecting your <span className="text-gradient">Lua scripts</span>
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Create your Luamux workspace in seconds. No credit card, generous free tier, upgrade
              when you're ready to scale.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-8 glow"
          >
            <div className="mb-6">
              <div className="font-display text-2xl font-semibold">Create your account</div>
              <div className="text-sm text-muted-foreground">
                Already have one?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="scripter"
                    className="pl-9"
                  />
                </div>
                {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="pl-9"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
              </div>

              {errors.form && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {errors.form}
                </div>
              )}

              <Button type="submit" className="w-full glow-sm" disabled={busy !== null}>
                {busy === "email" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create account
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button variant="outline" className="w-full" onClick={onGoogle} disabled={busy !== null}>
              {busy === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Continue with Google
            </Button>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By creating an account you agree to our{" "}
              <Link to="/terms" className="hover:text-foreground">Terms</Link> and{" "}
              <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
