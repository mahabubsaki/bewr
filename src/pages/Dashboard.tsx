import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCertificatesDB } from "../hooks/useCertificatesDB";
import {
  defaultLebenslauf,
  defaultAnschreiben,
  defaultDeckblatt,
} from "../data/defaultData";
import type {
  LebenslaufData,
  AnschreibenData,
  DeckblattData,
} from "../data/defaultData";
import {
  generateLebenslaufPdf,
  generateLebenslaufBlob,
  generateAnschreibenPdf,
  generateAnschreibenBlob,
  generateDeckblattPdf,
  generateDeckblattBlob,
} from "../utils/generatePdf";
import { mergePdfs, base64ToBlob } from "../utils/mergePdfs";
import { formatDocFilename, formatFullFilename } from "../utils/dateUtils";
import { useActiveVariationId } from "../hooks/useActiveVariationId";
import {
  ACTIVE_VARIATION_STORAGE_KEY,
  VARIATION_MIGRATION_FLAG,
  VARIATIONS_STORAGE_KEY,
  ensureVariationSystem,
  getVariationStorageKey,
} from "../lib/variationManager";
import {
  DEFAULT_EDITOR_FONT_SETTINGS,
  type EditorFontSettings,
} from "../lib/fontConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import DashboardHero from "../components/dashboard/DashboardHero";
import DocumentCards from "../components/dashboard/DocumentCards";
import DashboardPanels from "../components/dashboard/DashboardPanels";
import VariationManager from "../components/dashboard/VariationManager";

function loadFromStorage<T>(variationId: string, key: string, fallback: T): T {
  try {
    const scopedKey = getVariationStorageKey(key, variationId);
    const stored = localStorage.getItem(scopedKey);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const activeVariationId = useActiveVariationId();
  const { certificates, addCertificates, removeCertificate, clearCertificates } = useCertificatesDB();
  const [loading, setLoading] = useState<string | null>(null);
  const [isFirmaModalOpen, setIsFirmaModalOpen] = useState(false);
  const [firmaName, setFirmaName] = useState("");
  const [pendingDownload, setPendingDownload] = useState<string | null>(null);

  useEffect(() => {
    ensureVariationSystem();
  }, []);

  const hasLebenslauf  = !!localStorage.getItem(getVariationStorageKey("lebenslauf", activeVariationId));
  const hasAnschreiben = !!localStorage.getItem(getVariationStorageKey("anschreiben", activeVariationId));
  const hasDeckblatt   = !!localStorage.getItem(getVariationStorageKey("deckblatt", activeVariationId));

  const openDownloadModal = (docId: string) => {
    setPendingDownload(docId);
    setFirmaName("");
    setIsFirmaModalOpen(true);
  };

  const executeSingleDownload = async (docId: string, company: string) => {
    setLoading(docId);
    try {
      const fontSettings = loadFromStorage<EditorFontSettings>(
        activeVariationId,
        "editor-font-settings",
        DEFAULT_EDITOR_FONT_SETTINGS,
      );

      if (docId === "lebenslauf") {
        const data = loadFromStorage<LebenslaufData>(activeVariationId, "lebenslauf", defaultLebenslauf);
        await generateLebenslaufPdf(data, formatDocFilename(data.personalInfo.name, "Lebenslauf", company), undefined, fontSettings.fontId);
      } else if (docId === "anschreiben") {
        const data = loadFromStorage<AnschreibenData>(activeVariationId, "anschreiben", defaultAnschreiben);
        await generateAnschreibenPdf(data, formatDocFilename(data.sender.name, "Anschreiben", company), fontSettings.fontId);
      } else if (docId === "deckblatt") {
        const data = loadFromStorage<DeckblattData>(activeVariationId, "deckblatt", defaultDeckblatt);
        await generateDeckblattPdf(data, formatDocFilename(data.personal.name, "Deckblatt", company), fontSettings.fontId);
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Fehler beim Erstellen der PDF.");
    }
    setLoading(null);
  };

  const handleModalConfirm = async () => {
    const company = firmaName;
    const docId   = pendingDownload;
    setIsFirmaModalOpen(false);
    setPendingDownload(null);
    if (docId === "combined") {
      await runCombinedDownload(company);
    } else if (docId) {
      await executeSingleDownload(docId, company);
    }
  };

  const runCombinedDownload = async (company: string) => {
    setLoading("combined");
    try {
      const fontSettings = loadFromStorage<EditorFontSettings>(
        activeVariationId,
        "editor-font-settings",
        DEFAULT_EDITOR_FONT_SETTINGS,
      );
      const blobs: Blob[] = [];
      let candidateName = "Bewerbung";

      try {
        const d = loadFromStorage<DeckblattData>(activeVariationId, "deckblatt", defaultDeckblatt);
        candidateName = d.personal.name;
        blobs.push(await generateDeckblattBlob(d, fontSettings.fontId));
      } catch { console.warn("Deckblatt skipped"); }

      try {
        const d = loadFromStorage<AnschreibenData>(activeVariationId, "anschreiben", defaultAnschreiben);
        if (!candidateName) candidateName = d.sender.name;
        blobs.push(await generateAnschreibenBlob(d, fontSettings.fontId));
      } catch { console.warn("Anschreiben skipped"); }

      try {
        const d = loadFromStorage<LebenslaufData>(activeVariationId, "lebenslauf", defaultLebenslauf);
        if (!candidateName) candidateName = d.personalInfo.name;
        const DEFAULT_SECTIONS = ["personal","about","skills","projects","experience","education","interests"];
        const sectionOrderKey = getVariationStorageKey("lebenslauf-section-order", activeVariationId);
        const deletedKey = getVariationStorageKey("lebenslauf-deleted-sections", activeVariationId);
        const sectionOrder: string[] = JSON.parse(localStorage.getItem(sectionOrderKey) || "null") || DEFAULT_SECTIONS;
        const deleted: string[] = JSON.parse(localStorage.getItem(deletedKey) || "[]");
        blobs.push(await generateLebenslaufBlob(d, sectionOrder.filter((id) => !deleted.includes(id)), fontSettings.fontId));
      } catch { console.warn("Lebenslauf skipped"); }

      for (const cert of certificates) {
        try { blobs.push(await base64ToBlob(cert.data)); } catch { console.warn(`Cert ${cert.name} skipped`); }
      }

      if (blobs.length > 0) {
        await mergePdfs(blobs, formatFullFilename(candidateName, company));
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
    const rootKeys = [
      VARIATIONS_STORAGE_KEY,
      ACTIVE_VARIATION_STORAGE_KEY,
      VARIATION_MIGRATION_FLAG,
    ];

    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key) continue;

      const include = rootKeys.includes(key) || key.startsWith("variation:");
      if (!include) continue;

      const val = localStorage.getItem(key);
      if (!val) continue;
      try {
        data[key] = JSON.parse(val);
      } catch {
        data[key] = val;
      }
    }

    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `Bewerbung_Daten_Backup_${new Date().toISOString().split("T")[0]}.json` });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (confirm("Möchten Sie alle Daten überschreiben? Dies kann nicht rückgängig gemacht werden.")) {
          localStorage.clear();
          Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
          ensureVariationSystem();
          window.location.reload();
        }
      } catch { alert("Fehler beim Importieren der Datei. Bitte stellen Sie sicher, dass es eine gültige JSON-Datei ist."); }
    };
    reader.readAsText(file);
  };

  const resetToDefault = () => {
    if (confirm("Möchten Sie alle Ihre Daten löschen und die Beispiel-Daten wiederherstellen? Dies kann nicht rückgängig gemacht werden!")) {
      clearCertificates();
      localStorage.clear();
      window.location.reload();
    }
  };

  // suppress unused navigate warning — used inside DocumentCards via prop-drilling
  void navigate;

  return (
    <motion.div
      className="min-h-screen mesh-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">

        <VariationManager />

        <DashboardHero
          hasDeckblatt={hasDeckblatt}
          hasAnschreiben={hasAnschreiben}
          hasLebenslauf={hasLebenslauf}
        />

        <DocumentCards
          hasDeckblatt={hasDeckblatt}
          hasAnschreiben={hasAnschreiben}
          hasLebenslauf={hasLebenslauf}
          loading={loading}
          openDownloadModal={openDownloadModal}
        />

        <DashboardPanels
          hasDeckblatt={hasDeckblatt}
          hasAnschreiben={hasAnschreiben}
          hasLebenslauf={hasLebenslauf}
          loading={loading}
          certificates={certificates}
          addCertificates={addCertificates}
          removeCertificate={removeCertificate}
          openDownloadModal={openDownloadModal}
          exportData={exportData}
          importData={importData}
          resetToDefault={resetToDefault}
        />
      </div>

      {/* ── Company name modal ───────────────────────────────────── */}
      <Dialog open={isFirmaModalOpen} onOpenChange={setIsFirmaModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">PDF herunterladen</DialogTitle>
            <DialogDescription>
              Für welche Firma ist diese Bewerbung? Der Firmenname wird im Dateinamen verwendet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="firma">Firma Name <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="firma"
                placeholder="z.B. Google, Siemens, BMW…"
                value={firmaName}
                onChange={(e) => setFirmaName(e.target.value)}
                autoFocus
                className="h-11 rounded-xl"
                onKeyDown={(e) => e.key === "Enter" && handleModalConfirm()}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setIsFirmaModalOpen(false)}>
              Abbrechen
            </Button>
            <Button className="rounded-xl px-6" onClick={handleModalConfirm}>
              PDF Generieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
