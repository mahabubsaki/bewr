import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultDeckblatt } from "../data/defaultData";
import type { DeckblattData } from "../data/defaultData";
import { Download, Sparkle, Layers } from "lucide-react";
import { generateDeckblattPdf } from "../utils/generatePdf";
import MarginControls from "../components/MarginControls";
import { formatDocFilename } from "../utils/dateUtils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useNavigate } from "react-router-dom";
import DeckblattPreview from "../components/DeckblattPreview";
import { motion } from "framer-motion";

import EditorPageHeader from "../components/editor/EditorPageHeader";
import EditorPreviewPanel from "../components/editor/EditorPreviewPanel";
import FirmaModal from "../components/editor/FirmaModal";
import DeckblattEditorPanel from "../components/deckblatt/DeckblattEditorPanel";

export default function DeckblattPage() {
  const navigate = useNavigate();
  const [data, setData] = useLocalStorage<DeckblattData>("deckblatt", defaultDeckblatt);
  const [isSmartEditOpen, setIsSmartEditOpen] = useState(false);
  const [isFirmaModalOpen, setIsFirmaModalOpen] = useState(false);
  const [firmaName, setFirmaName] = useState("");

  useEffect(() => {
    let updated = false;
    const newData = { ...data };
    if (!data.personal) {
      newData.personal = { name: (data as any).name || "Max Mustermann", street: "", city: "", phone: "", email: "", photo: "" };
      updated = true;
    }
    if (!data.margins) { newData.margins = defaultDeckblatt.margins; updated = true; }
    if (updated) setData(newData);
  }, [data.personal, data.margins]);

  if (!data?.personal) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const update = (key: keyof DeckblattData, value: unknown) => {
    setData((prev: DeckblattData) => ({ ...prev, [key]: value }));
    if (key === "position") {
      try {
        const stored = localStorage.getItem("anschreiben");
        if (stored) {
          const d = JSON.parse(stored);
          d.subject = value;
          localStorage.setItem("anschreiben", JSON.stringify(d));
        }
      } catch {}
    }
  };

  const handleConfirm = async () => {
    const company = firmaName;
    setIsFirmaModalOpen(false);
    setFirmaName("");
    const filename = formatDocFilename(data.personal.name, "Deckblatt", company);
    await generateDeckblattPdf(data, filename);
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
          title="Deckblatt"
          breadcrumbLabel="Deckblatt Editor"
          icon={<Layers size={18} />}
          gradient="bg-linear-to-br from-indigo-500 to-blue-600"
          glow="shadow-indigo-500/30"
          onBack={() => navigate("/")}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSmartEditOpen(true)}
            className="gap-2 border-border/60 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
          >
            <Sparkle size={14} className="text-amber-500 animate-pulse" />
            <span className="hidden sm:inline">Smart Edit</span>
          </Button>
          <MarginControls
            margins={data.margins || defaultDeckblatt.margins}
            onChange={(m) => update("margins", m)}
          />
          <Button
            size="sm"
            onClick={() => setIsFirmaModalOpen(true)}
            className="gap-2 bg-linear-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            <Download size={15} />
            <span className="hidden sm:inline">PDF Export</span>
          </Button>
        </EditorPageHeader>

        <div className="grid min-h-[calc(100vh-7.5rem)] grid-cols-1 overflow-hidden border-y bg-muted/20 lg:grid-cols-12 lg:rounded-2xl lg:border lg:shadow-inner">
          <DeckblattEditorPanel data={data} update={update} />
          <EditorPreviewPanel accentColor="bg-indigo-400">
            <DeckblattPreview data={data} />
          </EditorPreviewPanel>
        </div>
      </motion.div>

      {/* Smart Edit Dialog */}
      <Dialog open={isSmartEditOpen} onOpenChange={setIsSmartEditOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30">
                <Sparkle size={18} />
              </div>
              <div>
                <DialogTitle className="text-lg font-black">Smart Edit</DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-widest">
                  Quick Details bearbeiten
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dein Name</Label>
                <Input
                  value={data.personal.name}
                  onChange={(e) => update("personal", { ...data.personal, name: e.target.value })}
                  placeholder="Max Mustermann"
                  className="h-11 rounded-xl border-border/60"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Zielposition</Label>
                <Input
                  value={data.position}
                  onChange={(e) => update("position", e.target.value)}
                  placeholder="Fullstack Developer"
                  className="h-11 rounded-xl border-border/60 italic"
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">E-Mail</Label>
                <Input value={data.personal.email} onChange={(e) => update("personal", { ...data.personal, email: e.target.value })} className="h-11 rounded-xl border-border/60" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Telefon</Label>
                <Input value={data.personal.phone} onChange={(e) => update("personal", { ...data.personal, phone: e.target.value })} className="h-11 rounded-xl border-border/60" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSmartEditOpen(false)} className="h-11 w-full rounded-xl bg-linear-to-br from-indigo-500 to-blue-600 px-8 text-white shadow-md sm:w-auto">
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FirmaModal
        open={isFirmaModalOpen}
        onOpenChange={setIsFirmaModalOpen}
        firmaName={firmaName}
        onFirmaNameChange={setFirmaName}
        onConfirm={handleConfirm}
        docLabel="Deckblatt"
      />
    </>
  );
}
