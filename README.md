# Muhammad Riszki Fadhillah — 3D Portfolio

Personal 3D portfolio of **Muhammad Riszki Fadhillah**, a full-stack developer. Built with React, TypeScript, Three.js, React Three Fiber, and GSAP: animated page sections, a 3D character scene, a draggable lanyard, custom cursor interactions, and smooth transitions. All page copy is editable through a built-in admin dashboard with an optional Supabase backend.

**Live site:** [https://ujangkedu.my.id](https://ujangkedu.my.id)

> Forked from [**akashrmalhotra/3d-portfolio**](https://github.com/akashrmalhotra/3d-portfolio) by **Akash Malhotra** (MIT). This fork is rebranded for the owner's profile and extended with a content admin dashboard, Supabase integration, a certificates page, and a rebuilt responsive/mobile layout. See [Credits & Attribution](#credits--attribution).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [GSAP License Note](#gsap-license-note)
- [Customization Guide](#customization-guide)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Credits & Attribution](#credits--attribution)
- [License](#license)

## Features

- Responsive one-page portfolio layout with reusable section components.
- 3D character scene rendering powered by React Three Fiber and Three.js.
- GSAP-powered animations and transitions for interactive storytelling.
- Custom cursor, hover interactions, and scroll-driven visual effects.
- Organized component architecture with dedicated utilities and style modules.

## Tech Stack

### Core

- React 18
- TypeScript
- Vite

### Animation and 3D

- GSAP + `@gsap/react`
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`
- `@react-three/cannon`
- `@react-three/rapier`

### Supporting Libraries

- `react-icons`
- `react-fast-marquee`
- `@vercel/analytics`

## Project Structure

```text
.
├── admin.html                 # Admin dashboard entry point
├── certificates.html          # Certificates page entry point
├── public/                    # Static assets
├── supabase/
│   └── schema.sql             # Tables, storage bucket, and RLS policies
├── src/
│   ├── admin/                 # Admin dashboard app (auth, editors, preview)
│   ├── assets/                # Local media/assets
│   ├── certificates/          # All-certificates page
│   ├── components/
│   │   ├── Character/         # 3D scene + character logic/utilities
│   │   ├── styles/            # Section/component CSS files
│   │   ├── About.tsx
│   │   ├── Career.tsx
│   │   ├── Certificates.tsx
│   │   ├── Contact.tsx
│   │   ├── Landing.tsx
│   │   ├── Lanyard.tsx
│   │   ├── MainContainer.tsx  # Main page composition
│   │   ├── Navbar.tsx
│   │   ├── TechStack.tsx
│   │   ├── WhatIDo.tsx
│   │   └── Work.tsx
│   ├── context/               # Global providers (content, loading, etc.)
│   ├── data/                  # content.json + schema
│   ├── lib/                   # Supabase client and helpers
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or compatible)

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:uuuujangkedu/3d-portfolio-website.git
   cd 3d-portfolio-website
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the local development server:

   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev`  
  Starts Vite dev server and exposes host for local network testing.

- `npm run build`  
  Type-checks and builds a production-ready bundle.

- `npm run preview`  
  Serves the production build locally for verification.

- `npm run lint`  
  Runs ESLint checks across the project.

## Editing content

All page copy lives in one file: `src/data/content.json` (name, landing words, about, career, certificates, projects, tech stack, contact links, social icons, resume path, loader initials, browser title). Components read it through `useContent()`, so text changes never require touching `.tsx` files.

The site loads content in this order:

1. Supabase row `site_content` / `main`, when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.
2. Otherwise a browser-local override written by the admin dashboard.
3. Otherwise the `content.json` bundled at build time.

## Admin dashboard

Separate entry point at `admin.html` (so visitors never download the admin bundle), listing every content section with add / edit / delete / reorder and a save button.

### Demo mode (no backend)

```bash
npm run dev
```

Open `/admin.html`. Default credentials are `admin@local` / `admin` (override with `VITE_DEMO_ADMIN_EMAIL`, `VITE_DEMO_ADMIN_PASSWORD` in `.env.local`).

**This is not security.** There is no server, so the "password" ships inside the browser bundle and edits only exist in that browser's `localStorage` — the public site is unchanged for everyone else. Use it to try the interface only.

### Real mode (Supabase: auth + database)

1. Create a free Supabase project.
2. SQL editor → run `supabase/schema.sql`.
3. Authentication → Users → add your admin email + password. Turn **public signups off**, so only accounts you create can log in.
4. Copy `.env.example` to `.env.local` and fill `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (Project Settings → API). Never put the `service_role` key in the front end.
5. `npm run dev`, open `/admin.html`, log in with your email + password, edit, save.

Saves go to the `site_content` table and every visitor sees them on the next page load — no rebuild, no redeploy. Tighten `schema.sql` to `auth.uid() = 'YOUR-USER-UUID'` once you know your user id, so a second account could never write.

### Image upload

Every image field has an **Upload** button; the URL input next to it still accepts a path (`/images/foo.jpg`) or a full `https://` link.

Picking a file opens a framing editor: drag to pan (after zooming), a zoom slider from 1× to 3×, quarter-turn rotation, and **Reset**. The canvas there is the stored image, so the preview cannot disagree with the result. **Simpan foto** uploads the framed version; **Batal** leaves the field untouched.

- **Demo mode**: the file is downscaled in the browser (max 1200 px, JPEG 0.82) and stored as a data URL in `localStorage`, so it never leaves this browser and is capped at ~400 KB. Large photos can be rejected.
- **Supabase mode**: the file goes to the public Storage bucket `images` (`supabase/schema.sql` creates it plus read/write policies) and the field stores the public URL. Free tier allows 1 GB storage; keep uploads under a few MB.

### Hosting note

`admin.html` is a real file, so `https://your-domain/admin.html` works as-is. A shorter `/admin` URL needs a rewrite rule on your host (Vercel `rewrites`, Netlify `_redirects`).

## GSAP License Note

This project uses the standard `gsap` package, including bonus plugins now available in the core package.

- Install dependencies with `npm install`.
- If migrating from older setups, remove `gsap-trial` from your project.

Read official installation guidance here: [GSAP Installation Docs](https://gsap.com/docs/v3/Installation/)

## Customization Guide

You can adapt this portfolio to your own profile by updating the following areas:

- **Content sections**: edit `src/data/content.json` (build-time default), or use the admin dashboard at `/admin.html`.
- **Component layout**: markup lives in `src/components/` (`About.tsx`, `Career.tsx`, `Work.tsx`, …) if you need structural changes.
- **Styling**: Modify component styles in `src/components/styles/` and global styles in `src/index.css` / `src/App.css`.
- **3D scene behavior**: Adjust scene logic in `src/components/Character/` and related utilities.
- **Animations**: Tweak GSAP utilities under `src/components/utils/`.

## Troubleshooting

- **Blank screen in development**  
  Check browser console for module import errors and verify all dependencies are installed.

- **3D performance issues on low-end devices**  
  Reduce scene complexity and post-processing effects in the character/scene utilities.

- **GSAP plugin errors**  
  Ensure you have the correct plugin package and license configuration for your target environment.

- **TypeScript build failures**  
  Run `npm run build` and address reported type errors before deploying.

## Deployment

1. Create a production build:

   ```bash
   npm run build
   ```

2. Validate locally:

   ```bash
   npm run preview
   ```

3. Deploy the generated `dist/` folder to your hosting provider (for example Vercel, Netlify, or Cloudflare Pages).

This project is deployed at **[https://ujangkedu.my.id](https://ujangkedu.my.id)** (custom domain). When hosting your own fork, set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables on the host so the admin dashboard works in real mode.

## Credits & Attribution

This project is a fork of [**akashrmalhotra/3d-portfolio**](https://github.com/akashrmalhotra/3d-portfolio) by **Akash Malhotra**, released under the MIT License. Original live demo: [akashrmalhotra.netlify.app](https://akashrmalhotra.netlify.app/). The upstream `LICENSE` carries the copyright notice of **Rajesh Chityal**, which is retained here per the MIT terms.

Changes in this fork:

- Rebranded content and visual identity for Muhammad Riszki Fadhillah.
- Centralized page copy in `src/data/content.json`, with a password-protected admin dashboard.
- Optional Supabase backend for auth, the `site_content` table, and image storage.
- Certificates page and a reworked responsive/mobile layout.
- Migrated from `gsap-trial` to the standard `gsap` package.

Thanks to the original author for the foundation.

## License

This project is open source under the [MIT License](LICENSE). The original work is copyright © Rajesh Chityal (as stated in the upstream `akashrmalhotra/3d-portfolio` license); modifications in this fork are copyright © 2026 Ujang. Both are distributed under the same MIT terms — keep the original copyright notice when redistributing.
