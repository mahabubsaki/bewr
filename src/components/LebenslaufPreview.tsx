import PhotoUpload from "../components/PhotoUpload";
import type { LebenslaufData } from "../data/defaultData";

type SectionId =
  | "personal"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "interests";

const SECTION_LABELS: Record<SectionId, string> = {
  personal: "Persönliche Daten",
  about: "Über mich",
  skills: "IT-Kenntnisse",
  projects: "Projekte",
  experience: "Berufserfahrung",
  education: "Ausbildung",
  interests: "Kenntnisse und Interessen",
};

interface LebenslaufPreviewProps {
  data: LebenslaufData;
  activeSections: SectionId[];
  onUpdate: (path: string, value: unknown) => void;
}

export default function LebenslaufPreview({ data, activeSections, onUpdate }: LebenslaufPreviewProps) {
  const renderPreviewSection = (id: SectionId) => {
    const title = data.sectionTitles?.[id] || SECTION_LABELS[id];
    
    const SectionHeader = () => (
      <h2 className="mb-2 mt-2 border-b-2 border-[#bbb] pb-1 text-[12pt] font-semibold uppercase text-[#3d3d3d]">
        {title}
      </h2>
    );

    switch (id) {
      case "personal":
        return (
          <div key={id} className="mb-3">
            <SectionHeader />
            <div className="space-y-1">
              {data.personalFields?.map((f, i) => (
                <div key={i} className="flex py-0.5">
                  <div className="w-[145pt] shrink-0 text-[9.5pt] text-[#555] pr-5">{f.label}</div>
                  <div className="flex-1 text-[10pt] text-[#1a1a1a]">{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "about":
        return (
          <div key={id} className="mb-3">
            <SectionHeader />
            <p className="text-[9.5pt] leading-[1.6] text-[#1a1a1a] whitespace-pre-wrap">{data.aboutMe}</p>
          </div>
        );
      case "skills":
        return (
          <div key={id} className="mb-3">
            <SectionHeader />
            <div className="space-y-1">
              {data.skills.map((s, i) => (
                <div key={i} className="flex py-0.5">
                  <div className="w-[145pt] shrink-0 text-[9.5pt] text-[#555] pr-5">{s.category}</div>
                  <div className="flex-1 text-[10pt] text-[#1a1a1a] whitespace-pre-wrap">{s.items}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "experience":
        return (
          <div key={id} className="mb-3">
            <SectionHeader />
            <div className="space-y-3">
              {data.experience.map((e, i) => (
                <div key={i} className="flex">
                  <div className="w-[145pt] shrink-0 text-[9.5pt] text-[#555] pr-5 pt-0.5">{e.period}</div>
                  <div className="flex-1">
                    <div className="text-[10pt] font-bold text-[#1a1a1a]">
                      {e.company} <span className="text-[9pt] font-normal text-[#555]">({e.url})</span>
                    </div>
                    <div className="text-[10pt] text-[#1a1a1a]">{e.role}</div>
                    <ul className="mt-1 space-y-0.5">
                      {e.bullets.map((b, bi) => (
                        <li key={bi} className="flex text-[9.5pt] text-[#1a1a1a]">
                          <span className="w-3 shrink-0">•</span>
                          <span className="flex-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "education":
        return (
          <div key={id} className="mb-3">
            <SectionHeader />
            <div className="space-y-3">
              {data.education.map((e, i) => (
                <div key={i} className="flex">
                  <div className="w-[145pt] shrink-0 text-[9.5pt] text-[#555] pr-5 pt-0.5">{e.period}</div>
                  <div className="flex-1">
                    <div className="text-[10pt] font-bold text-[#1a1a1a]">{e.institution}</div>
                    <div className="text-[10pt] text-[#1a1a1a]">{e.degree}</div>
                    {e.bullets?.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {e.bullets.map((b, bi) => (
                          <li key={bi} className="flex text-[9.5pt] text-[#1a1a1a]">
                            <span className="w-3 shrink-0">•</span>
                            <span className="flex-1">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "projects":
        return (
          <div key={id} className="mb-3">
            <SectionHeader />
            <div className="space-y-3">
              {data.projects.map((p, i) => (
                <div key={i} className="flex">
                  <div className="w-[145pt] shrink-0 text-[9.5pt] text-[#555] pr-5 pt-0.5">{p.period}</div>
                  <div className="flex-1">
                    <div className="text-[10pt] font-bold text-[#1a1a1a]">{p.title}</div>
                    {p.url && <div className="text-[9pt] text-[#555] truncate max-w-[250px]">{p.url}</div>}
                    <ul className="mt-1 space-y-0.5">
                      {p.bullets.map((b, bi) => (
                        <li key={bi} className="flex text-[9.5pt] text-[#1a1a1a]">
                          <span className="w-3 shrink-0">•</span>
                          <span className="flex-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "interests":
        return (
          <div key={id} className="mb-3">
            <SectionHeader />
            <p className="text-[9.5pt] leading-[1.6] text-[#1a1a1a] whitespace-pre-wrap">{data.hobbys}</p>
          </div>
        );
      default: return null;
    }
  };

  const name = data.personalFields?.find(f => f.label === "Name")?.value || "Unbekannt";

  return (
    <div className="w-full flex justify-center py-8 px-4 sm:px-0 bg-[#525659] min-h-screen overflow-x-auto">
      <div
        id="lebenslauf-document"
        className="bg-white shadow-lg transition-all flex-shrink-0"
        style={{
          width: "210mm",
          minHeight: "297mm",
          paddingTop: `${data.margins?.top ?? 30}mm`,
          paddingBottom: `${data.margins?.bottom ?? 30}mm`,
          paddingLeft: `${data.margins?.left ?? 25}mm`,
          paddingRight: `${data.margins?.right ?? 20}mm`,
          boxSizing: "border-box",
        }}
      >
        <div className="flex h-full flex-col font-sans text-[#1a1a1a] leading-[1.25]">
          {/* CV Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-[28pt] font-bold tracking-tight text-[#3d3d3d]">Lebenslauf</h1>
            </div>
            {data.photo && (
              <div className="w-[100pt] h-[125pt] border border-[#eee] overflow-hidden">
                <img src={data.photo} alt="Foto" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Sections */}
          <div className="flex-1">
            {activeSections.map(id => renderPreviewSection(id))}
          </div>

          {/* Signature Area */}
          <div className="mt-10">
            <div className="text-[10pt] mb-2">
              {data.signatureCity}, {data.signatureDate}
            </div>
            <div className="mt-4">
              {data.signature ? (
                 <img src={data.signature} alt="Unterschrift" className="h-[60pt] w-[200pt] object-contain" />
              ) : (
                <p className="text-[28pt] font-serif italic text-gray-800 leading-none">
                  {name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
