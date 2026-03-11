import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  /** Optional accent color class for the live badge dot, e.g. "bg-emerald-500". Defaults to white. */
  accentColor?: string;
}

export default function EditorPreviewPanel({ children, accentColor = "bg-white/60" }: Props) {
  return (
    <div className="flex flex-col overflow-hidden border-b bg-[#525659] shadow-inner lg:col-span-7 lg:border-b-0 lg:order-2 order-1">
      {/* chrome bar */}
      <div className="sticky top-0 z-40 flex shrink-0 items-center justify-between border-b border-white/10 bg-black/50 px-4 py-3 shadow-xl backdrop-blur-md lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/70">
            <motion.span
              className={`h-1.5 w-1.5 rounded-full ${accentColor}`}
              animate={{ scale: [1, 1.7, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="hidden xs:inline">Live Preview</span>
            <span className="xs:hidden">Live</span>
          </div>
          <span className="border-l border-white/10 pl-3 text-[10px] font-medium text-white/35 xs:text-xs">
            DIN-A4 Dokument
          </span>
        </div>
        {/* Fake window buttons for premium look */}
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
      </div>

      {/* scroll area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
        <div className="flex items-start justify-center py-8 sm:py-12 lg:py-16">
          {children}
        </div>
      </div>
    </div>
  );
}
