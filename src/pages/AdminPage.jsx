import { useState } from "react";
import "../styles/admin.css";
import { isConfigured } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useAdminCollection } from "../hooks/useAdminCollection";
import ProductManager from "../admin/ProductManager";
import EventManager from "../admin/EventManager";
import ReportManager from "../admin/ReportManager";
import EnquiryInbox from "../admin/EnquiryInbox";

const SECTIONS = [
  { key: "products", label: "Products", icon: "🛍️" },
  { key: "events", label: "Events", icon: "📅" },
  { key: "reports", label: "Reports", icon: "📄" },
  { key: "enquiries", label: "Enquiries", icon: "✉️" },
];

function LoginScreen({ onSignIn, signingIn, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <div className="adm-login-wrap">
      <form className="adm-login-card" onSubmit={submit}>
        <div className="adm-login-brand">
          <span className="adm-login-mark">TU</span>
          <div>
            <h1>Admin Panel</h1>
            <p>Thok Upabhokta · staff access only</p>
          </div>
        </div>

        {!isConfigured && (
          <p className="adm-error">
            Firebase is not configured. Add your project config to <code>.env</code> and restart the dev server.
          </p>
        )}

        <div className="adm-field">
          <label className="adm-label" htmlFor="adm-email">
            Email
          </label>
          <input
            id="adm-email"
            className="adm-input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="office@thokupabhokta.com"
            required
          />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="adm-password">
            Password
          </label>
          <input
            id="adm-password"
            className="adm-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="adm-error">{error}</p>}

        <button type="submit" className="adm-btn adm-btn-primary adm-btn-block" disabled={signingIn}>
          {signingIn ? "Signing in..." : "Sign in"}
        </button>

        <p className="adm-hint adm-hint-block adm-login-help">
          No account yet? In the Firebase console go to <strong>Authentication → Users → Add user</strong>, then enable
          <strong> Email/Password</strong> under <strong>Sign-in method</strong>.
        </p>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const { user, isAllowed, initialising, signingIn, error, signIn, signOutUser } = useAuth();
  const [section, setSection] = useState("products");
  const { rows: enquiries } = useAdminCollection("enquiries");

  const unread = enquiries.filter((e) => e.read !== true).length;

  if (initialising) {
    return (
      <div className="adm-center">
        <p className="adm-hint">Checking your session...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onSignIn={signIn} signingIn={signingIn} error={error} />;
  }

  if (!isAllowed) {
    return (
      <div className="adm-center">
        <div className="adm-login-card">
          <h1>Not authorised</h1>
          <p className="adm-hint">
            <strong>{user.email}</strong> is signed in but is not on the staff list. Ask the administrator to add this
            email to <code>VITE_FIREBASE_ADMIN_EMAILS</code> and to <code>firestore.rules</code>.
          </p>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={signOutUser}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <div className="adm-side-brand">
          <span className="adm-login-mark">TU</span>
          <div>
            <strong>Admin Panel</strong>
            <span>Thok Upabhokta</span>
          </div>
        </div>

        <nav className="adm-side-nav">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`adm-side-link ${section === s.key ? "is-active" : ""}`}
              onClick={() => setSection(s.key)}
            >
              <span aria-hidden="true">{s.icon}</span>
              {s.label}
              {s.key === "enquiries" && unread > 0 && <span className="adm-badge">{unread}</span>}
            </button>
          ))}
        </nav>

        <a className="adm-side-view" href="#/">
          ← Back to website
        </a>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <h2>{SECTIONS.find((s) => s.key === section)?.label}</h2>
          <div className="adm-topbar-right">
            <span className="adm-user">{user.email}</span>
            <button type="button" className="adm-btn adm-btn-ghost" onClick={signOutUser}>
              Sign out
            </button>
          </div>
        </header>

        <div className="adm-content">
          {section === "products" && <ProductManager />}
          {section === "events" && <EventManager />}
          {section === "reports" && <ReportManager />}
          {section === "enquiries" && <EnquiryInbox />}
        </div>
      </div>
    </div>
  );
}
