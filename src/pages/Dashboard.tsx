import { useState } from "react";
import {
  Download,
  FileText,
  Mail,
  Layers,
  Upload,
  Package,
  Loader2,
  X,
  Database,
  Settings,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  defaultLebenslauf,
  defaultAnschreiben,
  defaultDeckblatt,
} from "../data/defaultData";
import type {
  CertificateFile,
  LebenslaufData,
  AnschreibenData,
  DeckblattData,
} from "../data/defaultData";
import PdfUploader from "../components/PdfUploader";
import {
  generateLebenslaufPdf,
  generateLebenslaufBlob,
  generateAnschreibenPdf,
  generateAnschreibenBlob,
  generateDeckblattPdf,
  generateDeckblattBlob,
} from "../utils/generatePdf";
import { mergePdfs, base64ToBlob } from "../utils/mergePdfs";
import { useNavigate } from "react-router-dom";
import { formatFilename } from "../utils/dateUtils";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useLocalStorage<CertificateFile[]>(
    "certificates",
    [],
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [isFirmaModalOpen, setIsFirmaModalOpen] = useState(false);
  const [firmaName, setFirmaName] = useState("");

  const hasLebenslauf = !!localStorage.getItem("lebenslauf");
  const hasAnschreiben = !!localStorage.getItem("anschreiben");
  const hasDeckblatt = !!localStorage.getItem("deckblatt");

  const downloadSingle = async (docId: string) => {
    setLoading(docId);
    try {
      if (docId === "lebenslauf") {
        const data = loadFromStorage<LebenslaufData>(
          "lebenslauf",
          defaultLebenslauf,
        );
        const filename = formatFilename(
          data.personalFields[0].value,
          "Lebenslauf",
        );
        await generateLebenslaufPdf(data, filename);
      } else if (docId === "anschreiben") {
        const data = loadFromStorage<AnschreibenData>(
          "anschreiben",
          defaultAnschreiben,
        );
        const filename = formatFilename(data.senderName, "Anschreiben");
        await generateAnschreibenPdf(data, filename);
      } else if (docId === "deckblatt") {
        const data = loadFromStorage<DeckblattData>(
          "deckblatt",
          defaultDeckblatt,
        );
        const filename = formatFilename(data.name, "Deckblatt");
        await generateDeckblattPdf(data, filename);
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Fehler beim Erstellen der PDF.");
    }
    setLoading(null);
  };

  const handleCombinedClick = () => {
    setIsFirmaModalOpen(true);
  };

  const downloadCombined = async () => {
    setIsFirmaModalOpen(false);
    setLoading("combined");
    try {
      const blobs: Blob[] = [];
      let candidateName = "Bewerbung";
      let position = "Fachinformatiker_AE";

      // Generate each document from stored data
      try {
        const deckData = loadFromStorage<DeckblattData>(
          "deckblatt",
          defaultDeckblatt,
        );
        candidateName = deckData.name;
        position = deckData.position;
        blobs.push(await generateDeckblattBlob(deckData));
      } catch {
        console.warn("Deckblatt generation failed, skipping");
      }

      try {
        const ansData = loadFromStorage<AnschreibenData>(
          "anschreiben",
          defaultAnschreiben,
        );
        if (!candidateName) candidateName = ansData.senderName;
        blobs.push(await generateAnschreibenBlob(ansData));
      } catch {
        console.warn("Anschreiben generation failed, skipping");
      }

      try {
        const lblData = loadFromStorage<LebenslaufData>(
          "lebenslauf",
          defaultLebenslauf,
        );
        if (!candidateName) candidateName = lblData.personalFields[0].value;
        blobs.push(await generateLebenslaufBlob(lblData));
      } catch {
        console.warn("Lebenslauf generation failed, skipping");
      }

      // Add certificates
      for (const cert of certificates) {
        try {
          const blob = await base64ToBlob(cert.data);
          blobs.push(blob);
        } catch {
          console.warn(`Certificate ${cert.name} could not be loaded`);
        }
      }

      if (blobs.length > 0) {
        const filename = formatFilename(
          candidateName,
          `Bewerbung_${position}`,
          firmaName,
        );
        await mergePdfs(blobs, filename);
      } else {
        alert("Keine Dokumente zum Zusammenfügen verfügbar.");
      }
    } catch (err) {
      console.error("Combined PDF failed:", err);
      alert("Fehler beim Erstellen der kombinierten PDF.");
    }
    setLoading(null);
  };

  const exportData = () => {
    const data: Record<string, unknown> = {};
    const keys = [
      "lebenslauf",
      "anschreiben",
      "deckblatt",
      "certificates",
      "lebenslauf-section-order",
      "lebenslauf-deleted-sections",
    ];

    keys.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val) {
        try {
          data[key] = JSON.parse(val);
        } catch {
          data[key] = val;
        }
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bewerbung_Daten_Backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (
          confirm(
            "Möchten Sie alle Daten überschreiben? Dies kann nicht rückgängig gemacht werden.",
          )
        ) {
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
          });
          window.location.reload();
        }
      } catch (err) {
        console.error("Import failed:", err);
        alert(
          "Fehler beim Importieren der Datei. Bitte stellen Sie sicher, dass es eine gültige JSON-Datei ist.",
        );
      }
    };
    reader.readAsText(file);
  };

  const resetToDefault = () => {
    if (
      confirm(
        "Möchten Sie alle Ihre Daten löschen und die Beispiel-Daten wiederherstellen? Dies kann nicht rückgängig gemacht werden!",
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h1>Bewerbung Manager</h1>
        <p>Verwalten Sie Ihre Bewerbungsunterlagen an einem Ort</p>
      </div>

      {/* Document Cards */}
      <div className="dashboard-cards">
        <div className="doc-card" onClick={() => navigate("/deckblatt")}>
          <div className="doc-card-icon deck-icon">
            <Layers size={32} />
          </div>
          <div className="doc-card-info">
            <h3>Deckblatt</h3>
            <p>Titelseite Ihrer Bewerbung</p>
            <span
              className={`doc-status ${hasDeckblatt ? "status-ready" : "status-default"}`}
            >
              {hasDeckblatt ? "✓ Bearbeitet" : "Standard"}
            </span>
          </div>
        </div>

        <div className="doc-card" onClick={() => navigate("/anschreiben")}>
          <div className="doc-card-icon ans-icon">
            <Mail size={32} />
          </div>
          <div className="doc-card-info">
            <h3>Anschreiben</h3>
            <p>Ihr Bewerbungsschreiben</p>
            <span
              className={`doc-status ${hasAnschreiben ? "status-ready" : "status-default"}`}
            >
              {hasAnschreiben ? "✓ Bearbeitet" : "Standard"}
            </span>
          </div>
        </div>

        <div className="doc-card" onClick={() => navigate("/lebenslauf")}>
          <div className="doc-card-icon lbl-icon">
            <FileText size={32} />
          </div>
          <div className="doc-card-info">
            <h3>Lebenslauf</h3>
            <p>Ihr tabellarischer Lebenslauf</p>
            <span
              className={`doc-status ${hasLebenslauf ? "status-ready" : "status-default"}`}
            >
              {hasLebenslauf ? "✓ Bearbeitet" : "Standard"}
            </span>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <Upload size={22} />
          <h2>Zeugnisse & Zertifikate</h2>
        </div>
        <PdfUploader files={certificates} onChange={setCertificates} />
      </div>

      {/* Download Section */}
      <div className="dashboard-section download-section">
        <div className="section-header">
          <Package size={22} />
          <h2>Downloads</h2>
        </div>
        <div className="download-grid">
          <button
            className="download-card"
            onClick={() => downloadSingle("deckblatt")}
            disabled={loading !== null}
          >
            <Layers size={24} />
            <span>Deckblatt</span>
            {loading === "deckblatt" && (
              <Loader2 size={16} className="spinner" />
            )}
          </button>
          <button
            className="download-card"
            onClick={() => downloadSingle("anschreiben")}
            disabled={loading !== null}
          >
            <Mail size={24} />
            <span>Anschreiben</span>
            {loading === "anschreiben" && (
              <Loader2 size={16} className="spinner" />
            )}
          </button>
          <button
            className="download-card"
            onClick={() => downloadSingle("lebenslauf")}
            disabled={loading !== null}
          >
            <FileText size={24} />
            <span>Lebenslauf</span>
            {loading === "lebenslauf" && (
              <Loader2 size={16} className="spinner" />
            )}
          </button>
          <button
            className="download-card download-card-combined"
            onClick={handleCombinedClick}
            disabled={loading !== null}
          >
            <Download size={24} />
            <span>Komplette Bewerbung</span>
            <small>Deckblatt + Anschreiben + Lebenslauf + Zeugnisse</small>
            {loading === "combined" && (
              <Loader2 size={16} className="spinner" />
            )}
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="dashboard-section management-section">
        <div className="section-header">
          <Database size={22} />
          <h2>Daten-Verwaltung</h2>
        </div>
        <div className="management-grid">
          <div className="management-card">
            <div className="management-info">
              <ShieldCheck size={24} className="icon-save" />
              <div>
                <h4>Daten Exportieren</h4>
                <p>Sichern Sie alle Ihre Eingaben in einer JSON-Datei.</p>
              </div>
            </div>
            <button className="management-btn export-btn" onClick={exportData}>
              Backup erstellen
            </button>
          </div>

          <div className="management-card">
            <div className="management-info">
              <Settings size={24} className="icon-load" />
              <div>
                <h4>Daten Importieren</h4>
                <p>Stellen Sie Ihre Daten aus einem Backup wieder her.</p>
              </div>
            </div>
            <label className="management-btn import-btn">
              <span>Backup einspielen</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="management-card card-warning">
            <div className="management-info">
              <Trash2 size={24} className="icon-reset" />
              <div>
                <h4>Alles Zurücksetzen</h4>
                <p>Löscht alle Ihre Daten und lädt Beispiel-Inhalte.</p>
              </div>
            </div>
            <button
              className="management-btn reset-btn"
              onClick={resetToDefault}
            >
              Daten & Vorschau zurücksetzen
            </button>
          </div>
        </div>
      </div>

      {isFirmaModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsFirmaModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Firma Name angeben</h3>
              <button
                className="modal-close"
                onClick={() => setIsFirmaModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p
                style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}
              >
                Bitte geben Sie den Namen der Firma an, für die diese Bewerbung
                bestimmt ist. Der Name wird im Dateinamen der PDF verwendet.
              </p>
              <div className="modal-field">
                <label>Firma Name</label>
                <input
                  type="text"
                  autoFocus
                  value={firmaName}
                  onChange={(e) => setFirmaName(e.target.value)}
                  placeholder="z.B. Google, Siemens, etc."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") downloadCombined();
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-save-btn" onClick={downloadCombined}>
                Kombinierte PDF erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
