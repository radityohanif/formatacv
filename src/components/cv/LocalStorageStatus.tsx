import { useEffect, useState } from "react";
import { AlertTriangle, Cloud, CloudOff, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SaveStatus } from "@/hooks/useCVStorage";

function formatRelativeTime(date: Date | null) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function LocalStorageStatus({
  status,
  lastSaved,
}: {
  status: SaveStatus;
  lastSaved: Date | null;
}) {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    if (!lastSaved) {
      setRelativeTime("");
      return;
    }

    const update = () => setRelativeTime(formatRelativeTime(lastSaved));
    update();
    const timer = window.setInterval(update, 10_000);
    return () => window.clearInterval(timer);
  }, [lastSaved]);
  if (status === "saving") {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving…
      </Badge>
    );
  }

  if (status === "saved") {
    return (
      <Badge variant="secondary" className="gap-1.5 border-success/30 bg-success/10 text-success">
        <Cloud className="h-3 w-3" />
        Saved locally{relativeTime ? ` · ${relativeTime}` : ""}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1.5 text-muted-foreground">
      <CloudOff className="h-3 w-3" />
      Save unavailable
    </Badge>
  );
}

export function ValidationBanner({
  warnings,
}: {
  warnings: { id: string; message: string; severity: "info" | "warning" }[];
}) {
  if (!warnings.length) return null;

  const critical = warnings.filter((w) => w.severity === "warning");

  return (
    <div className="space-y-2">
      {critical.slice(0, 3).map((w) => (
        <div
          key={w.id}
          className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-[12px] text-foreground"
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
          {w.message}
        </div>
      ))}
    </div>
  );
}
