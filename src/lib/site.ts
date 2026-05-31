/** Public app identity — safe for client bundle (no secrets). */
export const APP_NAME = import.meta.env.VITE_APP_NAME ?? "FormataCV";

export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://formatacv.netlify.app").replace(
  /\/$/,
  "",
);

export const REPOSITORY_URL =
  import.meta.env.VITE_REPOSITORY_URL ?? "https://github.com/radityohanif/formatacv";

export const TAGLINE = "ATS-friendly CV builder";

export const SEO_TITLE = `${APP_NAME} — ATS-Friendly CV Builder`;

export const SEO_DESCRIPTION =
  "Create clean, professional, ATS-friendly CVs directly in your browser. No login required. Build, edit, preview, and export your resume with a modern local-first CV builder.";

export const SEO_KEYWORDS = [
  "ATS CV builder",
  "ATS resume builder",
  "CV builder",
  "resume builder",
  "professional CV",
  "CV maker",
  "resume maker",
  "frontend CV builder",
  "local-first CV builder",
  "no login CV builder",
  APP_NAME,
].join(", ");

/** TODO: Add a dedicated 1200×630 social card at public/og-image.png */
export const OG_IMAGE_PATH = "/og-image.png";

export const THEME_COLOR = "#1d6fd8";
