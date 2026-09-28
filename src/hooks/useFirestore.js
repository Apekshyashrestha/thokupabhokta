import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db, isConfigured } from "../firebase";

/**
 * Generic hook: fetch collection from Firestore with static fallback
 * @param {string} col - collection name
 * @param {Array} fallback - static data if Firebase not configured or fetch fails
 * @param {string} orderField - optional orderBy field
 */
export function useFirestoreCollection(col, fallback, orderField = null) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(isConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const colRef = collection(db, col);
        const q = orderField ? query(colRef, orderBy(orderField)) : query(colRef);
        const snap = await getDocs(q);
        if (snap.empty) {
          // keep fallback if collection empty (not yet seeded)
          if (!cancelled) setLoading(false);
          return;
        }
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // normalize id to number if possible, keep fallback shape
        if (!cancelled) {
          setData(rows);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          console.warn(`[Firestore:${col}] fallback due to`, e?.message);
          setError(e);
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [col, orderField]);

  return { data, loading, error, isLive: isConfigured && !loading && !error };
}
