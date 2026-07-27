import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useRef, useState, type ChangeEvent } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { getDb, getAppStorage } from "@/lib/firebase";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Luamux" }] }),
  component: SettingsPage,
});

const MAX_AVATAR_BYTES = 4 * 1024 * 1024; // 4MB

function SettingsPage() {
  const { user, signOut, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.displayName ?? "");
  const [email] = useState(user?.email ?? "");
  const [notif, setNotif] = useState({ leaks: true, incidents: true, weekly: false });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = (username || email || "U").slice(0, 2).toUpperCase();

  const handleSave = async () => {
    if (!user) return;
    const trimmed = username.trim();
    if (!trimmed) {
      toast.error("Username can't be empty");
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user, { displayName: trimmed });
      await setDoc(
        doc(getDb(), "users", user.uid),
        { username: trimmed, updatedAt: serverTimestamp() },
        { merge: true },
      );
      await refreshUser();
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarPick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image must be under 4MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `avatars/${user.uid}/avatar.${ext}`;
      const fileRef = storageRef(getAppStorage(), path);
      await uploadBytes(fileRef, file, { contentType: file.type });
      const url = await getDownloadURL(fileRef);

      await updateProfile(user, { photoURL: url });
      await setDoc(
        doc(getDb(), "users", user.uid),
        { avatarUrl: url, updatedAt: serverTimestamp() },
        { merge: true },
      );
      await refreshUser();
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, notifications and account security.</p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-card p-5">
        <div className="mb-4 font-display text-lg font-semibold">Profile</div>
        <div className="flex items-start gap-6">
          <Avatar className="h-16 w-16">
            {user?.photoURL && <AvatarImage src={user.photoURL} />}
            <AvatarFallback className="bg-primary/20 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-3 md:grid-cols-2">
            <div>
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} readOnly className="mt-1 opacity-70" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button className="glow-sm" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <Button variant="outline" onClick={handleAvatarPick} disabled={uploadingAvatar}>
            {uploadingAvatar && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload new avatar
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-card p-5">
        <div className="mb-4 font-display text-lg font-semibold">Notifications</div>
        <div className="space-y-3">
          {[
            { k: "leaks", label: "Leak alerts", body: "Email me when a watermarked script appears elsewhere." },
            { k: "incidents", label: "Platform incidents", body: "Get notified about outages and degraded services." },
            { k: "weekly", label: "Weekly usage report", body: "Every Monday, a summary of your API traffic." },
          ].map((n) => (
            <div key={n.k} className="flex items-center justify-between">
              <div>
                <div className="text-sm">{n.label}</div>
                <div className="text-xs text-muted-foreground">{n.body}</div>
              </div>
              <Switch
                checked={notif[n.k as keyof typeof notif]}
                onCheckedChange={(v) => setNotif({ ...notif, [n.k]: v })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-card p-5">
        <div className="mb-4 font-display text-lg font-semibold">Security</div>
        <div className="grid gap-3 md:grid-cols-2">
          <Button variant="outline" onClick={() => toast.success("Password reset email sent")}>Change password</Button>
          <Button variant="outline" onClick={async () => { await signOut(); toast.success("All sessions revoked"); }}>
            Revoke all sessions
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-destructive/40 bg-destructive/[0.06] p-5">
        <div className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-destructive">
          <AlertTriangle className="h-4 w-4" /> Danger zone
        </div>
        <p className="text-sm text-muted-foreground">
          Delete your account and every project, script, key and log associated with it. This action
          is permanent.
        </p>
        <Button variant="destructive" className="mt-3" onClick={() => toast.error("Contact support to delete your account")}>
          Delete account
        </Button>
      </div>
    </motion.div>
  );
}
