import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { AppBrand, AppLogo } from "@/components/app/AppBrand";
import { RepositoryFooterCard } from "@/components/app/RepositoryFooterCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { sectionIds, sectionMeta, type SectionId } from "@/data/sampleCV";

const SIDEBAR_COLLAPSED_KEY = "cv_sidebar_collapsed";

interface Props {
  active: SectionId;
  onChange: (id: SectionId) => void;
  completion: Record<SectionId, boolean>;
}

export function StepSidebar({ active, onChange, completion }: Props) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  const toggle = () => setCollapsed((c) => !c);

  return (
    <TooltipProvider delayDuration={collapsed ? 200 : 1000}>
      <aside
        className={cn(
          "relative hidden h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-300 ease-in-out lg:sticky lg:top-0 lg:flex",
          collapsed ? "w-17" : "w-72",
        )}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-3",
            !collapsed && "p-5",
          )}
        >
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <AppLogo size={36} className="h-9 w-9" />
            {!collapsed && <AppBrand showBadge />}
          </div>

          <nav className="flex flex-col gap-1 overflow-y-auto" aria-label="CV sections">
            {sectionIds.map((id, i) => {
              const isActive = id === active;
              const done = completion[id];
              const stepButton = (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange(id)}
                  className={cn(
                    "group flex items-center rounded-lg text-left transition-all",
                    collapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5",
                    isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                      done
                        ? "border-transparent bg-success text-white"
                        : isActive
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  {!collapsed && (
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{sectionMeta[id].label}</span>
                      <span className="block text-[11px] text-muted-foreground line-clamp-1">
                        {sectionMeta[id].description}
                      </span>
                    </span>
                  )}
                </button>
              );

              if (!collapsed) return stepButton;

              return (
                <Tooltip key={id}>
                  <TooltipTrigger asChild>{stepButton}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">{sectionMeta[id].label}</p>
                    <p className="text-primary-foreground/80">{sectionMeta[id].description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </div>

        <RepositoryFooterCard collapsed={collapsed} />

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border-border bg-background shadow-sm"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </Button>
      </aside>
    </TooltipProvider>
  );
}
