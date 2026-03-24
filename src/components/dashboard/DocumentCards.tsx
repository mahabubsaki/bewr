import { motion } from "framer-motion";
import { Layers, Mail, FileText, Download, ArrowRight, Loader2, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  hasDeckblatt: boolean;
  hasAnschreiben: boolean;
  hasLebenslauf: boolean;
  hasFsjLebenslauf: boolean;
  hasFsjAnschreiben: boolean;
  loading: string | null;
  openDownloadModal: (docId: string) => void;
}

const DOCS = [
  {
    id: "deckblatt",
    title: "Deckblatt",
    desc: "Professionelle Deckblatt-Seite",
    icon: Layers,
    gradient: "bg-gradient-to-br from-indigo-500 to-blue-600",
    blob: "bg-blue-400",
    path: "/deckblatt",
    readyKey: "hasDeckblatt" as const,
  },
  {
    id: "anschreiben",
    title: "Anschreiben",
    desc: "Überzeugendes Bewerbungsschreiben",
    icon: Mail,
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
    blob: "bg-emerald-400",
    path: "/anschreiben",
    readyKey: "hasAnschreiben" as const,
  },
  {
    id: "lebenslauf",
    title: "Lebenslauf",
    desc: "Tabellarischer Lebenslauf",
    icon: FileText,
    gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
    blob: "bg-amber-400",
    path: "/lebenslauf",
    readyKey: "hasLebenslauf" as const,
  },
  {
    id: "fsj-lebenslauf",
    title: "FSJ Lebenslauf",
    desc: "Lebenslauf für FSJ Bewerbung",
    icon: Heart,
    gradient: "bg-gradient-to-br from-rose-500 to-pink-600",
    blob: "bg-rose-400",
    path: "/fsj-lebenslauf",
    readyKey: "hasFsjLebenslauf" as const,
  },
  {
    id: "fsj-anschreiben",
    title: "FSJ Anschreiben",
    desc: "Anschreiben für FSJ Bewerbung",
    icon: Heart,
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    blob: "bg-pink-400",
    path: "/fsj-anschreiben",
    readyKey: "hasFsjAnschreiben" as const,
  },
];

export default function DocumentCards({ hasDeckblatt, hasAnschreiben, hasLebenslauf, hasFsjLebenslauf, hasFsjAnschreiben, loading, openDownloadModal }: Props) {
  const navigate = useNavigate();
  const ready: Record<string, boolean> = { hasDeckblatt, hasAnschreiben, hasLebenslauf, hasFsjLebenslauf, hasFsjAnschreiben };

  return (
    <motion.div
      className="mb-10 grid gap-4 sm:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.28 } },
      }}
    >
      {DOCS.map((doc) => {
        const isReady = ready[doc.readyKey];
        return (
          <motion.div
            key={doc.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <motion.div
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-card glow-border transition-shadow hover:shadow-card-hover"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={() => navigate(doc.path)}
            >
              <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full ${doc.blob} opacity-[0.06] blur-2xl`} />

              <div className="mb-5 flex items-start justify-between">
                <motion.div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md ${doc.gradient}`}
                  whileHover={{ scale: 1.1, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <doc.icon size={20} className="text-white" />
                </motion.div>

                {isReady ? (
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-200/60">
                    <motion.div
                      className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                      animate={{ scale: [1, 1.6, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    Bearbeitet
                  </div>
                ) : (
                  <div className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                    Standard
                  </div>
                )}
              </div>

              <h3 className="mb-1 text-base font-bold tracking-tight text-foreground">{doc.title}</h3>
              <p className="mb-5 text-[12px] text-muted-foreground">{doc.desc}</p>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 flex-1 rounded-lg border-border/70 text-xs font-semibold hover:bg-primary/5 hover:border-primary/40"
                  onClick={() => navigate(doc.path)}
                >
                  Bearbeiten
                  <ArrowRight size={11} className="ml-1.5 opacity-70" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 rounded-lg p-0 hover:bg-primary/8 hover:text-primary"
                  onClick={() => openDownloadModal(doc.id)}
                  disabled={loading !== null}
                >
                  {loading === doc.id
                    ? <Loader2 size={13} className="animate-spin" />
                    : <Download size={13} />}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
