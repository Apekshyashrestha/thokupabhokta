// Firebase — thokupabhokta dynamic backend
// 1. Create project at https://console.firebase.google.com → Create project → thokupabhokta
// 2. Firestore Database → Create. Rules are in /firestore.rules (public read, admin-only write)
// 3. Storage → Get started. Rules are in /storage.rules
// 4. Authentication → Sign-in method → enable Email/Password
// 5. Authentication → Users → Add user for each office staff member
// 6. Project Settings → General → Your apps → Web (</>) → Copy config → paste into /src/firebase.js or .env
//
// The public website needs no sign-in: all content reads are public.
// Only the /#admin panel requires an authenticated staff account.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "REPLACE_WITH_YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "REPLACE_WITH_YOUR_APP_ID",
};

// Set to true once you paste real config; false = uses local static fallback (no errors)
const isConfigured = firebaseConfig.apiKey !== "REPLACE_WITH_YOUR_API_KEY";

let app = null;
let db = null;
let storage = null;
let auth = null;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
} else {
  console.warn("[Firebase] Not configured — using static fallback data. Paste config in src/firebase.js to enable Firestore.");
}

export { app, db, storage, auth, isConfigured };
