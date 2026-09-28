import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export function describeWriteError(e) {
  const code = e?.code || "";
  if (code === "permission-denied") {
    return "Firestore rules blocked this change. Deploy firestore.rules and make sure your signed-in email is in the allowed list.";
  }
  if (code === "unavailable") return "No connection. Check your internet and try again.";
  if (code === "unauthenticated") return "Your session expired. Please log in again.";
  return e?.message || "Save failed.";
}

export async function saveDocument(colName, docId, data) {
  await setDoc(doc(db, colName, String(docId)), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function removeDocument(colName, docId) {
  await deleteDoc(doc(db, colName, String(docId)));
}

export function nextNumericId(rows) {
  const max = rows.reduce((acc, r) => {
    const n = Number(r.id);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return max + 1;
}

export function toTags(value) {
  return String(value || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function fromTags(list) {
  return Array.isArray(list) ? list.join(", ") : String(list || "");
}

export function toIsoDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function formatTimestamp(value) {
  if (!value) return "";
  if (typeof value.toDate === "function") return value.toDate().toLocaleString();
  if (typeof value === "string") return new Date(value).toLocaleString();
  return "";
}
