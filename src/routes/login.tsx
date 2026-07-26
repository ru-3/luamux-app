import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Mail, Lock, MessagesSquare, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { AmbientBackdrop } from "@/components/brand/ambient-backdrop";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";

const searchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
  reset: z.enum(["1"]).optional().catch(undefined),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — Luamux" },
      { name: "description", content: "Sign in to your Luamux account to manage scripts, keys and analytics." },
      { property: "og:title", content: "Sign in — Luamux" },
      { property: "og:description", content: "Sign in to your Luamux dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signInWithGoogle, signInWithDiscord, resetPassword, configured } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState<null | "email" | "google" | "discord">(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!/.+@.+\..+/.test(email)) e.email = "Enter a valid email";
    if (password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!configured) {
      toast.error("Firebase is not configured yet — add VITE_FIREBASE_API_KEY.");
      return;
    }
    if (!validate()) return;
    setBusy("email");
    try {
      await signIn(email, password);
      toast.success("Signed in");
      navigate({ to: search.redirect ?? "/dashboard" });
    } catch (err) {
      setErrors({ form: (err as Error).message ?? "Sign in failed" });
    } finally {
      setBusy(null);
    }
  };

  const onGoogle = async () => {
    if (!configured) return toast.error("Firebase is not configured yet.");
    setBusy("google");
    try {
      await signInWithGoogle();
      navigate({ to: search.redirect ?? "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message ?? "Google sign-in failed");
    } finally {
      setBusy(null);
    }
  };

  const onDiscord = async () => {
    setBusy("discord");
    try {
      await signInWithDiscord();
    } catch (err) {
      toast.error((err as Error).message ?? "Discord sign-in unavailable");
    } finally {
      setBusy(null);
    }
  };

  const onForgot = async () => {
    if (!email) return toast.error("Enter your email first");
    try {
      await resetPassword(email);
      toast.success("Password reset email sent");
    } catch (err) {
      toast.error((err as Error).message ?? "Could not send reset email");
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
              Welcome back to <span className="text-gradient">Luamux</span>
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Sign in to manage your projects, run new obfuscation jobs and review verification logs
              in real time.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li>• Ship protected scripts in seconds</li>
              <li>• Full key/license system with HWID and captcha</li>
              <li>• Developer REST API with rate limiting</li>
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-8 glow"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="font-display text-2xl font-semibold">Sign in</div>
                <div className="text-sm text-muted-foreground">
                  New here?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Create an account
                  </Link>
                </div>
              </div>
              <Link
                to="/"
                className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline-flex"
              >
                <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Home
              </Link>
            </div>

            {search.reset === "1" && (
              <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                Password reset. You can sign in with your new password.
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={onForgot}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">{errors.password}</p>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                />
                Remember me on this device
              </label>

              {errors.form && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {errors.form}
                </div>
              )}

              <Button type="submit" className="w-full glow-sm" disabled={busy !== null}>
                {busy === "email" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign in
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or continue with
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-2">
              <Button variant="outline" onClick={onGoogle} disabled={busy !== null}>
                {busy === "google" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </Button>
              <Button variant="outline" onClick={onDiscord} disabled={busy !== null}>
                {busy === "discord" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessagesSquare className="mr-2 h-4 w-4 text-[oklch(0.7_0.16_285)]" />
                )}
                Continue with Discord
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.5 14.7 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}
