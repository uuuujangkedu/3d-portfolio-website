import contentSource from "../data/content.json";
import { sections } from "../data/schema";
import { isRemote } from "../lib/supabase";

type Props = {
  content: typeof contentSource;
  onOpen: (key: string) => void;
};

const countItems = (content: typeof contentSource) => {
  const tags = content.whatIDo.reduce((sum, item) => sum + item.tags.length, 0);
  return [
    { key: "career", label: "Career", value: content.career.length },
    { key: "work", label: "Project", value: content.work.length },
    { key: "whatIDo", label: "What I Do", value: content.whatIDo.length },
    { key: "navbar", label: "Menu navbar", value: content.navbar.links.length },
    {
      key: "contact",
      label: "Link sosial",
      value: content.contact.socials.length,
    },
    { key: "social", label: "Ikon sosial", value: content.social.icons.length },
    { key: "whatIDo", label: "Tag keahlian", value: tags },
    {
      key: "techStack",
      label: "Gambar stack",
      value: content.techStack.images.length,
    },
  ];
};

const Overview = ({ content, onOpen }: Props) => {
  const stats = countItems(content);
  const peak = Math.max(...stats.map((s) => s.value), 1);
  const filled = sections.filter((section) => {
    const value = (content as Record<string, unknown>)[section.key];
    return value !== undefined && value !== null && value !== "";
  }).length;

  const cards = [
    {
      label: "Bagian terisi",
      value: `${filled}/${sections.length}`,
      hint: "Semua bagian situs punya konten",
    },
    {
      label: "Project tampil",
      value: String(content.work.length),
      hint: "Berputar di carousel My Work",
    },
    {
      label: "Pengalaman",
      value: String(content.career.length),
      hint: "Kartu di timeline career",
    },
    {
      label: "Tautan sosial",
      value: String(content.social.icons.length + content.contact.socials.length),
      hint: "Ikon navbar + daftar Contact",
    },
  ];

  return (
    <div className="ad-page">
      <header className="ad-page-head">
        <h1>BERANDA</h1>
        <p>
          Halo, <strong>{content.landing.firstName}</strong>. Ringkasan isi
          portofolio dan sumber datanya.
        </p>
      </header>

      <div className="ad-cards">
        {cards.map((card) => (
          <div className="ad-card ad-stat" key={card.label}>
            <span className="ad-stat-label">{card.label}</span>
            <span className="ad-stat-value">{card.value}</span>
            <span className="ad-stat-hint">{card.hint}</span>
          </div>
        ))}
      </div>

      <div className="ad-split">
        <section className="ad-card">
          <div className="ad-card-head">
            <div>
              <h2>Jumlah item per bagian</h2>
              <p>Hitung langsung dari konten yang tersimpan</p>
            </div>
            <span className="ad-chip">
              {isRemote() ? "Supabase" : "Demo lokal"}
            </span>
          </div>
          <div className="ad-chart">
            {stats.map((stat, index) => (
              <button
                type="button"
                className="ad-bar"
                key={`${stat.label}-${index}`}
                onClick={() => onOpen(stat.key)}
              >
                <span className="ad-bar-value">{stat.value}</span>
                <span
                  className="ad-bar-fill"
                  style={{ height: `${(stat.value / peak) * 100}%` }}
                />
                <span className="ad-bar-label">{stat.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="ad-card">
          <div className="ad-card-head">
            <div>
              <h2>Project terbaru</h2>
              <p>Urutan tampil di section My Work</p>
            </div>
            <button type="button" className="ad-link" onClick={() => onOpen("work")}>
              Kelola
            </button>
          </div>
          <ul className="ad-list">
            {content.work.map((project, index) => (
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
  );
};

export default Overview;
