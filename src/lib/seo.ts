import {
  APP_NAME,
  OG_IMAGE_PATH,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_TITLE,
  SITE_URL,
  THEME_COLOR,
} from "@/lib/site";

type HeadMeta = { title?: string } | Record<string, string | undefined>;

function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "A frontend-only ATS-friendly CV builder for creating clean, professional resumes directly in the browser.",
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function getDefaultHead() {
  const ogImage = absoluteUrl(OG_IMAGE_PATH);

  const meta: HeadMeta[] = [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { title: SEO_TITLE },
    { name: "description", content: SEO_DESCRIPTION },
    { name: "keywords", content: SEO_KEYWORDS },
    { name: "author", content: APP_NAME },
    { name: "robots", content: "index, follow" },
    { name: "theme-color", content: THEME_COLOR },
    { property: "og:title", content: SEO_TITLE },
    { property: "og:description", content: SEO_DESCRIPTION },
    { property: "og:type", content: "website" },
    { property: "og:url", content: SITE_URL },
    { property: "og:site_name", content: APP_NAME },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: SEO_TITLE },
    { name: "twitter:description", content: SEO_DESCRIPTION },
    { name: "twitter:image", content: ogImage },
  ];

  const links = [
    { rel: "canonical", href: SITE_URL },
    { rel: "icon", href: "/logo.png", type: "image/png" },
    { rel: "apple-touch-icon", href: "/logo.png" },
  ];

  const scripts = [
    {
      type: "application/ld+json",
      children: JSON.stringify(getWebApplicationJsonLd()),
    },
  ];

  return { meta, links, scripts };
}
