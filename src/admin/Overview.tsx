import contentSource from "../data/content.json";
import { sections } from "../data/schema";
import { isRemote } from "../lib/supabase";

type Props = {
  content: typeof contentSource;
  onOpen: (key: string) => void;
};

const countOf = (value: unknown) =>
  Array.isArray(value) ? value.length : undefined;

const Overview = ({ content, onOpen }: Props) => {
  const socials = [...content.social.icons, ...content.contact.socials];
  const placeholderImages = content.work.filter((project) =>
    project.image.includes("placeholder")
  ).length;

  const tiles = [
    {
      label: "Bagian konten",
      value: String(sections.length),
      hint: "Semua bisa diedit di menu kiri",
    },
    {
      label: "Project tampil",
      value: String(content.work.length),
      hint: `${placeholderImages} masih pakai gambar placeholder`,
    },
    {
      label: "Pengalaman",
      value: String(content.career.length),
      hint: "Kartu di timeline Career",
    },
    {
      label: "Tautan sosial",
      value: String(socials.length),
      hint: "Ikon navbar + daftar Contact",
    },
  ];

  const checks = [
    {
      label: "Nama dan peran terisi",
      ok: Boolean(
        content.landing.firstName && content.landing.rolePrimary && content.landing.roleSecondary
      ),
      detail: `${content.landing.firstName} · ${content.landing.rolePrimary} / ${content.landing.roleSecondary}`,
      key: "landing",
    },
    {
      label: "Judul tab browser diset",
      ok: content.seo.title.trim().length > 0,
      detail: content.seo.title,
      key: "seo",
    },
    {
      label: "Setiap project punya gambar asli",
      ok: placeholderImages === 0,
      detail:
        placeholderImages === 0
          ? "Semua gambar sudah diganti"
          : `${placeholderImages} project masih /images/placeholder.webp`,
      key: "work",
    },
    {
      label: "Setiap project punya link",
      ok: content.work.every((project) => project.link.trim().length > 0),
      detail: `${content.work.filter((p) => p.link.trim()).length}/${content.work.length} terisi`,
      key: "work",
    },
    {
      label: "Tombol resume tampil",
      ok: content.social.showResume,
      detail: content.social.showResume
        ? content.social.resume
        : "Dimatikan di bagian Ikon sosial",
      key: "social",
    },
    {
      label: "Semua tautan pakai http(s)",
      ok: socials.every((item) => /^https?:\/\//.test(item.url)),
      detail: `${socials.filter((s) => /^https?:\/\//.test(s.url)).length}/${socials.length} valid`,
      key: "contact",
    },
    {
      label: "Kontak punya status",
      ok: content.contact.status.trim().length > 0,
      detail: content.contact.status,
      key: "contact",
    },
    {
      label: "Tag keahlian terisi",
      ok: content.whatIDo.every((item) => item.tags.length > 0),
      detail: `${content.whatIDo.reduce((sum, item) => sum + item.tags.length, 0)} tag di ${content.whatIDo.length} kartu`,
      key: "whatIDo",
    },
  ];

  const issues = checks.filter((check) => !check.ok).length;

  return (
    <div className="ad-page">
      <header className="ad-page-head ad-page-head-row">
        <div>
          <h1>BERANDA</h1>
          <p>
            Halo, <strong>{content.landing.firstName}</strong>. Ini isi
            portofolio kamu sekarang.
          </p>
        </div>
        <span className={issues ? "ad-chip ad-chip-warn" : "ad-chip"}>
          {issues === 0 ? "Semua siap" : `${issues} hal perlu dilengkapi`}
        </span>
      </header>

      <div className="ad-cards">
        {tiles.map((tile) => (
          <div className="ad-card ad-stat" key={tile.label}>
            <span className="ad-stat-label">{tile.label}</span>
            <span className="ad-stat-value">{tile.value}</span>
            <span className="ad-stat-hint">{tile.hint}</span>
          </div>
        ))}
      </div>

      <div className="ad-split">
        <section className="ad-card">
          <div className="ad-card-head">
            <div>
              <h2>Peta konten</h2>
              <p>Klik bagian untuk mengubah isinya</p>
            </div>
            <span className="ad-chip">
              {isRemote() ? "Supabase" : "Demo lokal"}
            </span>
          </div>
          <div className="ad-map">
            {sections.map((section) => {
              const value = (content as Record<string, unknown>)[section.key];
              const count = countOf(value);
              return (
                <button
                  type="button"
                  className="ad-map-card"
                  key={section.key}
                  onClick={() => onOpen(section.key)}
                >
                  <strong>{section.label}</strong>
                  <span>{count === undefined ? "teks" : `${count} item`}</span>
                  <em>Ubah →</em>
                </button>
              );
            })}
          </div>
        </section>

        <div className="ad-col">
          <section className="ad-card">
            <div className="ad-card-head">
              <div>
                <h2>Pratinjau hero</h2>
                <p>Tampilan halaman depan situs</p>
              </div>
              <button
                type="button"
                className="ad-link"
                onClick={() => onOpen("landing")}
              >
                Ubah
              </button>
            </div>
            <div className="ad-hero">
              <span>{content.landing.greeting}</span>
              <strong>
                {content.landing.firstName} {content.landing.lastName}
              </strong>
              <span className="ad-hero-role">
                {content.landing.roleIntro} {content.landing.rolePrimary} /{" "}
                {content.landing.roleSecondary}
              </span>
            </div>
            <dl className="ad-kv">
              <dt>Judul tab</dt>
              <dd>{content.seo.title}</dd>
              <dt>Inisial</dt>
              <dd>
                navbar {content.navbar.initials} · loader{" "}
                {content.loader.initials}
              </dd>
              <dt>Lokasi</dt>
              <dd>{content.contact.status}</dd>
            </dl>
          </section>

          <section className="ad-card">
            <div className="ad-card-head">
              <div>
                <h2>Project terbaru</h2>
                <p>Urutan carousel My Work</p>
              </div>
              <button
                type="button"
                className="ad-link"
                onClick={() => onOpen("work")}
              >
                Kelola
              </button>
            </div>
            <ul className="ad-list">
              {content.work.slice(0, 3).map((project, index) => (
                <li key={project.title + index}>
                  <img src={project.image} alt="" />
                  <div>
                    <strong>{project.title}</strong>
                    <span>{project.category}</span>
                  </div>
                  <span className="ad-badge">0{index + 1}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="ad-card">
        <div className="ad-card-head">
          <div>
            <h2>Pemeriksaan konten</h2>
            <p>Dihitung dari isi yang tersimpan sekarang</p>
          </div>
          <span className={issues ? "ad-chip ad-chip-warn" : "ad-chip"}>
            {checks.length - issues}/{checks.length} lolos
          </span>
        </div>
        <ul className="ad-checks">
          {checks.map((check) => (
            <li key={check.label}>
              <button type="button" onClick={() => onOpen(check.key)}>
                <span className={check.ok ? "ad-dot ok" : "ad-dot warn"} />
                <strong>{check.label}</strong>
                <span className="ad-check-detail">{check.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Overview;
