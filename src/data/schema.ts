// Which content.json keys the admin dashboard exposes, and how each one is edited.
// Unknown keys are preserved: the editor mutates a clone of the loaded content.
export type FieldType =
  | "text"
  | "textarea"
  | "boolean"
  | "select"
  | "image"
  | "imageList"
  | "strings";

export type Field = {
  key: string;
  label: string;
  type: FieldType | "group" | "list";
  options?: string[];
  fields?: Field[];
};

export type Section = {
  key: string;
  label: string;
  type: "group" | "list";
  fields: Field[];
};

export const sections: Section[] = [
  {
    key: "seo",
    label: "Judul & SEO",
    type: "group",
    fields: [{ key: "title", label: "Judul tab browser", type: "text" }],
  },
  {
    key: "loader",
    label: "Layar loading",
    type: "group",
    fields: [
      { key: "initials", label: "Inisial di pojok", type: "text" },
      { key: "marqueeWords", label: "Kata berjalan", type: "strings" },
      {
        key: "speed",
        label: "Kecepatan loading",
        type: "select",
        options: ["Santai", "Normal", "Cepat", "Ngebut"],
      },
    ],
  },
  {
    key: "navbar",
    label: "Navbar",
    type: "group",
    fields: [
      { key: "initials", label: "Inisial / logo", type: "text" },
      { key: "connectUrl", label: "URL tengah atas", type: "text" },
      { key: "connectLabel", label: "Teks tengah atas", type: "text" },
      {
        key: "links",
        label: "Menu",
        type: "list",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "Tujuan (mis. #work)", type: "text" },
        ],
      },
    ],
  },
  {
    key: "landing",
    label: "Halaman depan",
    type: "group",
    fields: [
      { key: "greeting", label: "Sapaan", type: "text" },
      { key: "firstName", label: "Nama baris 1", type: "text" },
      { key: "lastName", label: "Nama baris 2", type: "text" },
      { key: "roleIntro", label: "Baris peran", type: "text" },
      { key: "rolePrimary", label: "Kata peran A", type: "text" },
      { key: "roleSecondary", label: "Kata peran B", type: "text" },
      {
        key: "photo",
        label: "Foto lanyard (kosong = foto acak)",
        type: "image",
      },
      { key: "cardFrontTag", label: "Teks kartu depan", type: "text" },
      { key: "cardBackTag", label: "Teks kartu belakang", type: "text" },
      { key: "cardHint", label: "Keterangan saat disentuh", type: "text" },
    ],
  },
  {
    key: "about",
    label: "About",
    type: "group",
    fields: [
      { key: "title", label: "Judul", type: "text" },
      { key: "paragraph", label: "Paragraf", type: "textarea" },
    ],
  },
  {
    key: "whatIDo",
    label: "What I Do",
    type: "list",
    fields: [
      { key: "title", label: "Judul", type: "text" },
      { key: "subtitle", label: "Subjudul", type: "text" },
      { key: "description", label: "Deskripsi", type: "textarea" },
      { key: "tags", label: "Tag keahlian", type: "strings" },
    ],
  },
  {
    key: "career",
    label: "Career",
    type: "list",
    fields: [
      { key: "role", label: "Peran", type: "text" },
      { key: "company", label: "Perusahaan", type: "text" },
      { key: "period", label: "Periode", type: "text" },
      { key: "description", label: "Deskripsi", type: "textarea" },
    ],
  },
  {
    key: "work",
    label: "Project",
    type: "list",
    fields: [
      { key: "title", label: "Nama project", type: "text" },
      { key: "category", label: "Kategori", type: "text" },
      { key: "tools", label: "Tools & fitur", type: "text" },
      { key: "image", label: "Gambar", type: "image" },
      { key: "link", label: "Link", type: "text" },
    ],
  },
  {
    key: "certificates",
    label: "Certificates",
    type: "list",
    fields: [
      { key: "title", label: "Nama sertifikat", type: "text" },
      { key: "issuer", label: "Penerbit", type: "text" },
      { key: "year", label: "Tahun", type: "text" },
      { key: "image", label: "Gambar", type: "image" },
      { key: "url", label: "Link kredensial", type: "text" },
    ],
  },
  {
    key: "skills",
    label: "Skills",
    type: "group",
    fields: [
      { key: "title", label: "Judul", type: "text" },
      {
        key: "items",
        label: "Daftar skill",
        type: "list",
        fields: [
          { key: "name", label: "Nama skill", type: "text" },
          { key: "level", label: "Tingkat (mis. Advanced)", type: "text" },
          { key: "description", label: "Deskripsi", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "techStack",
    label: "Tech stack",
    type: "group",
    fields: [
      { key: "title", label: "Judul", type: "text" },
      { key: "images", label: "Gambar", type: "imageList" },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    type: "group",
    fields: [
      { key: "heading", label: "Judul", type: "text" },
      { key: "connectHeading", label: "Judul Connect", type: "text" },
      {
        key: "connectLink",
        label: "Link Connect",
        type: "group",
        fields: [
          { key: "label", label: "Teks", type: "text" },
          { key: "url", label: "URL", type: "text" },
        ],
      },
      { key: "educationHeading", label: "Judul Education", type: "text" },
      { key: "education", label: "Baris pendidikan", type: "strings" },
      { key: "statusHeading", label: "Judul Status", type: "text" },
      { key: "status", label: "Status", type: "text" },
      { key: "socialHeading", label: "Judul Social", type: "text" },
      {
        key: "socials",
        label: "Link sosial",
        type: "list",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "url", label: "URL", type: "text" },
        ],
      },
      { key: "creditName", label: "Nama di footer", type: "text" },
      { key: "year", label: "Tahun", type: "text" },
    ],
  },
  {
    key: "social",
    label: "Ikon sosial & resume",
    type: "group",
    fields: [
      {
        key: "icons",
        label: "Ikon",
        type: "list",
        fields: [
          {
            key: "icon",
            label: "Ikon",
            type: "select",
            options: ["github", "linkedin", "instagram", "youtube", "spotify", "strava"],
          },
          { key: "url", label: "URL", type: "text" },
        ],
      },
      { key: "resume", label: "Path file resume", type: "text" },
      { key: "showResume", label: "Tampilkan tombol resume", type: "boolean" },
    ],
  },
];
