/**
 * Firebase client initialisation.
 *
 * The web API key is a publishable value (security is enforced by Firestore /
 * Realtime Database / Storage rules, not by hiding it) but it is read from an
 * env var so it is not committed to source. Set `VITE_FIREBASE_API_KEY`.
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;

export const firebaseConfig = {
  apiKey: apiKey ?? "",
  authDomain: "darkrabbit-fa020.firebaseapp.com",
  databaseURL: "https://darkrabbit-fa020-default-rtdb.firebaseio.com",
  projectId: "darkrabbit-fa020",
  storageBucket: "darkrabbit-fa020.firebasestorage.app",
  messagingSenderId: "920072250854",
  appId: "1:920072250854:web:573cc59de15fefb8eb2227",
  measurementId: "G-31FPLH1TTP",
};

/** False when VITE_FIREBASE_API_KEY has not been provided yet. */
export const isFirebaseConfigured = Boolean(apiKey);

let app: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

/**
 * Services are created lazily so that a missing API key surfaces as a friendly
 * in-app banner instead of a module-load crash during SSR/prerender.
 */
export const auth: Auth = new Proxy({} as Auth, {
  get: (_t, prop) => Reflect.get(getAuth(getFirebaseApp()), prop),
});

let _db: Firestore | null = null;
export function getDb(): Firestore {
  if (!_db) _db = getFirestore(getFirebaseApp());
  return _db;
}

let _rtdb: Database | null = null;
export function getRtdb(): Database {
  if (!_rtdb) _rtdb = getDatabase(getFirebaseApp());
  return _rtdb;
}

let _storage: FirebaseStorage | null = null;
export function getAppStorage(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getFirebaseApp());
  return _storage;
}

/** Analytics is browser-only and optional; never throws during SSR. */
export async function initAnalytics() {
  if (typeof window === "undefined" || !isFirebaseConfigured) return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  return (await isSupported()) ? getAnalytics(getFirebaseApp()) : null;
}
