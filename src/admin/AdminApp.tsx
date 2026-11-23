import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  MdBuild,
  MdContacts,
  MdDashboard,
  MdHomeWork,
  MdHourglassEmpty,
  MdLayers,
  MdMenu,
  MdPerson,
  MdSearch,
  MdShare,
  MdTimeline,
  MdVerified,
  MdWorkspacePremium,
  MdWork,
} from "react-icons/md";
import { FieldEditor } from "./FieldEditor";
import Overview from "./Overview";
import Preview from "./Preview";
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
  certificates: MdVerified,
  skills: MdWorkspacePremium,
  techStack: MdLayers,
  contact: MdContacts,
  social: MdShare,
  admin: MdDashboard,
};

const initialsOf = (name: string) =>
  name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

type Brand = { mark: string; image: string };

// Admin chrome shows the uploaded brand image, or the initials when none is set.
const BrandMark = ({ brand }: { brand: Brand }) =>
  brand.image ? (
    <span className="ad-brand-mark">
      <img src={brand.image} alt={brand.mark} />
    </span>
  ) : (
    <span className="ad-brand-mark">{brand.mark}</span>
  );

const Login = ({ onDone, brand }: { onDone: () => void; brand: Brand }) => {
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
        <span className="ad-login-mark">
          {brand.image ? <img src={brand.image} alt={brand.mark} /> : brand.mark}
        </span>
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
  const [previewKey, setPreviewKey] = useState(0);
  // The login card is shown before any content is loaded, so its branding is
  // read up front (site_content allows public reads).
  const [siteBrand, setSiteBrand] = useState<Brand>({ mark: "MRF", image: "" });

  useEffect(() => {
    loadContent()
      .then((loaded) => {
        const admin = loaded.admin;
        setSiteBrand({
          mark: admin?.brandMark?.trim() || loaded.loader.initials || "MRF",
          image: admin?.brandImage?.trim() || "",
        });
      })
      .catch(() => undefined);
  }, []);

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
      // Rows saved before the admin-chrome fields existed have no `admin`, so
      // seed it from the site itself instead of showing blank inputs.
      const withAdmin = {
        ...loaded,
        admin: (loaded as Partial<Content>).admin ?? {
          displayName: loaded.landing.firstName,
          avatarInitials: initialsOf(
            `${loaded.landing.firstName} ${loaded.landing.lastName}`
          ),
          brandMark: loaded.loader.initials,
          brandImage: "",
        },
      };
      setContent(withAdmin);
      setSaved(withAdmin);
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
      const message = err instanceof Error ? err.message : String(err);
      setError(
        /permission denied/i.test(message)
          ? `${message} — sesi Supabase tidak valid atau izin tabel belum diberikan. Keluar lalu masuk lagi, dan jalankan supabase/schema.sql di SQL editor Supabase.`
          : message
      );
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
  if (!signedIn) return <Login onDone={() => setSignedIn(true)} brand={siteBrand} />;
  if (!content) return <div className="ad-login">Memuat konten…</div>;

  const activeSection = sections.find((section) => section.key === page);
  const sectionValue = activeSection
    ? (content as Record<string, unknown>)[activeSection.key]
    : undefined;

  const admin = (content as Partial<Content>).admin;
  const brandMark = admin?.brandMark?.trim() || content.loader.initials;
  const brand: Brand = {
    mark: brandMark,
    image: admin?.brandImage?.trim() || "",
  };
  const displayName = admin?.displayName?.trim() || content.landing.firstName;
  const avatarInitials =
    admin?.avatarInitials?.trim() ||
    initialsOf(`${content.landing.firstName} ${content.landing.lastName}`);

  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <div className="ad-brand">
          <BrandMark brand={brand} />
          <span className="ad-brand-name">Portfolio Admin</span>
        </div>

        <div className="ad-user">
          <span className="ad-avatar">{avatarInitials}</span>
          <div>
            <strong>{displayName}</strong>
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
            ↗ Web Portfolio
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
          <div className="ad-page ad-split">
            <div>
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
                  ? activeSection.fields.map((field) => {
                      const groupVal = (sectionValue ?? {}) as Record<string, unknown>;
                      return (
                        <FieldEditor
                          key={field.key}
                          field={field}
                          value={groupVal[field.key]}
                          onChange={(next) =>
                            setContent({
                              ...content,
                              [activeSection.key]: {
                                ...groupVal,
                                [field.key]: next,
                              },
                            } as Content)
                          }
                        />
                      );
                    })
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

            <Preview
              key={previewKey}
              page={page}
              content={content}
              onRefresh={() => setPreviewKey((value) => value + 1)}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminApp;
