import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Circle } from "lucide-react";

interface Props {
  hasDeckblatt: boolean;
  hasAnschreiben: boolean;
  hasLebenslauf: boolean;
  hasFsjLebenslauf: boolean;
  hasFsjAnschreiben: boolean;
}

export default function DashboardHero({ hasDeckblatt, hasAnschreiben, hasLebenslauf, hasFsjLebenslauf, hasFsjAnschreiben }: Props) {
  return (
    <motion.div
      className="relative mb-10 overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-primary/8 via-background to-background px-8 py-10 shadow-card sm:px-12 sm:py-14"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-56 rounded-full bg-blue-400/8 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />

      <div className="relative z-10 max-w-2xl">
        <motion.div
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.4 }}
        >
          <Sparkles size={11} className="text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            Bewerbung Manager
          </span>
        </motion.div>

        <motion.h1
          className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-foreground">Deine Bewerbung.</span>
          <br />
          <span className="gradient-text bg-linear-to-r from-primary to-blue-500">
            Perfekt organisiert.
          </span>
        </motion.h1>

        <motion.p
          className="mb-7 text-sm text-muted-foreground sm:text-[15px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45 }}
        >
          Erstelle professionelles Deckblatt, Anschreiben und Lebenslauf —
          <br className="hidden sm:block" />
          alles im Browser. Keine Daten verlassen dein Gerät.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.4 }}
        >
          {[
            { label: "Deckblatt",       done: hasDeckblatt },
            { label: "Anschreiben",     done: hasAnschreiben },
            { label: "Lebenslauf",      done: hasLebenslauf },
            { label: "FSJ Lebenslauf",  done: hasFsjLebenslauf },
            { label: "FSJ Anschreiben", done: hasFsjAnschreiben },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                s.done
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s.done
                ? <CheckCircle2 size={13} className="text-emerald-500" />
                : <Circle size={13} className="text-muted-foreground/50" />
              }
              {s.label}
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
