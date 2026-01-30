import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.trim();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  ...(databaseURL ? { databaseURL } : {}),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Prevent re-initializing during hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

/** Realtime Database. Requires NEXT_PUBLIC_FIREBASE_DATABASE_URL in .env */
export const database = databaseURL
  ? getDatabase(app)
  : (() => {
      throw new Error(
        "NEXT_PUBLIC_FIREBASE_DATABASE_URL is required for Realtime Database. Add it to .env (e.g. https://your-project-default-rtdb.region.firebasedatabase.app)"
      );
    })();

export const storage = getStorage(app);

export default app;
