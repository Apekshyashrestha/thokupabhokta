import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, isConfigured } from "../firebase";

/**
 * Live (onSnapshot) collection read for the admin panel, so saves and
 * deletes appear instantly without a manual refresh.
 * Sorting is done client-side to avoid needing composite indexes.
 */
export function useAdminCollection(col) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(isConfigured && !!db);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isConfigured || !db) return;
    const unsubscribe = onSnapshot(
      query(collection(db, col)),
      (snapshot) => {
        setRows(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
        setError(null);
      },
      (e) => {
        setError(e);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [col]);

  return { rows, loading, error };
}
