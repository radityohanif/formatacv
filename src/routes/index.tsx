import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FileEdit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/cv/TopBar";
import { StepSidebar } from "@/components/cv/StepSidebar";
import { PreviewPanel } from "@/components/cv/PreviewPanel";
import { ChecklistCard } from "@/components/cv/ChecklistCard";
import { CVPreview } from "@/components/cv/CVPreview";
import { ValidationBanner } from "@/components/cv/LocalStorageStatus";
import { JsonImportModal } from "@/components/cv/json-import/JsonImportModal";
import {
  PersonalInfoForm,
  SummaryForm,
  EducationForm,
  ExperienceForm,
  ProjectsForm,
  ActivitiesForm,
  SkillsForm,
  ReviewForm,
} from "@/components/cv/forms/Forms";
import { useCVStorage } from "@/hooks/useCVStorage";
import { getValidationWarnings } from "@/lib/validation";
import { sectionIds, type SectionId } from "@/data/sampleCV";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATS CV Builder — Clean, professional resumes" },
      {
        name: "description",
        content:
          "Build a clean, ATS-friendly resume with a guided builder. No login. Export to PDF or PNG.",
      },
      { property: "og:title", content: "ATS CV Builder" },
      {
        property: "og:description",
        content: "Guided, no-login CV builder with a live ATS-friendly preview.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data, setData, saveStatus, lastSaved, resetData } = useCVStorage();
  const [active, setActive] = useState<SectionId>("personal");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [importOpen, setImportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const getExportElement = () => exportRef.current;
  const openImport = () => setImportOpen(true);

  const handleImportApply = (imported: typeof data) => {
    setData(imported);
    setImportOpen(false);
  };

  const completion = useMemo<Record<SectionId, boolean>>(
    () => ({
      personal: !!(data.personal.fullName && data.personal.email),
      summary: data.summary.trim().length > 40,
      education: data.education.length > 0,
      experience: data.experience.length > 0,
      projects: data.projects.length > 0,
      activities: data.activities.length > 0,
      skills: !!data.additional.technicalSkills.trim(),
      review: false,
    }),
    [data],
  );

  const percent = Math.round(
    (Object.entries(completion).filter(([k, v]) => k !== "review" && v).length /
      (sectionIds.length - 1)) *
      100,
  );

  const warnings = useMemo(() => getValidationWarnings(data), [data]);

  const checklist = [
    { label: "Personal info completed", done: completion.personal },
    { label: "At least one experience added", done: completion.experience },
    { label: "Skills added", done: completion.skills },
    {
      label: "Valid email present",
      done: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email.trim()),
    },
    { label: "Summary written", done: completion.summary },
  ];

  const idx = sectionIds.indexOf(active);
  const prev = () => idx > 0 && setActive(sectionIds[idx - 1]);
  const next = () => idx < sectionIds.length - 1 && setActive(sectionIds[idx + 1]);

  const formProps = { data, setData, onOpenImport: openImport };
  const formNode =
    active === "personal" ? (
      <PersonalInfoForm {...formProps} />
    ) : active === "summary" ? (
      <SummaryForm data={data} setData={setData} />
    ) : active === "education" ? (
      <EducationForm data={data} setData={setData} />
    ) : active === "experience" ? (
      <ExperienceForm data={data} setData={setData} />
    ) : active === "projects" ? (
      <ProjectsForm data={data} setData={setData} />
    ) : active === "activities" ? (
      <ActivitiesForm data={data} setData={setData} />
    ) : active === "skills" ? (
      <SkillsForm data={data} setData={setData} />
    ) : (
      <ReviewForm
        data={data}
        checklist={checklist}
        warnings={warnings}
        onJump={() => setActive("personal")}
        getExportElement={getExportElement}
        onReset={resetData}
        onImportJson={openImport}
      />
    );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <StepSidebar
        active={active}
        onChange={setActive}
        completion={completion}
        percent={percent}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar
          saveStatus={saveStatus}
          lastSaved={lastSaved}
          fullName={data.personal.fullName}
          getExportElement={getExportElement}
          onReset={resetData}
          onPreview={() => setMobileTab("preview")}
          onImportJson={openImport}
        />

        <div className="flex items-center justify-center gap-1 border-b border-border bg-card/60 p-2 lg:hidden">
          <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
            {(["edit", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMobileTab(t)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm capitalize transition-colors ${
                  mobileTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t === "edit" ? (
                  <FileEdit className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <section
            className={`min-w-0 flex-1 overflow-y-auto p-4 lg:min-w-[360px] lg:flex-[1.15] lg:p-6 ${
              mobileTab === "preview" ? "hidden lg:block" : ""
            }`}
          >
            <div className="mb-4 flex gap-1 overflow-x-auto lg:hidden">
              {sectionIds.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActive(id)}
                  className={`shrink-0 rounded-full border px-3 py-1 text-[12px] capitalize transition-colors ${
                    id === active
                      ? "border-primary bg-primary text-primary-foreground"
                      : completion[id]
                        ? "border-success/40 bg-success/10 text-success"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {i + 1}. {id}
                </button>
              ))}
            </div>

            <div className="mx-auto max-w-3xl space-y-4">
              <ValidationBanner warnings={warnings} />
              <div className="hidden md:block">
                <ChecklistCard items={checklist} />
              </div>
              {formNode}

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={prev} disabled={idx === 0}>
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <span className="text-[12px] text-muted-foreground">
                  Step {idx + 1} of {sectionIds.length}
                </span>
                <Button onClick={next} disabled={idx === sectionIds.length - 1}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          <aside
            className={`min-w-0 border-l border-border bg-surface lg:flex-1 lg:min-w-[320px] lg:max-w-[min(48%,560px)] ${
              mobileTab === "edit" ? "hidden lg:block" : "flex-1"
            }`}
          >
            <div className="sticky top-0 h-screen">
              <PreviewPanel data={data} />
            </div>
          </aside>
        </div>
      </main>

      <div className="pointer-events-none fixed left-[-9999px] top-0" aria-hidden ref={exportRef}>
        <CVPreview data={data} forExport />
      </div>

      <JsonImportModal
        open={importOpen}
        onOpenChange={setImportOpen}
        currentData={data}
        onApply={handleImportApply}
      />
    </div>
  );
}
