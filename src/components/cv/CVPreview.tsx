import { forwardRef } from "react";
import type { CVData } from "@/data/sampleCV";
import { formatDateRange } from "@/data/sampleCV";

function PageBlock({
  forExport,
  children,
}: {
  forExport: boolean;
  children: React.ReactNode;
}) {
  if (!forExport) return <>{children}</>;
  return (
    <div data-page-block="" style={{ width: "100%" }}>
      {children}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-6 mb-3">
      <h2 className="text-[10.5px] font-bold tracking-[0.18em] text-black uppercase">{title}</h2>
      <div className="mt-1.5 mb-2 h-px w-full bg-black" style={{ width: "100%" }} />
    </div>
  );
}

function EntryHeader({
  left,
  right,
  subLeft,
  subRight,
}: {
  left: string;
  right?: string;
  subLeft?: string;
  subRight?: string;
}) {
  return (
    <div style={{ width: "100%" }}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11.5px] font-semibold text-black">{left}</span>
        {right && <span className="shrink-0 text-[10.5px] text-black">{right}</span>}
      </div>
      {(subLeft || subRight) && (
        <div className="flex items-baseline justify-between gap-3">
          {subLeft && <span className="text-[11px] italic text-black">{subLeft}</span>}
          {subRight && <span className="shrink-0 text-[10.5px] italic text-black">{subRight}</span>}
        </div>
      )}
    </div>
  );
}

function Bullets({ items, forExport = false }: { items: string[]; forExport?: boolean }) {
  const filtered = items.filter((b) => b.trim());
  if (!filtered.length) return null;

  if (forExport) {
    return (
      <>
        {filtered.map((b, i) => (
          <div key={i} data-page-block="" style={{ width: "100%" }}>
            <BulletLine text={b} />
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="mt-1 space-y-1">
      {filtered.map((b, i) => (
        <BulletLine key={i} text={b} />
      ))}
    </div>
  );
}

function BulletLine({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2" style={{ width: "100%" }}>
      <span
        className="shrink-0 text-[11px] leading-snug text-black"
        style={{ width: "0.75em", textAlign: "center" }}
        aria-hidden
      >
        •
      </span>
      <span className="min-w-0 flex-1 text-[11px] leading-snug text-black">{text}</span>
    </div>
  );
}

function TextLine({ children }: { children: string }) {
  if (!children.trim()) return null;
  return <p className="mt-0.5 text-[11px] leading-snug text-black">{children}</p>;
}

export const CVPreview = forwardRef<
  HTMLDivElement,
  { data: CVData; scale?: number; forExport?: boolean }
>(function CVPreview({ data, scale = 1, forExport = false }, ref) {
  const p = data.personal;
  const contactParts = [p.email, p.phone, p.location, p.linkedin, p.portfolio, p.website].filter(
    Boolean,
  );

  return (
    <div
      ref={ref}
      id="cv-preview-document"
      className={
        forExport
          ? "bg-white text-black"
          : "origin-top mx-auto bg-white text-black shadow-[0_4px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/5"
      }
      style={{
        width: "210mm",
        minHeight: forExport ? undefined : "297mm",
        padding: "16mm 20mm",
        fontFamily: "Inter, Arial, Helvetica, ui-sans-serif, system-ui, sans-serif",
        transform: forExport ? undefined : `scale(${scale})`,
      }}
    >
      <PageBlock forExport={forExport}>
        <header className="mb-2 text-center">
          <h1 className="text-[22px] font-bold tracking-wide text-black">
            {p.fullName || "Your Name"}
          </h1>
          {p.title && <p className="mt-1 text-[11px] text-black">{p.title}</p>}
          {contactParts.length > 0 && (
            <p className="mt-1.5 text-[10.5px] text-black">{contactParts.join("  ·  ")}</p>
          )}
        </header>
      </PageBlock>

      {data.summary.trim() && (
        <>
          <PageBlock forExport={forExport}>
            <SectionHeader title="Summary" />
          </PageBlock>
          <PageBlock forExport={forExport}>
            <p className="text-[11px] leading-snug text-black">{data.summary}</p>
          </PageBlock>
        </>
      )}

      {data.education.length > 0 && (
        <>
          <PageBlock forExport={forExport}>
            <SectionHeader title="Education" />
          </PageBlock>
          {data.education.map((e) => (
            <PageBlock key={e.id} forExport={forExport}>
              <div>
                <EntryHeader
                  left={e.institution}
                  right={e.location}
                  subLeft={[e.degree, e.major].filter(Boolean).join(", ")}
                  subRight={formatDateRange(e.startDate, e.endDate)}
                />
                <TextLine>{e.gpa}</TextLine>
                <TextLine>{e.coursework}</TextLine>
              </div>
            </PageBlock>
          ))}
        </>
      )}

      {data.experience.length > 0 && (
        <>
          <PageBlock forExport={forExport}>
            <SectionHeader title="Work Experience" />
          </PageBlock>
          {data.experience.map((x) => (
            <div key={x.id}>
              <PageBlock forExport={forExport}>
                <EntryHeader
                  left={x.company}
                  right={x.location}
                  subLeft={x.title}
                  subRight={formatDateRange(x.startDate, x.endDate, x.isCurrent)}
                />
              </PageBlock>
              <Bullets items={x.bullets} forExport={forExport} />
            </div>
          ))}
        </>
      )}

      {data.projects.length > 0 && (
        <>
          <PageBlock forExport={forExport}>
            <SectionHeader title="Projects" />
          </PageBlock>
          {data.projects.map((pr) => (
            <div key={pr.id}>
              <PageBlock forExport={forExport}>
                <EntryHeader left={pr.name} right={pr.date} subLeft={pr.techStack} />
              </PageBlock>
              <Bullets items={pr.bullets} forExport={forExport} />
            </div>
          ))}
        </>
      )}

      {data.activities.length > 0 && (
        <>
          <PageBlock forExport={forExport}>
            <SectionHeader title="Activities" />
          </PageBlock>
          {data.activities.map((a) => (
            <div key={a.id}>
              <PageBlock forExport={forExport}>
                <EntryHeader
                  left={a.organization}
                  right={a.location}
                  subLeft={a.role}
                  subRight={formatDateRange(a.startDate, a.endDate)}
                />
              </PageBlock>
              <Bullets items={a.bullets} forExport={forExport} />
            </div>
          ))}
        </>
      )}

      {(data.additional.technicalSkills ||
        data.additional.languages ||
        data.additional.certifications ||
        data.additional.awards) && (
        <>
          <PageBlock forExport={forExport}>
            <SectionHeader title="Additional" />
          </PageBlock>
          <PageBlock forExport={forExport}>
            <div className="space-y-0.5 text-[11px] text-black">
              {data.additional.technicalSkills && (
                <p>
                  <span className="font-semibold">Technical:</span> {data.additional.technicalSkills}
                </p>
              )}
              {data.additional.languages && (
                <p>
                  <span className="font-semibold">Languages:</span> {data.additional.languages}
                </p>
              )}
              {data.additional.certifications && (
                <p>
                  <span className="font-semibold">Certifications:</span>{" "}
                  {data.additional.certifications}
                </p>
              )}
              {data.additional.awards && (
                <p>
                  <span className="font-semibold">Awards:</span> {data.additional.awards}
                </p>
              )}
            </div>
          </PageBlock>
        </>
      )}
    </div>
  );
});
