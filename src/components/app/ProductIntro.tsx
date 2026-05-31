import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/site";

const FEATURES = [
  "ATS-friendly",
  "No login",
  "Local-first",
  "JSON import",
  "PDF/PNG export",
] as const;

export function ProductIntro() {
  return (
    <section
      className="rounded-xl border border-border bg-card/50 p-4 md:p-5"
      aria-labelledby="product-intro-heading"
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-primary">
        Build ATS-friendly CVs with {APP_NAME}
      </p>
      <h1
        id="product-intro-heading"
        className="mt-1 text-lg font-semibold text-foreground md:text-xl"
      >
        Build a clean ATS-friendly CV in minutes
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {APP_NAME} helps you create a professional resume with structured sections, live preview,
        JSON import, and export-ready formatting. No login required — your draft stays local in your
        browser.
      </p>
      <ul className="mt-3 hidden list-none space-y-1 text-[12px] text-muted-foreground sm:block">
        <li>ATS-friendly resume layout</li>
        <li>Live A4 CV preview</li>
        <li>Local-first draft editing</li>
        <li>Import data from JSON</li>
        <li>Ready for PDF and PNG export</li>
      </ul>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {FEATURES.map((label) => (
          <Badge key={label} variant="secondary" className="text-[11px] font-normal">
            {label}
          </Badge>
        ))}
      </div>
    </section>
  );
}
