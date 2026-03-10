import { useEffect, useState } from "react";
import PhotoUpload from "../components/PhotoUpload";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultAnschreiben } from "../data/defaultData";
import type { AnschreibenData } from "../data/defaultData";
import { Download, Zap, X, Calendar, Edit3, Eye } from "lucide-react";
import { generateAnschreibenPdf } from "../utils/generatePdf";
import MarginControls from "../components/MarginControls";
import { getCurrentDateGerman, formatFilename } from "../utils/dateUtils";

export default function AnschreibenPage() {
  const [data, setData] = useLocalStorage<AnschreibenData>(
    "anschreiben",
    defaultAnschreiben,
  );

  // Ensure margins and paragraphs exist/are up to date (migration)
  useEffect(() => {
    let updated = false;
    const newData = { ...data };

    if (!data.margins) {
      newData.margins = defaultAnschreiben.margins;
      updated = true;
    }

    if (!data.paragraphs || data.paragraphs.length < 6) {
      const newParas = [...(data.paragraphs || [])];
      while (newParas.length < 6) {
        newParas.push(defaultAnschreiben.paragraphs[newParas.length]);
      }
      newData.paragraphs = newParas;
      updated = true;
    }

    if (updated) {
      setData(newData);
    }
  }, [data, setData]);

  const update = (key: keyof AnschreibenData, value: unknown) => {
    setData((prev: AnschreibenData) => ({ ...prev, [key]: value }));
  };

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...data.paragraphs];
    newParagraphs[index] = value;
    update("paragraphs", newParagraphs);
  };

  const SECTION_LABELS = [
    "Einleitung (Wie haben Sie diese Ausschreibung gefunden oder wo haben Sie gefunden?)",
    "Warum möchten Sie diese Ausbildung machen?",
    "Warum möchten Sie bei dieser Firma die Ausbildung machen?",
    "Was qualifiziert mich?",
    "Welchen Nutzen habe ich für das Unternehmen?",
    "Abschluss & Motivation",
  ];

  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);

  const handleDownload = async () => {
    const filename = formatFilename(data.senderName, "Anschreiben");
    await generateAnschreibenPdf(data, filename);
  };

  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Anschreiben</h2>
        <div className="page-header-actions">
          <button
            className="quick-edit-btn"
            onClick={() => setIsQuickEditOpen(true)}
            title="Schnell-Bearbeitung für neue Bewerbung"
          >
            <Zap size={16} /> Quick Edit
          </button>
          <MarginControls
            margins={data.margins || defaultAnschreiben.margins}
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
          <div className="form-header">
            <h3>Daten eingeben</h3>
          </div>

          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              value={data.senderName}
              onChange={(e) => update("senderName", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Betreff</label>
            <input
              type="text"
              value={data.subject}
              onChange={(e) => update("subject", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Anrede</label>
            <input
              type="text"
              value={data.salutation}
              onChange={(e) => update("salutation", e.target.value)}
            />
          </div>

          {data.paragraphs.map((para, i) => (
            <div className="form-field" key={i}>
              <label>{SECTION_LABELS[i]}</label>
              <textarea
                value={para}
                onChange={(e) => updateParagraph(i, e.target.value)}
                rows={4}
              />
            </div>
          ))}

          <div className="form-field">
            <label>Grußformel</label>
            <input
              type="text"
              value={data.closing}
              onChange={(e) => update("closing", e.target.value)}
            />
          </div>
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
            id="anschreiben-document"
          >
            <div
              className="a4-page anschreiben-page"
              style={{
                paddingTop: `${data.margins?.top ?? 30}mm`,
                paddingBottom: `${data.margins?.bottom ?? 30}mm`,
                paddingLeft: `${data.margins?.left ?? 25}mm`,
                paddingRight: `${data.margins?.right ?? 20}mm`,
              }}
            >
              {/* Sender Top address (top right) */}
              <div className="ans-sender-top">
                <div className="ans-sender-name">{data.senderName}</div>
                <div>{data.senderStreet}</div>
                <div>{data.senderCity}</div>
              </div>

              <div className="ans-address-row">
                <div className="ans-recipient">
                  <div>{data.recipientCompany}</div>
                  <div>{data.recipientDepartment}</div>
                  <div>{data.recipientStreet}</div>
                  <div>{data.recipientCity}</div>
                </div>

                <div className="ans-sender-bottom">
                  <div className="ans-sender-contact">
                    <span>Telefon: {data.senderPhone}</span>
                  </div>
                  <div className="ans-sender-contact">
                    <span>E-Mail: {data.senderEmail}</span>
                  </div>
                </div>
              </div>

              <div className="ans-date">
                <div className="ans-date-text">{data.date}</div>
              </div>

              <div className="ans-subject">
                <h3>{data.subject}</h3>
              </div>

              <div className="ans-salutation">{data.salutation}</div>

              <div className="ans-body">
                {data.paragraphs.map((para, i) => (
                  <p key={i} className="ans-paragraph">
                    {para}
                  </p>
                ))}
              </div>

              <div className="ans-closing">{data.closing}</div>

              <div className="ans-sender-closing">{data.senderNameClosing}</div>

              <div className="ans-signature">
                {data.signature ? (
                  <PhotoUpload
                    photo={data.signature}
                    onPhotoChange={(v) => update("signature", v)}
                    width={200}
                    height={60}
                    label="Unterschrift hinzufügen"
                  />
                ) : (
                  <div className="lbl-signature-text">
                    {data.senderNameClosing}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isQuickEditOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsQuickEditOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Quick Edit</h3>
              <button
                className="modal-close"
                onClick={() => setIsQuickEditOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-field">
                <label>Firma</label>
                <input
                  type="text"
                  value={data.recipientCompany}
                  onChange={(e) => update("recipientCompany", e.target.value)}
                  placeholder="z.B. Die Firma GmbH"
                />
              </div>
              <div className="modal-field">
                <label>Ansprechpartner / Abteilung</label>
                <input
                  type="text"
                  value={data.recipientDepartment}
                  onChange={(e) => {
                    const val = e.target.value;
                    update("recipientDepartment", val);
                    if (val.includes("Herr")) {
                      const name = val.split("Herr")[1]?.trim();
                      if (name)
                        update("salutation", `Sehr geehrter Herr ${name},`);
                    } else if (val.includes("Frau")) {
                      const name = val.split("Frau")[1]?.trim();
                      if (name)
                        update("salutation", `Sehr geehrte Frau ${name},`);
                    } else if (!val || val.toLowerCase().includes("personal")) {
                      update("salutation", "Sehr geehrte Damen und Herren,");
                    }
                  }}
                  placeholder="z.B. z.H. Herr Müller oder Personalabteilung"
                />
              </div>
              <div className="modal-field">
                <label>Anrede</label>
                <input
                  type="text"
                  value={data.salutation}
                  onChange={(v) => update("salutation", v.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Datum</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={data.date}
                    onChange={(e) => update("date", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    className="sync-btn"
                    onClick={() => update("date", getCurrentDateGerman())}
                    title="Auf heute setzen"
                    style={{ marginTop: 0 }}
                  >
                    <Calendar size={14} /> Heute
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-save-btn"
                onClick={() => setIsQuickEditOpen(false)}
              >
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
