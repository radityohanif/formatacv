import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sectionIds, sectionMeta, type SectionId } from "@/data/sampleCV";

const SIDEBAR_COLLAPSED_KEY = "cv_sidebar_collapsed";

interface Props {
  active: SectionId;
  onChange: (id: SectionId) => void;
  completion: Record<SectionId, boolean>;
  percent: number;
}

export function StepSidebar({ active, onChange, completion, percent }: Props) {
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
          "relative hidden shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-300 ease-in-out lg:flex",
          collapsed ? "w-17" : "w-72",
        )}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-3",
            !collapsed && "p-5",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              collapsed && "justify-center",
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              A
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">ATS CV Builder</div>
                <div className="text-[11px] text-muted-foreground">Clean. Simple. Hireable.</div>
              </div>
            )}
          </div>

          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-2">
                  <span className="text-[10px] font-semibold text-primary">{percent}%</span>
                  <div className="h-12 w-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="w-full rounded-full bg-primary transition-all"
                      style={{ height: `${percent}%` }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Completion {percent}%</TooltipContent>
            </Tooltip>
          ) : (
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Completion</span>
                <span className="font-semibold text-primary">{percent}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-1 overflow-y-auto">
            {sectionIds.map((id, i) => {
              const isActive = id === active;
              const done = completion[id];
              const stepButton = (
                <button
                  key={id}
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
