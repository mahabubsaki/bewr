import { useEffect, useState } from "react";
import EditableText from "../components/EditableText";
import EditableList from "../components/EditableList";
import PhotoUpload from "../components/PhotoUpload";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultDeckblatt } from "../data/defaultData";
import type { DeckblattData } from "../data/defaultData";
import { Download, Edit3, Eye } from "lucide-react";
import { generateDeckblattPdf } from "../utils/generatePdf";
import MarginControls from "../components/MarginControls";
import { formatFilename } from "../utils/dateUtils";

export default function DeckblattPage() {
  const [data, setData] = useLocalStorage<DeckblattData>(
    "deckblatt",
    defaultDeckblatt,
  );

  // Ensure margins exist (migration for existing data)
  useEffect(() => {
    if (!data.margins) {
      setData((prev: DeckblattData) => ({
        ...prev,
        margins: defaultDeckblatt.margins,
      }));
    }
    if (!data.sectionTitles) {
      setData((prev: DeckblattData) => ({
        ...prev,
        sectionTitles: defaultDeckblatt.sectionTitles,
      }));
    }
  }, [data.margins, data.sectionTitles, setData]);

  const update = (key: keyof DeckblattData, value: unknown) => {
    setData((prev: DeckblattData) => ({ ...prev, [key]: value }));
  };

  const handleDownload = async () => {
    const filename = formatFilename(data.name, "Deckblatt");
    await generateDeckblattPdf(data, filename);
  };

  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Deckblatt</h2>
        <div className="page-header-actions">
          <MarginControls
            margins={data.margins || defaultDeckblatt.margins}
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
        {/* FORM PANEL (Visible on Desktop or Mobile 'edit' mode) */}
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
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Max Mustermann"
            />
          </div>

          <div className="form-field">
            <label>Angestrebte Position</label>
            <input
              type="text"
              value={data.position}
              onChange={(e) => update("position", e.target.value)}
              placeholder="Bewerbung als..."
            />
          </div>

          <div className="form-field">
            <label>Straße & Hausnummer</label>
            <input
              type="text"
              value={data.street}
              onChange={(e) => update("street", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>PLZ & Stadt</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Telefon</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>E-Mail</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Anlagen</label>
            <EditableList
              items={data.anlagen}
              onChange={(v) => update("anlagen", v)}
            />
          </div>
        </div>

        {/* PREVIEW PANEL (Visible on Desktop or Mobile 'preview' mode) */}
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
            id="deckblatt-document"
          >
            <div
              className="a4-page deckblatt-page"
              style={{
                paddingTop: `${data.margins?.top ?? 30}mm`,
                paddingBottom: `${data.margins?.bottom ?? 30}mm`,
                paddingLeft: `${data.margins?.left ?? 25}mm`,
                paddingRight: `${data.margins?.right ?? 20}mm`,
              }}
            >
              {/* Header Section */}
              <div className="deck-header">
                <h1 className="deck-name">{data.name}</h1>
                <h2 className="deck-position">{data.position}</h2>
              </div>

              {/* Photo Section */}
              <div className="deck-photo-section">
                <PhotoUpload
                  photo={data.photo}
                  onPhotoChange={(v) => update("photo", v)}
                  width={220}
                  height={270}
                  label="Foto hochladen"
                  className="deck-photo"
                />
              </div>

              <div className="deck-bottom">
                <div className="deck-contact">
                  <h3>
                    <EditableText
                      value={data.sectionTitles?.contact || "Kontaktdaten:"}
                      onChange={(v) => {
                        const st = { ...(data.sectionTitles || {}) };
                        st.contact = v;
                        update("sectionTitles", st);
                      }}
                    />
                  </h3>
                  <p>{data.street}</p>
                  <p>{data.city}</p>
                  <p className="deck-contact-gap">Telefon: {data.phone}</p>
                  <p>E-Mail: {data.email}</p>
                </div>
                <div className="deck-anlagen">
                  <h3>
                    <EditableText
                      value={data.sectionTitles?.anlagen || "Anlagen:"}
                      onChange={(v) => {
                        const st = { ...(data.sectionTitles || {}) };
                        st.anlagen = v;
                        update("sectionTitles", st);
                      }}
                    />
                  </h3>
                  <div className="preview-list">
                    {data.anlagen.map((item, i) => (
                      <div key={i}>{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
