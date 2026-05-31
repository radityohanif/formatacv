import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REPOSITORY_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

type Variant = "button" | "icon";

export function GitHubLink({
  variant = "button",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  if (variant === "icon") {
    return (
      <Button variant="outline" size="icon" className={cn("shrink-0", className)} asChild>
        <a
          href={REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View FormataCV repository on GitHub"
        >
          <Github className="h-4 w-4" />
        </a>
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" className={cn("shrink-0 gap-1.5", className)} asChild>
      <a
        href={REPOSITORY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View FormataCV repository on GitHub"
      >
        <Github className="h-4 w-4" />
        <span className="hidden sm:inline">View on GitHub</span>
        <span className="sm:hidden">GitHub</span>
      </a>
    </Button>
  );
}
