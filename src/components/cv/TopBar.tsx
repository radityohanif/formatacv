import { Eye } from "lucide-react";
import { AppBrand, AppLogo } from "@/components/app/AppBrand";
import { GitHubLink } from "@/components/app/GitHubLink";
import { Button } from "@/components/ui/button";
import { LocalStorageStatus } from "./LocalStorageStatus";
import { ExportActions } from "./ExportActions";
import { ImportJsonButton } from "./json-import/ImportJsonButton";
import type { SaveStatus } from "@/hooks/useCVStorage";

export function TopBar({
  saveStatus,
  lastSaved,
  fullName,
  getExportElement,
  onReset,
  onPreview,
  onImportJson,
}: {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  fullName: string;
  getExportElement: () => HTMLElement | null;
  onReset: () => void;
  onPreview?: () => void;
  onImportJson?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <AppLogo size={32} className="h-8 w-8 rounded-md" />
        <AppBrand compact />
      </div>

      <div className="hidden min-w-0 lg:block">
        <AppBrand />
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Create clean, professional, ATS-friendly CVs directly in your browser.
        </p>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <LocalStorageStatus status={saveStatus} lastSaved={lastSaved} />
        <GitHubLink />
        {onPreview && (
          <Button variant="outline" size="sm" className="lg:hidden" onClick={onPreview}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        )}
        {onImportJson && <ImportJsonButton onClick={onImportJson} />}
        <ExportActions getExportElement={getExportElement} fullName={fullName} onReset={onReset} />
      </div>
    </header>
  );
}
