import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultAnschreiben } from "../data/defaultData";
import type { AnschreibenData, DeckblattData } from "../data/defaultData";
import { Download, Zap } from "lucide-react";
import { Mail } from "lucide-react";
import { generateAnschreibenPdf } from "../utils/generatePdf";
import MarginControls from "../components/MarginControls";
import { formatDocFilename, getCurrentDateGerman } from "../utils/dateUtils";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

import EditorPageHeader from "../components/editor/EditorPageHeader";
import EditorPreviewPanel from "../components/editor/EditorPreviewPanel";
import FirmaModal from "../components/editor/FirmaModal";
import AnschreibenEditorPanel from "../components/anschreiben/AnschreibenEditorPanel";
import AnschreibenQuickEdit from "../components/anschreiben/AnschreibenQuickEdit";
import AnschreibenPreview from "../components/AnschreibenPreview";

export default function AnschreibenPage() {
  const navigate = useNavigate();
  const [data, setData] = useLocalStorage<AnschreibenData>("anschreiben", defaultAnschreiben);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [isFirmaModalOpen, setIsFirmaModalOpen] = useState(false);
  const [firmaName, setFirmaName] = useState("");

  // Migration
  useEffect(() => {
    let updated = false;
    const newData = { ...data };
    if (!data.margins) { newData.margins = defaultAnschreiben.margins; updated = true; }
    if (!data.sender) {
      newData.sender = { name: (data as any).senderName || "Max Mustermann", street: "", city: "", phone: "", email: "", photo: "" };
      updated = true;
    }
    if (!data.paragraphs || data.paragraphs.length < 6) {
      const p = [...(data.paragraphs || [])];
      while (p.length < 6) p.push(defaultAnschreiben.paragraphs[p.length]);
      newData.paragraphs = p;
      updated = true;
    }
    const today = getCurrentDateGerman();
    if (data.date !== today) { newData.date = today; updated = true; }
    if (updated) setData(newData);
  }, [data.sender, data.margins, data.paragraphs]);

  if (!data.sender) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const update = (key: keyof AnschreibenData, value: unknown) => {
    setData((prev: AnschreibenData) => ({ ...prev, [key]: value }));
    if (key === "subject") {
      try {
        const stored = localStorage.getItem("deckblatt");
        if (stored) {
          const d = JSON.parse(stored);
          d.position = value;
          localStorage.setItem("deckblatt", JSON.stringify(d));
        }
      } catch {}
    }
  };

  const updateParagraph = (index: number, value: string) => {
    const p = [...data.paragraphs];
    p[index] = value;
    update("paragraphs", p);
  };

  const handleSyncFromDeckblatt = () => {
    try {
      const str = localStorage.getItem("deckblatt");
      if (str) {
        const d: DeckblattData = JSON.parse(str);
        setData((prev: AnschreibenData) => ({
          ...prev,
          sender: { ...d.personal },
          senderNameClosing: d.personal.name || prev.senderNameClosing,
          subject: d.position !== undefined ? d.position : prev.subject,
        }));
        toast.success("Daten vom Deckblatt übernommen");
      } else {
        toast.error("Keine Deckblatt-Daten gefunden");
      }
    } catch {
      toast.error("Fehler beim Synchronisieren");
    }
  };

  const handleConfirm = async () => {
    const company = firmaName;
    setIsFirmaModalOpen(false);
    setFirmaName("");
    const filename = formatDocFilename(data.sender.name, "Anschreiben", company);
    await generateAnschreibenPdf(data, filename);
  };

  return (
    <>
      <motion.div
        className="flex min-h-screen flex-col bg-background max-w-[1500px] mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <EditorPageHeader
          title="Anschreiben"
          breadcrumbLabel="Anschreiben Editor"
          icon={<Mail size={18} />}
          gradient="bg-linear-to-br from-emerald-500 to-teal-600"
          glow="shadow-emerald-500/30"
          onBack={() => navigate("/")}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsQuickEditOpen(true)}
            className="gap-2 border-border/60 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
          >
            <Zap size={14} className="text-amber-500" />
            <span className="hidden sm:inline">Smart Edit</span>
          </Button>
          <MarginControls
            margins={data.margins || defaultAnschreiben.margins}
            onChange={(m) => update("margins", m)}
          />
          <Button
            size="sm"
            onClick={() => setIsFirmaModalOpen(true)}
            className="gap-2 bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            <Download size={15} />
            <span className="hidden sm:inline">PDF Export</span>
          </Button>
        </EditorPageHeader>

        <div className="grid min-h-[calc(100vh-7.5rem)] grid-cols-1 overflow-hidden border-y bg-muted/20 lg:grid-cols-12 lg:rounded-2xl lg:border lg:shadow-inner">
          <AnschreibenEditorPanel
            data={data}
            update={update}
            updateParagraph={updateParagraph}
            onSyncFromDeckblatt={handleSyncFromDeckblatt}
          />
          <EditorPreviewPanel accentColor="bg-emerald-400">
            <AnschreibenPreview data={data} />
          </EditorPreviewPanel>
        </div>
      </motion.div>

      <AnschreibenQuickEdit
        open={isQuickEditOpen}
        onOpenChange={setIsQuickEditOpen}
        data={data}
        update={update}
      />

      <FirmaModal
        open={isFirmaModalOpen}
        onOpenChange={setIsFirmaModalOpen}
        firmaName={firmaName}
        onFirmaNameChange={setFirmaName}
        onConfirm={handleConfirm}
        docLabel="Anschreiben"
      />
    </>
  );
}
