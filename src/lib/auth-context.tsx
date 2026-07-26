import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, getDb, isFirebaseConfigured } from "./firebase";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithDiscord: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function ensureUserDoc(user: User, extra?: { username?: string }) {
  const db = getDb();
  const ref = doc(db, "users", user.uid);
  const existing = await getDoc(ref);
  if (!existing.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      username: extra?.username ?? user.displayName ?? user.email?.split("@")[0] ?? "user",
      avatarUrl: user.photoURL ?? null,
      plan: "free",
      createdAt: serverTimestamp(),
    });
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserDoc(cred.user);
  }, []);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (username) await updateProfile(cred.user, { displayName: username });
    await ensureUserDoc(cred.user, { username });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await ensureUserDoc(cred.user);
  }, []);

  const signInWithDiscord = useCallback(async () => {
    // Discord OAuth requires a server-side token exchange (custom-token flow).
    // Not deployable from the client — surfaces a friendly error.
    throw new Error(
      "Discord sign-in requires a Firebase Cloud Function to complete OAuth. Deploy the function and wire it up here.",
    );
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configured: isFirebaseConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithDiscord,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
