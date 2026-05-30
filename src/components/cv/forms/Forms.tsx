import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SectionCard, Field, EntryCard, EmptyState, reorderList } from "../SectionCard";
import { BulletEditor } from "../BulletEditor";
import { ChecklistCard } from "../ChecklistCard";
import { ExportActions } from "../ExportActions";
import { ValidationBanner } from "../LocalStorageStatus";
import { ImportJsonButton } from "../json-import/ImportJsonButton";
import type { CVData } from "@/data/sampleCV";
import { newId, sectionMeta } from "@/data/sampleCV";
import type { ValidationWarning } from "@/lib/validation";

type Props = { data: CVData; setData: (d: CVData) => void; onOpenImport?: () => void };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PersonalInfoForm({ data, setData, onOpenImport }: Props) {
  const p = data.personal;
  const set = (k: keyof typeof p, v: string) => setData({ ...data, personal: { ...p, [k]: v } });
  const m = sectionMeta.personal;

  const emailWarning =
    p.email && !EMAIL_RE.test(p.email.trim()) ? "Email format looks invalid" : undefined;

  return (
    <SectionCard title={m.label} description={m.description} hint={m.hint}>
      {!p.fullName.trim() && onOpenImport && (
        <div className="mb-4 flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Start faster with JSON</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Paste structured CV data from LinkedIn, a portfolio, or AI output.
            </p>
          </div>
          <ImportJsonButton onClick={onOpenImport} variant="default" />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <Input
            value={p.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Alex Morgan"
          />
        </Field>
        <Field label="Title / headline" hint="Optional">
          <Input
            value={p.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Software Engineer"
          />
        </Field>
        <Field label="Email" required warning={emailWarning}>
          <Input
            type="email"
            value={p.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@email.com"
          />
        </Field>
        <Field
          label="Phone"
          warning={!p.phone.trim() ? "Consider adding a phone number" : undefined}
        >
          <Input
            value={p.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </Field>
        <Field label="Location">
          <Input
            value={p.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </Field>
        <Field label="LinkedIn URL">
          <Input
            value={p.linkedin}
            onChange={(e) => set("linkedin", e.target.value)}
            placeholder="linkedin.com/in/yourname"
          />
        </Field>
        <Field label="Portfolio / GitHub">
          <Input
            value={p.portfolio}
            onChange={(e) => set("portfolio", e.target.value)}
            placeholder="github.com/yourname"
          />
        </Field>
        <Field label="Personal website" hint="Optional">
          <Input
            value={p.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="yourname.dev"
          />
        </Field>
      </div>
    </SectionCard>
  );
}

export function SummaryForm({ data, setData }: Props) {
  const m = sectionMeta.summary;
  return (
    <SectionCard title={m.label} description={m.description} hint={m.hint}>
      <Field label="Professional summary" hint={`${data.summary.length}/400`}>
        <Textarea
          rows={5}
          maxLength={400}
          value={data.summary}
          onChange={(e) => setData({ ...data, summary: e.target.value })}
          placeholder="Senior engineer with 6+ years shipping reliable internal tools…"
        />
      </Field>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          "5+ years building reliable internal tools",
          "Comfortable owning features end-to-end",
          "Translate business needs into shippable solutions",
        ].map((s) => (
          <Badge
            key={s}
            variant="outline"
            className="cursor-pointer font-normal hover:border-primary/40 hover:bg-primary/5"
            onClick={() =>
              setData({
                ...data,
                summary: data.summary ? `${data.summary} ${s}.` : `${s}.`,
              })
            }
          >
            + {s}
          </Badge>
        ))}
      </div>
    </SectionCard>
  );
}

export function EducationForm({ data, setData }: Props) {
  const m = sectionMeta.education;
  const add = () =>
    setData({
      ...data,
      education: [
        ...data.education,
        {
          id: newId(),
          institution: "",
          degree: "",
          major: "",
          location: "",
          startDate: "",
          endDate: "",
          gpa: "",
          coursework: "",
        },
      ],
    });
  const update = (id: string, patch: Partial<CVData["education"][number]>) =>
    setData({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  const remove = (id: string) =>
    setData({
      ...data,
      education: data.education.filter((e) => e.id !== id),
    });
  const move = (id: string, direction: "up" | "down") =>
    setData({
      ...data,
      education: reorderList(data.education, id, direction),
    });

  return (
    <SectionCard
      title={m.label}
      description={m.description}
      hint={m.hint}
      action={
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" /> Add education
        </Button>
      }
    >
      <div className="space-y-3">
        {data.education.length === 0 && (
          <EmptyState message="No education entries yet. Add your most recent degree first." />
        )}
        {data.education.map((e, i) => (
          <EntryCard
            key={e.id}
            title={e.institution || "New institution"}
            subtitle={e.degree}
            onRemove={() => remove(e.id)}
            onMoveUp={() => move(e.id, "up")}
            onMoveDown={() => move(e.id, "down")}
            canMoveUp={i > 0}
            canMoveDown={i < data.education.length - 1}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Institution">
                <Input
                  value={e.institution}
                  onChange={(ev) => update(e.id, { institution: ev.target.value })}
                  placeholder="University of California, Berkeley"
                />
              </Field>
              <Field label="Degree / program">
                <Input
                  value={e.degree}
                  onChange={(ev) => update(e.id, { degree: ev.target.value })}
                  placeholder="B.S. in Computer Science"
                />
              </Field>
              <Field label="Major / minor">
                <Input
                  value={e.major}
                  onChange={(ev) => update(e.id, { major: ev.target.value })}
                  placeholder="Minor in Business"
                />
              </Field>
              <Field label="Location">
                <Input
                  value={e.location}
                  onChange={(ev) => update(e.id, { location: ev.target.value })}
                  placeholder="Berkeley, CA"
                />
              </Field>
              <Field label="Start date">
                <Input
                  value={e.startDate}
                  onChange={(ev) => update(e.id, { startDate: ev.target.value })}
                  placeholder="Aug 2016"
                />
              </Field>
              <Field label="End date">
                <Input
                  value={e.endDate}
                  onChange={(ev) => update(e.id, { endDate: ev.target.value })}
                  placeholder="May 2020"
                />
              </Field>
              <Field label="GPA / honors" hint="Optional">
                <Input
                  value={e.gpa}
                  onChange={(ev) => update(e.id, { gpa: ev.target.value })}
                  placeholder="GPA: 3.8 / 4.0 — Dean's List"
                />
              </Field>
              <Field label="Relevant coursework" hint="Optional">
                <Input
                  value={e.coursework}
                  onChange={(ev) => update(e.id, { coursework: ev.target.value })}
                  placeholder="Distributed Systems, Databases…"
                />
              </Field>
            </div>
          </EntryCard>
        ))}
      </div>
    </SectionCard>
  );
}

export function ExperienceForm({ data, setData }: Props) {
  const m = sectionMeta.experience;
  const add = () =>
    setData({
      ...data,
      experience: [
        ...data.experience,
        {
          id: newId(),
          company: "",
          title: "",
          location: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          bullets: [""],
        },
      ],
    });
  const update = (id: string, patch: Partial<CVData["experience"][number]>) =>
    setData({
      ...data,
      experience: data.experience.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    });
  const remove = (id: string) =>
    setData({
      ...data,
      experience: data.experience.filter((x) => x.id !== id),
    });
  const move = (id: string, direction: "up" | "down") =>
    setData({
      ...data,
      experience: reorderList(data.experience, id, direction),
    });

  return (
    <SectionCard
      title={m.label}
      description={m.description}
      hint={m.hint}
      action={
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" /> Add role
        </Button>
      }
    >
      <div className="space-y-4">
        {data.experience.length === 0 && (
          <EmptyState message="No work experience yet. Add your most recent role first." />
        )}
        {data.experience.map((x, i) => (
          <EntryCard
            key={x.id}
            title={x.company || "New company"}
            subtitle={x.title}
            onRemove={() => remove(x.id)}
            onMoveUp={() => move(x.id, "up")}
            onMoveDown={() => move(x.id, "down")}
            canMoveUp={i > 0}
            canMoveDown={i < data.experience.length - 1}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Company">
                <Input
                  value={x.company}
                  onChange={(e) => update(x.id, { company: e.target.value })}
                  placeholder="Northwind Technologies"
                />
              </Field>
              <Field label="Job title">
                <Input
                  value={x.title}
                  onChange={(e) => update(x.id, { title: e.target.value })}
                  placeholder="Senior Software Engineer"
                />
              </Field>
              <Field label="Location">
                <Input
                  value={x.location}
                  onChange={(e) => update(x.id, { location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Start date">
                  <Input
                    value={x.startDate}
                    onChange={(e) => update(x.id, { startDate: e.target.value })}
                    placeholder="Jun 2022"
                  />
                </Field>
                <Field label="End date">
                  <Input
                    value={x.endDate}
                    disabled={x.isCurrent}
                    onChange={(e) => update(x.id, { endDate: e.target.value })}
                    placeholder="Present"
                  />
                </Field>
              </div>
            </div>
            <label className="mt-3 flex items-center gap-2 text-[12.5px] text-foreground">
              <Checkbox
                checked={x.isCurrent}
                onCheckedChange={(c) =>
                  update(x.id, {
                    isCurrent: !!c,
                    endDate: c ? "Present" : x.endDate,
                  })
                }
              />
              I currently work here
            </label>
            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-2 text-[12.5px] font-medium text-foreground">Achievements</div>
              <BulletEditor bullets={x.bullets} onChange={(bullets) => update(x.id, { bullets })} />
            </div>
          </EntryCard>
        ))}
      </div>
    </SectionCard>
  );
}

export function ProjectsForm({ data, setData }: Props) {
  const m = sectionMeta.projects;
  const add = () =>
    setData({
      ...data,
      projects: [
        ...data.projects,
        {
          id: newId(),
          name: "",
          techStack: "",
          date: "",
          bullets: [""],
        },
      ],
    });
  const update = (id: string, patch: Partial<CVData["projects"][number]>) =>
    setData({
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  const remove = (id: string) =>
    setData({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  const move = (id: string, direction: "up" | "down") =>
    setData({
      ...data,
      projects: reorderList(data.projects, id, direction),
    });

  return (
    <SectionCard
      title={m.label}
      description={m.description}
      hint={m.hint}
      action={
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" /> Add project
        </Button>
      }
    >
      <div className="space-y-4">
        {data.projects.length === 0 && (
          <EmptyState message="No projects yet. Highlight side projects or open-source work." />
        )}
        {data.projects.map((p, i) => (
          <EntryCard
            key={p.id}
            title={p.name || "New project"}
            subtitle={p.techStack}
            onRemove={() => remove(p.id)}
            onMoveUp={() => move(p.id, "up")}
            onMoveDown={() => move(p.id, "down")}
            canMoveUp={i > 0}
            canMoveDown={i < data.projects.length - 1}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Project name">
                <Input
                  value={p.name}
                  onChange={(e) => update(p.id, { name: e.target.value })}
                  placeholder="OpenLedger"
                />
              </Field>
              <Field label="Role / tech stack">
                <Input
                  value={p.techStack}
                  onChange={(e) => update(p.id, { techStack: e.target.value })}
                  placeholder="TypeScript, Postgres, Next.js"
                />
              </Field>
              <Field label="Date range" hint="e.g. Jan 2024 – Present">
                <Input
                  value={p.date}
                  onChange={(e) => update(p.id, { date: e.target.value })}
                  placeholder="Jan 2024 – Present"
                />
              </Field>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <BulletEditor bullets={p.bullets} onChange={(bullets) => update(p.id, { bullets })} />
            </div>
          </EntryCard>
        ))}
      </div>
    </SectionCard>
  );
}

export function ActivitiesForm({ data, setData }: Props) {
  const m = sectionMeta.activities;
  const add = () =>
    setData({
      ...data,
      activities: [
        ...data.activities,
        {
          id: newId(),
          organization: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          bullets: [""],
        },
      ],
    });
  const update = (id: string, patch: Partial<CVData["activities"][number]>) =>
    setData({
      ...data,
      activities: data.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    });
  const remove = (id: string) =>
    setData({
      ...data,
      activities: data.activities.filter((a) => a.id !== id),
    });
  const move = (id: string, direction: "up" | "down") =>
    setData({
      ...data,
      activities: reorderList(data.activities, id, direction),
    });

  return (
    <SectionCard
      title={m.label}
      description={m.description}
      hint={m.hint}
      action={
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" /> Add activity
        </Button>
      }
    >
      <div className="space-y-4">
        {data.activities.length === 0 && (
          <EmptyState message="No activities yet. Add volunteering, clubs, or leadership roles." />
        )}
        {data.activities.map((a, i) => (
          <EntryCard
            key={a.id}
            title={a.organization || "New activity"}
            subtitle={a.role}
            onRemove={() => remove(a.id)}
            onMoveUp={() => move(a.id, "up")}
            onMoveDown={() => move(a.id, "down")}
            canMoveUp={i > 0}
            canMoveDown={i < data.activities.length - 1}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Organization">
                <Input
                  value={a.organization}
                  onChange={(e) => update(a.id, { organization: e.target.value })}
                  placeholder="Code the Bay"
                />
              </Field>
              <Field label="Role">
                <Input
                  value={a.role}
                  onChange={(e) => update(a.id, { role: e.target.value })}
                  placeholder="Volunteer Mentor"
                />
              </Field>
              <Field label="Location">
                <Input
                  value={a.location}
                  onChange={(e) => update(a.id, { location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Start date">
                  <Input
                    value={a.startDate}
                    onChange={(e) => update(a.id, { startDate: e.target.value })}
                    placeholder="Sep 2021"
                  />
                </Field>
                <Field label="End date">
                  <Input
                    value={a.endDate}
                    onChange={(e) => update(a.id, { endDate: e.target.value })}
                    placeholder="Present"
                  />
                </Field>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <BulletEditor bullets={a.bullets} onChange={(bullets) => update(a.id, { bullets })} />
            </div>
          </EntryCard>
        ))}
      </div>
    </SectionCard>
  );
}

export function SkillsForm({ data, setData }: Props) {
  const m = sectionMeta.skills;
  const a = data.additional;
  const set = (k: keyof typeof a, v: string) => setData({ ...data, additional: { ...a, [k]: v } });

  return (
    <SectionCard title={m.label} description={m.description} hint={m.hint}>
      <div className="space-y-4">
        <Field label="Technical skills" hint="Comma-separated or one per line">
          <Textarea
            rows={2}
            value={a.technicalSkills}
            onChange={(e) => set("technicalSkills", e.target.value)}
            placeholder="TypeScript, React, Node.js, PostgreSQL, AWS…"
          />
        </Field>
        <Field label="Languages">
          <Textarea
            rows={2}
            value={a.languages}
            onChange={(e) => set("languages", e.target.value)}
            placeholder="English (native), Spanish (professional)"
          />
        </Field>
        <Field label="Certifications">
          <Textarea
            rows={2}
            value={a.certifications}
            onChange={(e) => set("certifications", e.target.value)}
            placeholder="AWS Certified Solutions Architect — Associate"
          />
        </Field>
        <Field label="Awards">
          <Textarea
            rows={2}
            value={a.awards}
            onChange={(e) => set("awards", e.target.value)}
            placeholder="Dean's List, Hackathon Winner 2023"
          />
        </Field>
      </div>
    </SectionCard>
  );
}

export function ReviewForm({
  data,
  checklist,
  warnings,
  onJump,
  getExportElement,
  onReset,
  onImportJson,
}: {
  data: CVData;
  checklist: { label: string; done: boolean }[];
  warnings: ValidationWarning[];
  onJump: () => void;
  getExportElement: () => HTMLElement | null;
  onReset: () => void;
  onImportJson?: () => void;
}) {
  const m = sectionMeta.review;
  return (
    <SectionCard title={m.label} description={m.description} hint={m.hint}>
      <ValidationBanner warnings={warnings} />
      {onImportJson && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Have structured CV data?</p>
            <p className="text-[12px] text-muted-foreground">
              Import JSON to update your draft before exporting.
            </p>
          </div>
          <ImportJsonButton onClick={onImportJson} />
        </div>
      )}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ChecklistCard items={checklist} />
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <h3 className="text-sm font-semibold text-foreground">Snapshot</h3>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-[12.5px]">
            {(
              [
                ["Experience entries", data.experience.length],
                ["Projects", data.projects.length],
                ["Education", data.education.length],
                ["Activities", data.activities.length],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="rounded-lg bg-surface px-3 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-lg font-semibold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {warnings.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-[12px] text-muted-foreground">
          {warnings.map((w) => (
            <li key={w.id}>· {w.message}</li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={onJump} variant="outline">
          Back to editing
        </Button>
        <ExportActions
          getExportElement={getExportElement}
          fullName={data.personal.fullName}
          onReset={onReset}
          showReset={false}
        />
      </div>
    </SectionCard>
  );
}
