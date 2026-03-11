import { motion } from "framer-motion";
import {
  Layers, Mail, FileText, Download, Package, Loader2,
  Database, ShieldCheck, Settings, Trash2, Upload,
} from "lucide-react";
import { Button } from "../ui/button";
import type { CertificateFile } from "../../data/defaultData";
import PdfUploader from "../PdfUploader";

interface Props {
  hasDeckblatt: boolean;
  hasAnschreiben: boolean;
  hasLebenslauf: boolean;
  loading: string | null;
  certificates: CertificateFile[];
  addCertificates: (files: CertificateFile[]) => void;
  removeCertificate: (id: string) => void;
  openDownloadModal: (docId: string) => void;
  exportData: () => void;
  importData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetToDefault: () => void;
}

const DOWNLOAD_DOCS = [
  { id: "deckblatt",   label: "Deckblatt",   icon: Layers,    readyKey: "hasDeckblatt"   as const },
  { id: "anschreiben", label: "Anschreiben", icon: Mail,      readyKey: "hasAnschreiben" as const },
  { id: "lebenslauf",  label: "Lebenslauf",  icon: FileText,  readyKey: "hasLebenslauf"  as const },
];

export default function DashboardPanels({
  hasDeckblatt, hasAnschreiben, hasLebenslauf,
  loading, certificates, addCertificates, removeCertificate,
  openDownloadModal, exportData, importData, resetToDefault,
}: Props) {
  const ready: Record<string, boolean> = { hasDeckblatt, hasAnschreiben, hasLebenslauf };

  return (
    <>
      {/* ── Downloads | Certificates ──────────────────────────────── */}
      <div className="mb-10 grid gap-6 lg:grid-cols-[260px_1fr]">

        {/* Downloads */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <Package size={13} className="text-primary" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Downloads</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {DOWNLOAD_DOCS.map((doc) => {
              const isReady = ready[doc.readyKey];
              return (
                <motion.button
                  key={doc.id}
                  onClick={() => openDownloadModal(doc.id)}
                  disabled={loading !== null}
                  className={`group relative flex h-18 flex-col items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-card transition-all hover:border-primary/40 hover:bg-primary/3 hover:shadow-md active:scale-95 disabled:cursor-not-allowed ${
                    !isReady ? "opacity-50 grayscale" : ""
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <div className="relative">
                    {loading === doc.id
                      ? <Loader2 size={18} className="animate-spin text-primary" />
                      : <doc.icon size={18} className="text-muted-foreground transition-colors group-hover:text-primary" />
                    }
                    {isReady && (
                      <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-500 ring-[1.5px] ring-background" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground transition-colors group-hover:text-foreground">
                    {doc.label}
                  </span>
                </motion.button>
              );
            })}

            {/* Combined download */}
            <motion.button
              onClick={() => openDownloadModal("combined")}
              disabled={loading !== null}
              className="relative flex h-18 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-linear-to-br from-primary to-blue-600 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95 disabled:cursor-not-allowed"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <div className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition-opacity hover:opacity-100" />
              {loading === "combined"
                ? <Loader2 size={18} className="animate-spin text-white" />
                : <Download size={18} className="text-white" />
              }
              <div className="flex flex-col items-center leading-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white">Komplett</span>
                <span className="text-[9px] font-medium italic text-white/70">Merged PDF</span>
              </div>
            </motion.button>
          </div>
        </motion.section>

        {/* Certificates */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <Upload size={13} className="text-primary" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Zeugnisse & Anlagen</h2>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <PdfUploader
              files={certificates}
              onAdd={addCertificates}
              onRemove={removeCertificate}
            />
          </div>
        </motion.section>
      </div>

      {/* ── Separator ─────────────────────────────────────────────── */}
      <div className="mb-10 h-px bg-linear-to-r from-transparent via-border/80 to-transparent" />

      {/* ── Data management ───────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48, duration: 0.42 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
            <Database size={13} className="text-muted-foreground" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Datenverwaltung</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <motion.div
            className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-5 py-4 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Backup</p>
                <p className="text-[11px] text-muted-foreground">Daten exportieren</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-semibold" onClick={exportData}>
              Export
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-5 py-4 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Settings size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold">Import</p>
                <p className="text-[11px] text-muted-foreground">Backup wiederherstellen</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-semibold" asChild>
              <label className="cursor-pointer">
                Laden
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/4 px-5 py-4 shadow-card transition-shadow hover:shadow-card-hover"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
                <Trash2 size={16} className="text-destructive" />
              </div>
              <div>
                <p className="text-sm font-bold">Zurücksetzen</p>
                <p className="text-[11px] text-muted-foreground">Alle Daten löschen</p>
              </div>
            </div>
            <Button size="sm" variant="destructive" className="h-8 rounded-lg text-xs font-semibold" onClick={resetToDefault}>
              Reset
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
