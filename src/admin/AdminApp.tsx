import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  MdBuild,
  MdContacts,
  MdHomeWork,
  MdHourglassEmpty,
  MdLayers,
  MdMenu,
  MdPerson,
  MdSearch,
  MdShare,
  MdTimeline,
  MdWork,
} from "react-icons/md";
import { FieldEditor } from "./FieldEditor";
import Overview from "./Overview";
import { Field, sections } from "../data/schema";
import { currentEmail, demoCredentials, demoMode, hasSession, signIn, signOut } from "../lib/adminAuth";
import {
  loadContent,
  resetContent,
  saveContent,
  type Content,
} from "../lib/content";
import "./admin.css";

const icons: Record<string, ComponentType> = {
  seo: MdSearch,
  loader: MdHourglassEmpty,
  navbar: MdMenu,
  landing: MdHomeWork,
  about: MdPerson,
  whatIDo: MdBuild,
  career: MdTimeline,
  work: MdWork,
  techStack: MdLayers,
  contact: MdContacts,
  social: MdShare,
};

const initialsOf = (name: string) =>
  name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const Login = ({ onDone }: { onDone: () => void }) => {
  const [email, setEmail] = useState(demoMode ? demoCredentials.email : "");
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
        <span className="ad-login-mark">MRF</span>
        <h1>Masuk Dashboard</h1>
        <p className="ad-login-sub">
          {demoMode
            ? "Mode demo: tanpa server, data hanya di browser ini."
            : "Masuk dengan akun admin yang kamu buat di Supabase."}
        </p>
        <label className="ad-field">
          <span>Email / ID</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </label>
        <label className="ad-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="ad-error">{error}</p> : null}
        <button type="submit" className="ad-primary" disabled={busy}>
          {busy ? "Masuk…" : "Masuk"}
        </button>

        {demoMode ? (
          <div className="ad-login-note">
            <strong>Catatan — akun demo</strong>
            <dl>
              <dt>ID / Email</dt>
              <dd>{demoCredentials.email}</dd>
              <dt>Password</dt>
              <dd>{demoCredentials.password}</dd>
            </dl>
            <span>
              Mode demo tanpa server: kredensial ini ikut terkirim ke browser
              siapa pun, jadi bukan pengaman. Untuk login sungguhan, isi{" "}
              <code>VITE_SUPABASE_URL</code> dan{" "}
              <code>VITE_SUPABASE_ANON_KEY</code>.
            </span>
          </div>
        ) : null}
      </form>
    </div>
  );
};

const AdminApp = () => {
  const [checking, setChecking] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [page, setPage] = useState<string>("overview");
  const [content, setContent] = useState<Content | null>(null);
  const [saved, setSaved] = useState<Content | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    hasSession()
      .then(async (ok) => {
        setSignedIn(ok);
        if (ok) setEmail(await currentEmail());
      })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    loadContent().then((loaded) => {
      setContent(loaded);
      setSaved(loaded);
    });
  }, [signedIn]);

  const dirty = content !== null && saved !== null && content !== saved;

  const save = async () => {
    if (!content) return;
    setStatus("Menyimpan…");
    setError("");
    try {
      await saveContent(content);
      setSaved(content);
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
    const fresh = await resetContent();
    setContent(fresh);
    setSaved(fresh);
    setStatus("Kembali ke bawaan");
  };

  if (checking) return <div className="ad-login">Memeriksa sesi…</div>;
  if (!signedIn) return <Login onDone={() => setSignedIn(true)} />;
  if (!content) return <div className="ad-login">Memuat konten…</div>;

  const activeSection = sections.find((section) => section.key === page);
  const sectionValue = activeSection
    ? (content as Record<string, unknown>)[activeSection.key]
    : undefined;

  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <div className="ad-brand">
          <span className="ad-brand-mark">{content.loader.initials}</span>
          <span>Portfolio Admin</span>
        </div>

        <div className="ad-user">
          <span className="ad-avatar">{initialsOf(email || "AD")}</span>
          <div>
            <strong>{content.landing.firstName}</strong>
            <span className="ad-user-mail">{email}</span>
            <span className="ad-role">ADMIN</span>
          </div>
        </div>

        <nav>
          <button
            type="button"
            className={page === "overview" ? "active" : ""}
            onClick={() => setPage("overview")}
          >
            <MdHomeWork /> BERANDA
          </button>
          {sections.map((section) => {
            const Icon = icons[section.key] ?? MdBuild;
            const count = Array.isArray(
              (content as Record<string, unknown>)[section.key]
            )
              ? ((content as Record<string, unknown>)[section.key] as unknown[])
                  .length
              : undefined;
            return (
              <button
                type="button"
                key={section.key}
                className={page === section.key ? "active" : ""}
                onClick={() => setPage(section.key)}
              >
                <Icon /> {section.label}
                {count !== undefined ? (
                  <span className="ad-nav-count">{count}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="ad-side-foot">
          <a href="/" target="_blank" rel="noreferrer">
            ↗ Lihat web pengunjung
          </a>
          <button type="button" onClick={() => signOut().then(() => setSignedIn(false))}>
            Keluar
          </button>
        </div>
      </aside>

      <main className="ad-main">
        <div className="ad-topbar">
          {status ? <span className="ad-status">{status}</span> : null}
          {dirty ? <span className="ad-badge ad-badge-warn">Belum disimpan</span> : null}
          <button type="button" onClick={() => window.location.reload()}>
            Muat ulang
          </button>
          <button type="button" className="ad-danger" onClick={reset}>
            Reset
          </button>
          <button type="button" className="ad-primary" onClick={save} disabled={!dirty}>
            Simpan
          </button>
        </div>

        {demoMode ? (
          <p className="ad-note">
            Mode demo tanpa server: perubahan hanya tersimpan di browser ini dan
            situs publik tidak berubah. Isi <code>VITE_SUPABASE_URL</code> dan{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> untuk login sungguhan dan konten
            yang tampil ke semua pengunjung.
          </p>
        ) : null}
        {error ? <p className="ad-error">{error}</p> : null}

        {page === "overview" ? (
          <Overview content={content} onOpen={setPage} />
        ) : (
          <div className="ad-page">
            <header className="ad-page-head">
              <h1>{activeSection?.label.toUpperCase()}</h1>
              <p>
                {activeSection?.type === "list"
                  ? "Tambah, ubah, hapus, dan urutkan item."
                  : "Ubah isi kolom lalu tekan Simpan."}
              </p>
            </header>

            <section className="ad-card">
              {activeSection?.type === "group"
                ? activeSection.fields.map((field) => (
                    <FieldEditor
                      key={field.key}
                      field={field}
                      value={(sectionValue as Record<string, unknown>)[field.key]}
                      onChange={(next) =>
                        setContent({
                          ...content,
                          [activeSection.key]: {
                            ...(sectionValue as Record<string, unknown>),
                            [field.key]: next,
                          },
                        } as Content)
                      }
                    />
                  ))
                : activeSection && (
                    <FieldEditor
                      field={{ ...activeSection, type: "list" } as Field}
                      value={sectionValue}
                      onChange={(next) =>
                        setContent({
                          ...content,
                          [activeSection.key]: next,
                        } as Content)
                      }
                    />
                  )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminApp;
