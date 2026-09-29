import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, isConfigured } from "../firebase";
import { CONTENT_DEFAULTS } from "./contentDefaults";
import { ContentContext } from "./useContent";

const mergeBlock = (fallback, stored) => {
  // No saved document for this block yet: keep the built-in text.
  if (!stored || typeof stored !== "object") return fallback;
  // A saved list is honoured even when empty, so staff can clear a list
  // (delete every committee member, remove all links) without it reappearing.
  if (Array.isArray(fallback)) return Array.isArray(stored) ? stored : fallback;
  const merged = { ...fallback, ...stored };
  delete merged.updatedAt;
  delete merged.id;
  return merged;
};

/**
 * Loads every editable content block in a single live read and layers it over
 * the static defaults, so a Firestore outage or an unsaved block can never
 * blank out the public site.
 */
export function ContentProvider({ children }) {
  const [blocks, setBlocks] = useState({});

  useEffect(() => {
    if (!isConfigured || !db) return;
    const unsubscribe = onSnapshot(
      collection(db, "content"),
      (snapshot) => {
        const next = {};
        snapshot.docs.forEach((d) => {
          next[d.id] = d.data();
        });
        setBlocks(next);
      },
      (e) => console.warn("[content] using static defaults:", e?.message),
    );
    return unsubscribe;
  }, []);

  const value = useMemo(() => {
    const out = {};
    for (const [id, fallback] of Object.entries(CONTENT_DEFAULTS)) {
      const merged = mergeBlock(fallback, blocks[id]);
      // Never hand a non-array to a block the site renders with .map().
      out[id] = Array.isArray(fallback) && !Array.isArray(merged) ? [] : merged;
      if (Array.isArray(out[id])) {
        out[id] = out[id].filter((item) => item !== null && item !== undefined);
      }
    }
    return out;
  }, [blocks]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
