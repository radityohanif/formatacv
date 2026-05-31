import { APP_NAME, TAGLINE } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AppLogo({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <img
      src="/logo.png"
      alt={`${APP_NAME} logo`}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-lg object-contain", className)}
    />
  );
}

export function AppBrand({
  showBadge = false,
  compact = false,
}: {
  showBadge?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-sm")}>
          {APP_NAME}
        </span>
        {showBadge && (
          <Badge
            variant="outline"
            className="h-5 px-1.5 text-[10px] font-normal text-muted-foreground"
          >
            Open Source
          </Badge>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">{TAGLINE}</p>
    </div>
  );
}
