import { useMemo, useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { describeWriteError, formatTimestamp, removeDocument } from "./adminUtils";

const FILTERS = [
  { key: "unread", label: "Unread" },
  { key: "all", label: "All" },
  { key: "contact", label: "Contact form" },
  { key: "product", label: "Product enquiry" },
];

const waLink = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/9${digits.length === 10 ? digits : digits.replace(/^0+/, "")}`;
};

export default function EnquiryInbox() {
  const { rows, loading, error } = useAdminCollection("enquiries");
  const [filter, setFilter] = useState("unread");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [status, setStatus] = useState(null);

  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime() || 0;
        const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime() || 0;
        return tb - ta;
      }),
    [rows],
  );

  const unreadCount = useMemo(() => rows.filter((r) => r.read !== true).length, [rows]);

  const counts = useMemo(
    () => ({
      unread: rows.filter((r) => r.read !== true).length,
      all: rows.length,
      contact: rows.filter((r) => r.type === "contact").length,
      product: rows.filter((r) => r.type !== "contact").length,
    }),
    [rows],
  );

  const visible = useMemo(() => {
    let list = sorted;
    if (filter === "unread") list = list.filter((r) => r.read !== true);
    if (filter === "contact") list = list.filter((r) => r.type === "contact");
    if (filter === "product") list = list.filter((r) => r.type !== "contact");
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        [r.name, r.phone, r.email, r.coop, r.message, r.productTitle, r.qty]
          .map((v) => String(v || "").toLowerCase())
          .some((v) => v.includes(q)),
      );
    }
    return list;
  }, [sorted, filter, search]);

  const markRead = async (row, isRead) => {
    setStatus(null);
    try {
      await updateDoc(doc(db, "enquiries", row.id), {
        read: isRead,
        readAt: isRead ? serverTimestamp() : null,
      });
    } catch (e) {
      setStatus({ type: "error", message: describeWriteError(e) });
    }
  };

  const markAllRead = async () => {
    setStatus(null);
    try {
      const batch = await Promise.all(
        rows
          .filter((r) => r.read !== true)
          .map((r) => updateDoc(doc(db, "enquiries", r.id), { read: true, readAt: serverTimestamp() })),
      );
      if (!batch.length) setStatus({ type: "success", message: "Nothing left to mark as read." });
    } catch (e) {
      setStatus({ type: "error", message: describeWriteError(e) });
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete this enquiry from ${row.name || "unknown sender"}?`)) return;
    setStatus(null);
    try {
      await removeDocument("enquiries", row.id);
      setStatus({ type: "success", message: "Enquiry deleted." });
    } catch (e) {
      setStatus({ type: "error", message: describeWriteError(e) });
    }
  };

  return (
    <div>
      <div className="adm-toolbar adm-toolbar-wrap">
        <div className="adm-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`adm-tab ${filter === f.key ? "is-active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="adm-tab-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        <input
          className="adm-input adm-search"
          placeholder="Search name, phone, message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {unreadCount > 0 && (
          <button type="button" className="adm-btn adm-btn-ghost" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {status && <p className={status.type === "error" ? "adm-error" : "adm-success"}>{status.message}</p>}
      {error && <p className="adm-error">Could not load enquiries: {error.message}</p>}
      {loading && <p className="adm-hint">Loading enquiries...</p>}
      {!loading && !visible.length && (
        <p className="adm-empty">
          {filter === "unread" ? "No unread enquiries. New submissions will appear here instantly." : "No enquiries found."}
        </p>
      )}

      <div className="adm-list">
        {visible.map((r) => {
          const isOpen = openId === r.id;
          const isUnread = r.read !== true;
          const wa = waLink(r.phone);
          return (
            <div className={`adm-enquiry ${isUnread ? "is-unread" : ""}`} key={r.id}>
              <button
                type="button"
                className="adm-enquiry-head"
                onClick={() => {
                  setOpenId(isOpen ? null : r.id);
                  if (!isOpen && isUnread) markRead(r, true);
                }}
              >
                <span className="adm-enquiry-dot" aria-hidden="true" />
                <span className="adm-enquiry-title">
                  <strong>{r.name || "Unnamed sender"}</strong>
                  <span className="adm-meta">
                    {r.type === "contact" ? "Contact form" : r.productTitle ? `Enquiry: ${r.productTitle}` : "Product enquiry"}
                    {r.via ? ` · via ${r.via}` : ""} · {formatTimestamp(r.createdAt) || "date unknown"}
                  </span>
                </span>
                <span className="adm-enquiry-chevron">{isOpen ? "-" : "+"}</span>
              </button>

              {isOpen && (
                <div className="adm-enquiry-body">
                  <dl className="adm-dl">
                    {r.phone && (
                      <>
                        <dt>Phone</dt>
                        <dd>{r.phone}</dd>
                      </>
                    )}
                    {r.email && (
                      <>
                        <dt>Email</dt>
                        <dd>{r.email}</dd>
                      </>
                    )}
                    {r.coop && (
                      <>
                        <dt>Cooperative</dt>
                        <dd>{r.coop}</dd>
                      </>
                    )}
                    {r.qty && (
                      <>
                        <dt>Quantity</dt>
                        <dd>{r.qty}</dd>
                      </>
                    )}
                    {r.category && (
                      <>
                        <dt>Category</dt>
                        <dd>{r.category}</dd>
                      </>
                    )}
                  </dl>

                  {r.message && <p className="adm-enquiry-message">{r.message}</p>}

                  <div className="adm-enquiry-actions">
                    {wa && (
                      <a className="adm-btn adm-btn-primary" href={wa} target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>
                    )}
                    {r.phone && (
                      <a className="adm-btn adm-btn-ghost" href={`tel:${r.phone}`}>
                        Call
                      </a>
                    )}
                    {r.email && (
                      <a className="adm-btn adm-btn-ghost" href={`mailto:${r.email}`}>
                        Email
                      </a>
                    )}
                    <button
                      type="button"
                      className="adm-btn adm-btn-ghost"
                      onClick={() => markRead(r, !isUnread)}
                    >
                      Mark as {isUnread ? "read" : "unread"}
                    </button>
                    <button type="button" className="adm-btn adm-btn-danger" onClick={() => handleDelete(r)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
