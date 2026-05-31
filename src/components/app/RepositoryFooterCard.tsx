import { Github } from "lucide-react";
import { APP_NAME, REPOSITORY_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export function RepositoryFooterCard({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="border-t border-border p-2">
        <a
          href={REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View FormataCV repository on GitHub"
          className="flex h-9 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Github className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="border-t border-border p-4">
      <a
        href={REPOSITORY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group block rounded-lg border border-border bg-card/60 p-3 transition-colors",
          "hover:border-primary/30 hover:bg-card",
        )}
      >
        <div className="flex items-start gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <Github className="h-4 w-4 text-foreground" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">{APP_NAME}</span>
            <span className="block text-[11px] text-muted-foreground">
              Open-source ATS CV builder
            </span>
            <span className="mt-1.5 block text-[11px] font-medium text-primary group-hover:underline">
              View repository →
            </span>
          </span>
        </div>
      </a>
    </div>
  );
}
