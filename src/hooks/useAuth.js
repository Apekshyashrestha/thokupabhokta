import { useEffect, useMemo, useState } from "react";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, isConfigured } from "../firebase";

/**
 * Staff authentication for the /#admin panel.
 * Firestore security rules are the real gate; this only hides the panel
 * from people who are not on the allowed-emails list.
 */
const allowedEmails = (import.meta.env.VITE_FIREBASE_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const AUTH_ERRORS = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/user-not-found": "No account found for this email. Add it in Firebase Console → Authentication → Users.",
  "auth/wrong-password": "Wrong email or password.",
  "auth/invalid-email": "That email address is not valid.",
  "auth/too-many-requests": "Too many attempts. Please try again in a minute.",
  "auth/operation-not-allowed":
    "Email/Password sign-in is not enabled yet. Firebase Console → Authentication → Sign-in method → enable Email/Password.",
  "auth/network-request-failed": "Network error. Check your internet connection.",
  "auth/configuration-not-found":
    "This Firebase project has no Authentication set up. Enable Authentication first.",
};

export function useAuth() {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(isConfigured && !!auth);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isConfigured || !auth) return;
    const unsubscribe = onAuthStateChanged(
      auth,
      (next) => {
        setUser(next);
        setInitialising(false);
      },
      () => {
        setUser(null);
        setInitialising(false);
      },
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) setPersistence(auth, browserLocalPersistence).catch(() => {});
  }, [user]);

  const isAllowed = useMemo(() => {
    if (!user) return false;
    if (allowedEmails.length === 0) return true;
    return allowedEmails.includes((user.email || "").toLowerCase());
  }, [user]);

  const signIn = async (email, password) => {
    setError("");
    if (!isConfigured || !auth) {
      setError("Firebase is not configured yet. Add your config to .env first.");
      return false;
    }
    setSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return true;
    } catch (e) {
      setError(AUTH_ERRORS[e?.code] || e?.message || "Sign-in failed.");
      return false;
    } finally {
      setSigningIn(false);
    }
  };

  const signOutUser = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setError("");
    } catch (e) {
      setError(e?.message || "Could not sign out.");
    }
  };

  return { user, isAllowed, initialising, signingIn, error, signIn, signOutUser, setError };
}
