import { useEffect, useState } from "react";
import { FieldEditor } from "./FieldEditor";
import { Field, sections } from "../data/schema";
import { demoMode, hasSession, signIn, signOut } from "../lib/adminAuth";
import {
  loadContent,
  resetContent,
  saveContent,
  type Content,
} from "../lib/content";
import { isRemote } from "../lib/supabase";
import "./admin.css";

const Login = ({ onDone }: { onDone: () => void }) => {
  const [email, setEmail] = useState(demoMode ? "admin@local" : "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email, password);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ad-login">
      <form onSubmit={submit}>
        <h1>Admin Login</h1>
        <label className="ad-field">
          <span>Email / ID</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        </label>
        <label className="ad-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="ad-error">{error}</p> : null}
        <button type="submit" disabled={busy}>
          {busy ? "Masuk…" : "Masuk"}
        </button>
      </form>
    </div>
  );
};

const AdminApp = () => {
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    hasSession()
      .then(setSignedIn)
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (signedIn) loadContent().then(setContent);
  }, [signedIn]);

  const save = async () => {
    if (!content) return;
    setStatus("Menyimpan…");
    setError("");
    try {
      await saveContent(content);
      setStatus("Tersimpan");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("");
    }
  };

  const reset = async () => {
    const sure = window.confirm(
      "Hapus semua perubahan dan kembalikan ke konten bawaan?"
    );
    if (!sure) return;
    setStatus("Mengembalikan…");
    setContent(await resetContent());
    setStatus("Kembali ke bawaan");
  };

  if (checking) return <div className="ad-login">Memeriksa sesi…</div>;
  if (!signedIn) return <Login onDone={() => setSignedIn(true)} />;
  if (!content) return <div className="ad-login">Memuat konten…</div>;

  return (
    <div className="ad-app">
      <header className="ad-bar">
        <div>
          <strong>Dashboard Portfolio</strong>
          <span className={isRemote() ? "ad-badge" : "ad-badge ad-badge-warn"}>
            {isRemote() ? "Supabase" : "Mode demo — hanya browser ini"}
          </span>
        </div>
        <div className="ad-actions">
          {status ? <span className="ad-status">{status}</span> : null}
          <button type="button" onClick={save}>
            Simpan
          </button>
          <button type="button" onClick={() => loadContent().then(setContent)}>
            Muat ulang
          </button>
          <button type="button" className="ad-danger" onClick={reset}>
            Reset ke bawaan
          </button>
          <button type="button" onClick={() => signOut().then(() => setSignedIn(false))}>
            Keluar
          </button>
        </div>
      </header>

      {demoMode ? (
        <p className="ad-note">
          Mode demo tanpa server: perubahan hanya tersimpan di browser ini, situs
          publik tidak ikut berubah. Isi <code>VITE_SUPABASE_URL</code> dan{" "}
          <code>VITE_SUPABASE_ANON_KEY</code> untuk login sungguhan dan konten
          yang tampil di semua pengunjung.
        </p>
      ) : null}
      {error ? <p className="ad-error">{error}</p> : null}

      <main>
        {sections.map((section) => {
          const sectionValue = (content as Record<string, unknown>)[section.key];
          return (
            <section className="ad-section" key={section.key}>
              <h2>{section.label}</h2>
              {section.type === "group" ? (
                section.fields.map((field) => (
                  <FieldEditor
                    key={field.key}
                    field={field}
                    value={(sectionValue as Record<string, unknown>)[field.key]}
                    onChange={(next) =>
                      setContent({
                        ...content,
                        [section.key]: {
                          ...(sectionValue as Record<string, unknown>),
                          [field.key]: next,
                        },
                      } as Content)
                    }
                  />
                ))
              ) : (
                <FieldEditor
                  field={{ ...section, type: "list" } as Field}
                  value={sectionValue}
                  onChange={(next) =>
                    setContent({ ...content, [section.key]: next } as Content)
                  }
                />
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default AdminApp;
