# FormataCV

**FormataCV** is a frontend-only, ATS-friendly CV builder. Create clean, professional resumes directly in your browser — no login, local-first editing, and export-ready PDF/PNG output.

- **Live app:** [https://formatacv.netlify.app](https://formatacv.netlify.app) (after deploy)
- **Repository:** [https://github.com/radityohanif/formatacv](https://github.com/radityohanif/formatacv)

## Features

- ATS-friendly resume layout with live A4 preview
- Guided sections (personal info, experience, education, projects, and more)
- Local-first draft storage in your browser
- Import from JSON
- Export to PDF or PNG

## Development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production build outputs static assets to `dist/client` (including `index.html` for SPA hosting).

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Description |
| --- | --- |
| `VITE_APP_NAME` | Product name shown in the UI |
| `VITE_SITE_URL` | Canonical / Open Graph base URL |
| `VITE_REPOSITORY_URL` | GitHub repository link |

No secrets are required — this app is fully client-side.

## Deploy to Netlify

1. Connect the GitHub repository to Netlify.
2. Use these build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/client`
   - **Node version:** `20` (see `.nvmrc`)
3. Add environment variables in the Netlify UI (optional, defaults are in code):
   - `VITE_APP_NAME`
   - `VITE_SITE_URL`
   - `VITE_REPOSITORY_URL`
4. Deploy.

`netlify.toml` and `public/_redirects` configure SPA routing (`/*` → `/index.html`) and basic security/cache headers.

### Social preview image

Add a 1200×630 image at `public/og-image.png` for richer link previews. Until then, metadata references that path; browsers may fall back gracefully.

## License

Open source — see the repository for license details.
