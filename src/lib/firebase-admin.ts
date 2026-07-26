/**
 * Server-only Firebase Admin initialisation.
 *
 * Never import this from client code — it needs a service account key and
 * must only run on the server (API routes / cron handlers). Set
 * `FIREBASE_SERVICE_ACCOUNT_KEY` as a server env var (NOT prefixed with
 * VITE_, so it is never bundled into client JS):
 *
 *   - Firebase Console -> Project settings -> Service accounts
 *     -> Generate new private key (downloads a JSON file)
 *   - Either paste the raw JSON as the env var value, or base64-encode it
 *     first (recommended, avoids quoting issues in most host UIs):
 *       base64 -i service-account.json | tr -d '\n'
 */
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set");
  }
  const trimmed = raw.trim();
  const json = trimmed.startsWith("{") ? trimmed : Buffer.from(trimmed, "base64").toString("utf8");
  return JSON.parse(json);
}

function getAdminApp(): App {
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp({ credential: cert(getServiceAccount()) });
  }
  return app;
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}
