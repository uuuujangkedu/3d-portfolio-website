# 3D Portfolio Website

This repository contains the source code for a personal 3D portfolio built with React, TypeScript, Three.js, React Three Fiber, and GSAP. It includes animated page sections, a character scene, custom cursor interactions, and smooth transitions designed for a modern portfolio experience.

Live site: _add your deployed URL here._

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
├── public/                    # Static assets
├── src/
│   ├── assets/                # Local media/assets
│   ├── components/
│   │   ├── Character/         # 3D scene + character logic/utilities
│   │   ├── styles/            # Section/component CSS files
│   │   ├── About.tsx
│   │   ├── Career.tsx
│   │   ├── Contact.tsx
│   │   ├── Landing.tsx
│   │   ├── MainContainer.tsx  # Main page composition
│   │   ├── Navbar.tsx
│   │   ├── TechStack.tsx
│   │   ├── WhatIDo.tsx
│   │   └── Work.tsx
│   ├── context/               # Global providers (loading state, etc.)
│   ├── data/                  # Static data/content definitions
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

All page copy lives in one file: `src/data/content.json` (name, landing words, about, career, projects, tech stack, contact links, social icons, resume path, loader initials, browser title). Components read it through `useContent()`, so text changes never require touching `.tsx` files.

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

## License

This project is open source and available under the [MIT License](LICENSE).
