import { useState } from "react";
import EditableText from "../components/EditableText";
import EditableList from "../components/EditableList";
import PhotoUpload from "../components/PhotoUpload";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultLebenslauf } from "../data/defaultData";
import type { LebenslaufData } from "../data/defaultData";
import {
  Download,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Undo2,
  Redo2,
  Trash2,
  Edit3,
  Eye,
} from "lucide-react";
import { generateLebenslaufPdf } from "../utils/generatePdf";
import MarginControls from "../components/MarginControls";
import { getCurrentDateGerman, formatFilename } from "../utils/dateUtils";

type SectionId =
  | "personal"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "interests";

const DEFAULT_SECTION_ORDER: SectionId[] = [
  "personal",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "interests",
];

const SECTION_LABELS: Record<SectionId, string> = {
  personal: "Persönliche Daten",
  about: "Über mich",
  skills: "IT-Kenntnisse",
  projects: "Projekte",
  experience: "Berufserfahrung",
  education: "Ausbildung",
  interests: "Kenntnisse und Interessen",
};

export default function LebenslaufPage() {
  const {
    value: data,
    setValue: setData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<LebenslaufData>("lebenslauf", defaultLebenslauf);
  const [sectionOrder, setSectionOrder] = useLocalStorage<SectionId[]>(
    "lebenslauf-section-order",
    DEFAULT_SECTION_ORDER,
  );
  const [deletedSections, setDeletedSections] = useLocalStorage<SectionId[]>(
    "lebenslauf-deleted-sections",
    [],
  );

  // Migrate old personalData format to new personalFields array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = data as any;
  if (!data.personalFields && raw.personalData) {
    const pd = raw.personalData;
    const fields = [
      { label: "Name", value: pd.name || "" },
      { label: "Geburtsdatum", value: pd.geburtsdatum || "" },
      { label: "Adresse", value: pd.adresse || "" },
      { label: "Telefon", value: pd.telefon || "" },
      { label: "E-Mail", value: pd.email || "" },
      { label: "Portfolio", value: pd.portfolio || "" },
      { label: "Github", value: pd.github || "" },
    ];
    // Also migrate extraPersonal if it exists
    if (raw.extraPersonal) {
      fields.push(...raw.extraPersonal);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const migrated: any = { ...data, personalFields: fields };
    delete migrated.personalData;
    delete migrated.extraPersonal;
    setData(migrated as LebenslaufData);
  }

  // Ensure margins exist (migration for existing data)
  if (!data.margins) {
    setData((prev: LebenslaufData) => ({
      ...prev,
      margins: defaultLebenslauf.margins,
    }));
  }

  // Ensure sectionTitles exist
  if (!data.sectionTitles) {
    setData((prev: LebenslaufData) => ({
      ...prev,
      sectionTitles: defaultLebenslauf.sectionTitles,
    }));
  }

  const update = (path: string, value: unknown) => {
    setData((prev: LebenslaufData) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = newData;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleDownload = async () => {
    const name =
      data.personalFields?.find((f) => f.label === "Name")?.value ||
      "Mahabub Hossen Saki";
    const filename = formatFilename(name, "Lebenslauf");
    await generateLebenslaufPdf(data, filename);
  };

  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  // Get the name from personalFields for signature
  const nameField = data.personalFields?.find((f) => f.label === "Name");
  const fullName = nameField?.value || "Mahabub Hossen Saki";

  // --- Section reorder/delete ---
  const activeSections = sectionOrder.filter(
    (id) => !deletedSections.includes(id),
  );

  const moveSection = (id: SectionId, dir: "up" | "down") => {
    const idx = sectionOrder.indexOf(id);
    if (idx < 0) return;
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sectionOrder.length) return;
    const o = [...sectionOrder];
    [o[idx], o[newIdx]] = [o[newIdx], o[idx]];
    setSectionOrder(o);
  };

  const deleteSection = (id: SectionId) => {
    setDeletedSections([...deletedSections, id]);
  };

  const restoreSection = (id: SectionId) => {
    setDeletedSections(deletedSections.filter((s) => s !== id));
  };

  // --- Remove helpers ---
  const moveInArray = (key: string, i: number, dir: "up" | "down") => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr = [...(data as any)[key]];
    const ni = dir === "up" ? i - 1 : i + 1;
    if (ni < 0 || ni >= arr.length) return;
    [arr[i], arr[ni]] = [arr[ni], arr[i]];
    update(key, arr);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const insertIntoArray = (key: string, i: number, newItem: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr = [...(data as any)[key]];
    arr.splice(i, 0, newItem);
    update(key, arr);
  };

  const removeFromArray = (key: string, i: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr = [...(data as any)[key]];
    arr.splice(i, 1);
    update(key, arr);
  };

  // --- Section Title with reorder + delete ---
  const SectionTitle = ({ id, title }: { id: SectionId; title: string }) => {
    const idx = activeSections.indexOf(id);
    const displayTitle = data.sectionTitles?.[id] || title;

    return (
      <div className="lbl-section-title-row">
        <h2 className="lbl-section-title">
          <EditableText
            value={displayTitle}
            onChange={(v) => {
              const st = { ...(data.sectionTitles || {}) };
              st[id] = v;
              update("sectionTitles", st);
            }}
          />
        </h2>
        <div className="section-reorder-btns no-print">
          <button
            onClick={() => moveSection(id, "up")}
            disabled={idx <= 0}
            title="Nach oben"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={() => moveSection(id, "down")}
            disabled={idx >= activeSections.length - 1}
            title="Nach unten"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={() => deleteSection(id)}
            title="Abschnitt entfernen"
            className="section-delete-btn"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    );
  };

  // --- Section renderers ---
  const renderPersonal = () => (
    <div className="lbl-section" key="personal">
      <SectionTitle id="personal" title="Persönliche Daten" />
      <div className="lbl-section-content">
        <table className="lbl-table">
          <tbody>
            {(data.personalFields || []).map((field, i) => (
              <tr key={i} className="removable-row">
                <td className="row-insert-cell no-print">
                  <button
                    className="insert-btn"
                    onClick={() =>
                      insertIntoArray("personalFields", i, {
                        label: "Neues Feld",
                        value: "Wert",
                      })
                    }
                    title="Hier einfügen"
                  >
                    <Plus size={10} />
                  </button>
                </td>
                <td className="lbl-label">
                  <EditableText
                    value={field.label}
                    onChange={(v) => {
                      const f = [...data.personalFields];
                      f[i] = { ...f[i], label: v };
                      update("personalFields", f);
                    }}
                  />
                </td>
                <td>
                  <EditableText
                    value={field.value}
                    onChange={(v) => {
                      const f = [...data.personalFields];
                      f[i] = { ...f[i], value: v };
                      update("personalFields", f);
                    }}
                  />
                  <div className="row-actions no-print">
                    <button
                      className="reorder-btn"
                      onClick={() => moveInArray("personalFields", i, "up")}
                      disabled={i === 0}
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      className="reorder-btn"
                      onClick={() => moveInArray("personalFields", i, "down")}
                      disabled={i === data.personalFields.length - 1}
                    >
                      <ChevronDown size={12} />
                    </button>
                    <button
                      className="row-remove-btn"
                      onClick={() => removeFromArray("personalFields", i)}
                      title="Entfernen"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="add-row-btn no-print"
          onClick={() => {
            setData((p: LebenslaufData) => ({
              ...p,
              personalFields: [
                ...(p.personalFields || []),
                { label: "Neues Feld", value: "Wert eingeben" },
              ],
            }));
          }}
        >
          <Plus size={12} /> Am Ende hinzufügen
        </button>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="lbl-section" key="about">
      <SectionTitle id="about" title="Über mich" />
      <div className="lbl-section-content">
        <EditableText
          value={data.aboutMe}
          onChange={(v) => update("aboutMe", v)}
          tag="p"
          multiline
          className="lbl-about"
        />
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="lbl-section" key="skills">
      <SectionTitle id="skills" title="IT-Kenntnisse" />
      <div className="lbl-section-content">
        <table className="lbl-table">
          <tbody>
            {data.skills.map((skill, i) => (
              <tr key={i} className="removable-row">
                <td className="row-insert-cell no-print">
                  <button
                    className="insert-btn"
                    onClick={() =>
                      insertIntoArray("skills", i, {
                        category: "Neue Kategorie",
                        items: "Fähigkeiten",
                      })
                    }
                    title="Hier einfügen"
                  >
                    <Plus size={10} />
                  </button>
                </td>
                <td className="lbl-label">
                  <EditableText
                    value={skill.category}
                    onChange={(v) => {
                      const s = [...data.skills];
                      s[i] = { ...s[i], category: v };
                      update("skills", s);
                    }}
                  />
                </td>
                <td>
                  <EditableText
                    value={skill.items}
                    onChange={(v) => {
                      const s = [...data.skills];
                      s[i] = { ...s[i], items: v };
                      update("skills", s);
                    }}
                  />
                  <div className="row-actions no-print">
                    <button
                      className="reorder-btn"
                      onClick={() => moveInArray("skills", i, "up")}
                      disabled={i === 0}
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      className="reorder-btn"
                      onClick={() => moveInArray("skills", i, "down")}
                      disabled={i === data.skills.length - 1}
                    >
                      <ChevronDown size={12} />
                    </button>
                    <button
                      className="row-remove-btn"
                      onClick={() => removeFromArray("skills", i)}
                      title="Entfernen"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="add-row-btn no-print"
          onClick={() => {
            setData((p: LebenslaufData) => ({
              ...p,
              skills: [
                ...p.skills,
                { category: "Neue Kategorie", items: "Fähigkeiten" },
              ],
            }));
          }}
        >
          <Plus size={12} /> Am Ende hinzufügen
        </button>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="lbl-section" key="projects">
      <SectionTitle id="projects" title="Projekte" />
      <div className="lbl-section-content">
        {data.projects.map((p, i) => (
          <div key={i} className="lbl-entry removable-row">
            <div className="entry-insert-btn no-print">
              <button
                className="insert-btn"
                onClick={() =>
                  insertIntoArray("projects", i, {
                    period: "MM/JJJJ – MM/JJJJ",
                    title: "Neues Projekt",
                    url: "https://...",
                    bullets: ["Beschreibung"],
                  })
                }
                title="Hier einfügen"
              >
                <Plus size={12} />
              </button>
            </div>
            <div className="lbl-entry-header">
              <span className="lbl-entry-period">
                <EditableText
                  value={p.period}
                  onChange={(v) => {
                    const a = [...data.projects];
                    a[i] = { ...a[i], period: v };
                    update("projects", a);
                  }}
                />
              </span>
              <div className="lbl-entry-details">
                <strong>
                  <EditableText
                    value={p.title}
                    onChange={(v) => {
                      const a = [...data.projects];
                      a[i] = { ...a[i], title: v };
                      update("projects", a);
                    }}
                  />
                </strong>
                <br />
                <EditableText
                  value={p.url}
                  onChange={(v) => {
                    const a = [...data.projects];
                    a[i] = { ...a[i], url: v };
                    update("projects", a);
                  }}
                  className="lbl-url"
                />
                <EditableList
                  items={p.bullets}
                  onChange={(v) => {
                    const a = [...data.projects];
                    a[i] = { ...a[i], bullets: v };
                    update("projects", a);
                  }}
                />
              </div>
            </div>
            <div className="row-actions no-print entry-actions">
              <button
                className="reorder-btn"
                onClick={() => moveInArray("projects", i, "up")}
                disabled={i === 0}
              >
                <ChevronUp size={14} />
              </button>
              <button
                className="reorder-btn"
                onClick={() => moveInArray("projects", i, "down")}
                disabled={i === data.projects.length - 1}
              >
                <ChevronDown size={14} />
              </button>
              <button
                className="row-remove-btn"
                onClick={() => removeFromArray("projects", i)}
                title="Entfernen"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        <button
          className="add-row-btn no-print"
          onClick={() => {
            setData((p: LebenslaufData) => ({
              ...p,
              projects: [
                ...p.projects,
                {
                  period: "MM/JJJJ – MM/JJJJ",
                  title: "Neues Projekt",
                  url: "https://...",
                  bullets: ["Beschreibung"],
                },
              ],
            }));
          }}
        >
          <Plus size={12} /> Projekt am Ende hinzufügen
        </button>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="lbl-section" key="experience">
      <SectionTitle id="experience" title="Berufserfahrung" />
      <div className="lbl-section-content">
        {data.experience.map((e, i) => (
          <div key={i} className="lbl-entry removable-row">
            <div className="entry-insert-btn no-print">
              <button
                className="insert-btn"
                onClick={() =>
                  insertIntoArray("experience", i, {
                    period: "MM/JJJJ – MM/JJJJ",
                    company: "Neue Firma",
                    url: "https://...",
                    role: "Position",
                    bullets: ["Aufgabenbeschreibung"],
                  })
                }
                title="Hier einfügen"
              >
                <Plus size={12} />
              </button>
            </div>
            <div className="lbl-entry-header">
              <span className="lbl-entry-period">
                <EditableText
                  value={e.period}
                  onChange={(v) => {
                    const a = [...data.experience];
                    a[i] = { ...a[i], period: v };
                    update("experience", a);
                  }}
                />
              </span>
              <div className="lbl-entry-details">
                <strong>
                  <EditableText
                    value={e.company}
                    onChange={(v) => {
                      const a = [...data.experience];
                      a[i] = { ...a[i], company: v };
                      update("experience", a);
                    }}
                  />
                </strong>{" "}
                <span>
                  (
                  <EditableText
                    value={e.url}
                    onChange={(v) => {
                      const a = [...data.experience];
                      a[i] = { ...a[i], url: v };
                      update("experience", a);
                    }}
                  />
                  )
                </span>
                <br />
                <EditableText
                  value={e.role}
                  onChange={(v) => {
                    const a = [...data.experience];
                    a[i] = { ...a[i], role: v };
                    update("experience", a);
                  }}
                />
                <EditableList
                  items={e.bullets}
                  onChange={(v) => {
                    const a = [...data.experience];
                    a[i] = { ...a[i], bullets: v };
                    update("experience", a);
                  }}
                />
              </div>
            </div>
            <div className="row-actions no-print entry-actions">
              <button
                className="reorder-btn"
                onClick={() => moveInArray("experience", i, "up")}
                disabled={i === 0}
              >
                <ChevronUp size={14} />
              </button>
              <button
                className="reorder-btn"
                onClick={() => moveInArray("experience", i, "down")}
                disabled={i === data.experience.length - 1}
              >
                <ChevronDown size={14} />
              </button>
              <button
                className="row-remove-btn"
                onClick={() => removeFromArray("experience", i)}
                title="Entfernen"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        <button
          className="add-row-btn no-print"
          onClick={() => {
            setData((p: LebenslaufData) => ({
              ...p,
              experience: [
                ...p.experience,
                {
                  period: "MM/JJJJ – MM/JJJJ",
                  company: "Neue Firma",
                  url: "https://...",
                  role: "Position",
                  bullets: ["Aufgabenbeschreibung"],
                },
              ],
            }));
          }}
        >
          <Plus size={12} /> Berufserfahrung am Ende hinzufügen
        </button>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="lbl-section" key="education">
      <SectionTitle id="education" title="Ausbildung" />
      <div className="lbl-section-content">
        {data.education.map((e, i) => (
          <div key={i} className="lbl-entry removable-row">
            <div className="entry-insert-btn no-print">
              <button
                className="insert-btn"
                onClick={() =>
                  insertIntoArray("education", i, {
                    period: "MM/JJJJ – MM/JJJJ",
                    institution: "Neue Institution",
                    degree: "Abschluss",
                    bullets: ["Details"],
                  })
                }
                title="Hier einfügen"
              >
                <Plus size={12} />
              </button>
            </div>
            <div className="lbl-entry-header">
              <span className="lbl-entry-period">
                <EditableText
                  value={e.period}
                  onChange={(v) => {
                    const a = [...data.education];
                    a[i] = { ...a[i], period: v };
                    update("education", a);
                  }}
                />
              </span>
              <div className="lbl-entry-details">
                <strong>
                  <EditableText
                    value={e.institution}
                    onChange={(v) => {
                      const a = [...data.education];
                      a[i] = { ...a[i], institution: v };
                      update("education", a);
                    }}
                  />
                </strong>
                <br />
                <EditableText
                  value={e.degree}
                  onChange={(v) => {
                    const a = [...data.education];
                    a[i] = { ...a[i], degree: v };
                    update("education", a);
                  }}
                />
                <EditableList
                  items={e.bullets}
                  onChange={(v) => {
                    const a = [...data.education];
                    a[i] = { ...a[i], bullets: v };
                    update("education", a);
                  }}
                />
              </div>
            </div>
            <div className="row-actions no-print entry-actions">
              <button
                className="reorder-btn"
                onClick={() => moveInArray("education", i, "up")}
                disabled={i === 0}
              >
                <ChevronUp size={14} />
              </button>
              <button
                className="reorder-btn"
                onClick={() => moveInArray("education", i, "down")}
                disabled={i === data.education.length - 1}
              >
                <ChevronDown size={14} />
              </button>
              <button
                className="row-remove-btn"
                onClick={() => removeFromArray("education", i)}
                title="Entfernen"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        <button
          className="add-row-btn no-print"
          onClick={() => {
            setData((p: LebenslaufData) => ({
              ...p,
              education: [
                ...p.education,
                {
                  period: "MM/JJJJ – MM/JJJJ",
                  institution: "Neue Institution",
                  degree: "Abschluss",
                  bullets: ["Details"],
                },
              ],
            }));
          }}
        >
          <Plus size={12} /> Ausbildung am Ende hinzufügen
        </button>
      </div>
    </div>
  );

  const renderInterests = () => (
    <div className="lbl-section" key="interests">
      <SectionTitle id="interests" title="Kenntnisse und Interessen" />
      <div className="lbl-section-content">
        <table className="lbl-table">
          <tbody>
            <tr>
              <td className="lbl-label">
                <EditableText
                  value={data.languagesLabel || "Fremdsprachen"}
                  onChange={(v) => update("languagesLabel", v)}
                />
              </td>
              <td>
                {data.languages.map((lang, i) => (
                  <div key={i} className="removable-row">
                    <EditableText
                      value={`${lang.name} (${lang.level})`}
                      onChange={(v) => {
                        const match = v.match(/^(.+?)\s*\((.+?)\)$/);
                        const l = [...data.languages];
                        if (match) l[i] = { name: match[1], level: match[2] };
                        else l[i] = { name: v, level: "" };
                        update("languages", l);
                      }}
                    />
                    <button
                      className="row-remove-btn no-print"
                      onClick={() => removeFromArray("languages", i)}
                      title="Entfernen"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button
                  className="add-row-btn no-print"
                  onClick={() => {
                    setData((p: LebenslaufData) => ({
                      ...p,
                      languages: [
                        ...p.languages,
                        { name: "Neue Sprache", level: "Niveau" },
                      ],
                    }));
                  }}
                  style={{ marginTop: 2 }}
                >
                  <Plus size={12} /> Sprache hinzufügen
                </button>
              </td>
            </tr>
            <tr>
              <td className="lbl-label">Hobbys</td>
              <td>
                <EditableText
                  value={data.hobbys}
                  onChange={(v) => update("hobbys", v)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const sectionMap: Record<SectionId, () => React.ReactNode> = {
    personal: renderPersonal,
    about: renderAbout,
    skills: renderSkills,
    projects: renderProjects,
    experience: renderExperience,
    education: renderEducation,
    interests: renderInterests,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Lebenslauf</h2>
        <div className="page-header-actions">
          <div className="undo-redo-btns no-print">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Rückgängig (Strg+Z)"
            >
              <Undo2 size={18} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Wiederholen (Strg+Y)"
            >
              <Redo2 size={18} />
            </button>
          </div>
          <MarginControls
            margins={data.margins}
            onChange={(m) => update("margins", m)}
          />
          <button className="download-btn" onClick={handleDownload}>
            <Download size={18} /> PDF herunterladen
          </button>
        </div>
      </div>

      <div className="mobile-view-toggle">
        <button
          className={`view-toggle-btn ${viewMode === "edit" ? "active" : ""}`}
          onClick={() => setViewMode("edit")}
        >
          <Edit3 size={18} /> Bearbeiten
        </button>
        <button
          className={`view-toggle-btn ${viewMode === "preview" ? "active" : ""}`}
          onClick={() => setViewMode("preview")}
        >
          <Eye size={18} /> Vorschau
        </button>
      </div>

      <div className="editor-split-layout">
        <div
          className="form-panel"
          style={{
            display:
              viewMode === "edit" || window.innerWidth > 768 ? "block" : "none",
          }}
        >
          {/* PERSONAL DATA */}
          <div className="form-header">
            <h3>Persönliche Daten</h3>
          </div>
          {data.personalFields.map((field, i) => (
            <div className="form-field" key={i}>
              <label>{field.label}</label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => {
                  const newFields = [...data.personalFields];
                  newFields[i].value = e.target.value;
                  update("personalFields", newFields);
                }}
              />
            </div>
          ))}

          <div className="form-field">
            <label>Unterschrift Ort</label>
            <input
              type="text"
              value={data.signatureCity}
              onChange={(e) => update("signatureCity", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Unterschrift Datum</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={data.signatureDate}
                onChange={(e) => update("signatureDate", e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                className="sync-btn"
                onClick={() => update("signatureDate", getCurrentDateGerman())}
              >
                Heute
              </button>
            </div>
          </div>

          {/* DYNAMIC SECTIONS */}
          {activeSections.map((id) => {
            if (id === "personal") return null;

            return (
              <div key={id} className="form-section-edit">
                <div className="form-header">
                  <h3>{SECTION_LABELS[id]}</h3>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => moveSection(id, "up")}>
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => moveSection(id, "down")}>
                      <ChevronDown size={16} />
                    </button>
                    <button onClick={() => deleteSection(id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {id === "about" && (
                  <div className="form-field">
                    <textarea
                      value={data.aboutMe}
                      onChange={(e) => update("aboutMe", e.target.value)}
                      rows={5}
                    />
                  </div>
                )}

                {id === "skills" &&
                  data.skills.map((s, i) => (
                    <div key={i} className="form-item-edit">
                      <div className="form-field">
                        <label>Kategorie</label>
                        <input
                          type="text"
                          value={s.category}
                          onChange={(e) => {
                            const a = [...data.skills];
                            a[i] = { ...a[i], category: e.target.value };
                            update("skills", a);
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label>Kenntnisse</label>
                        <textarea
                          value={s.items}
                          onChange={(e) => {
                            const a = [...data.skills];
                            a[i] = { ...a[i], items: e.target.value };
                            update("skills", a);
                          }}
                        />
                      </div>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromArray("skills", i)}
                      >
                        Löschen
                      </button>
                    </div>
                  ))}

                {id === "experience" &&
                  data.experience.map((exp, i) => (
                    <div key={i} className="form-item-edit">
                      <div className="form-field">
                        <label>Zeitraum</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => {
                            const a = [...data.experience];
                            a[i] = { ...a[i], period: e.target.value };
                            update("experience", a);
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label>Firma</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const a = [...data.experience];
                            a[i] = { ...a[i], company: e.target.value };
                            update("experience", a);
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label>Position</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const a = [...data.experience];
                            a[i] = { ...a[i], role: e.target.value };
                            update("experience", a);
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label>Details</label>
                        <EditableList
                          items={exp.bullets}
                          onChange={(v) => {
                            const a = [...data.experience];
                            a[i] = { ...a[i], bullets: v };
                            update("experience", a);
                          }}
                        />
                      </div>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromArray("experience", i)}
                      >
                        Löschen
                      </button>
                    </div>
                  ))}

                {id === "education" &&
                  data.education.map((ed, i) => (
                    <div key={i} className="form-item-edit">
                      <div className="form-field">
                        <label>Zeitraum</label>
                        <input
                          type="text"
                          value={ed.period}
                          onChange={(e) => {
                            const a = [...data.education];
                            a[i] = { ...a[i], period: e.target.value };
                            update("education", a);
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label>Institution</label>
                        <input
                          type="text"
                          value={ed.institution}
                          onChange={(e) => {
                            const a = [...data.education];
                            a[i] = { ...a[i], institution: e.target.value };
                            update("education", a);
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label>Abschluss</label>
                        <input
                          type="text"
                          value={ed.degree}
                          onChange={(e) => {
                            const a = [...data.education];
                            a[i] = { ...a[i], degree: e.target.value };
                            update("education", a);
                          }}
                        />
                      </div>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromArray("education", i)}
                      >
                        Löschen
                      </button>
                    </div>
                  ))}

                {id === "projects" &&
                  data.projects.map((p, i) => (
                    <div key={i} className="form-item-edit">
                      <div className="form-field">
                        <label>Zeitraum</label>
                        <input
                          type="text"
                          value={p.period}
                          onChange={(e) => {
                            const a = [...data.projects];
                            a[i] = { ...a[i], period: e.target.value };
                            update("projects", a);
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label>Projektname</label>
                        <input
                          type="text"
                          value={p.title}
                          onChange={(e) => {
                            const a = [...data.projects];
                            a[i] = { ...a[i], title: e.target.value };
                            update("projects", a);
                          }}
                        />
                      </div>
                      <div className="form-field">
                        <label>Details</label>
                        <EditableList
                          items={p.bullets}
                          onChange={(v) => {
                            const a = [...data.projects];
                            a[i] = { ...a[i], bullets: v };
                            update("projects", a);
                          }}
                        />
                      </div>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromArray("projects", i)}
                      >
                        Löschen
                      </button>
                    </div>
                  ))}

                {id === "interests" && (
                  <div className="form-field">
                    <textarea
                      value={data.hobbys}
                      onChange={(e) => update("hobbys", e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                {/* ADD BUTTONS per section */}
                {id !== "about" && id !== "interests" && (
                  <button
                    className="add-item-btn"
                    onClick={() => {
                      if (id === "skills")
                        insertIntoArray("skills", data.skills.length, {
                          category: "Neue Kategorie",
                          items: "Kenntnisse",
                        });
                      if (id === "experience")
                        insertIntoArray("experience", data.experience.length, {
                          period: "MM/YYYY - MM/YYYY",
                          company: "Firma",
                          url: "",
                          role: "Position",
                          bullets: [],
                        });
                      if (id === "education")
                        insertIntoArray("education", data.education.length, {
                          period: "MM/YYYY - MM/YYYY",
                          institution: "Institution",
                          degree: "Abschluss",
                          bullets: [],
                        });
                      if (id === "projects")
                        insertIntoArray("projects", data.projects.length, {
                          period: "MM/YYYY - MM/YYYY",
                          title: "Projekt",
                          url: "",
                          bullets: [],
                        });
                    }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(74, 108, 247, 0.05)",
                      color: "var(--accent)",
                      border: "1px dashed var(--accent)",
                      borderRadius: "8px",
                      marginTop: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <Plus size={16} /> Eintrag hinzufügen
                  </button>
                )}
              </div>
            );
          })}

          {deletedSections.length > 0 && (
            <div className="restore-sections-container">
              <span className="restore-title">Bereiche hinzufügen:</span>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {deletedSections.map((id) => (
                  <button
                    key={id}
                    className="restore-btn"
                    onClick={() => restoreSection(id)}
                    style={{
                      padding: "6px 12px",
                      background: "white",
                      border: "1px solid var(--border)",
                      borderRadius: "20px",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {SECTION_LABELS[id]} <Plus size={12} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="preview-panel"
          style={{
            display:
              viewMode === "preview" || window.innerWidth > 768
                ? "block"
                : "none",
          }}
        >
          <div
            className={`document-wrapper ${viewMode === "preview" ? "preview-mode-active" : ""}`}
            id="lebenslauf-document"
          >
            <div
              className="a4-page lebenslauf-page"
              style={{
                paddingTop: `${data.margins?.top ?? 70}mm`,
                paddingBottom: `${data.margins?.bottom ?? 60}mm`,
                paddingLeft: `${data.margins?.left ?? 70}mm`,
                paddingRight: `${data.margins?.right ?? 70}mm`,
              }}
            >
              <div className="lbl-header">
                <h1 className="lbl-title">Lebenslauf</h1>
                <PhotoUpload
                  photo={data.photo}
                  onPhotoChange={(v) => update("photo", v)}
                  width={130}
                  height={160}
                  className="lbl-photo"
                />
              </div>

              {activeSections.map((id) => sectionMap[id]?.())}

              <div className="lbl-signature">
                <p className="lbl-sig-location">
                  {data.signatureCity}, den {data.signatureDate}
                </p>
                <div className="lbl-sig-image">
                  {data.signature ? (
                    <PhotoUpload
                      photo={data.signature}
                      onPhotoChange={(v) => update("signature", v)}
                      width={250}
                      height={80}
                      label="Unterschrift"
                    />
                  ) : (
                    <div className="lbl-signature-text">{fullName}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
