import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Home, File, Mail, Layers, X, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { overlayVariants, panelVariants } from "../lib/animations";

const navItems = [
  { to: "/",            label: "Dashboard",   icon: Home,     end: true  },
  { to: "/deckblatt",   label: "Deckblatt",   icon: Layers,   end: false },
  { to: "/anschreiben", label: "Anschreiben", icon: Mail,     end: false },
  { to: "/lebenslauf",  label: "Lebenslauf",  icon: File,     end: false },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevated, setElevated]     = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setElevated(window.scrollY > 6);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      {/* ── Main nav bar ────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300 ${
          elevated ? "shadow-[0_1px_24px_rgba(0,0,0,0.07)]" : ""
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 select-none focus:outline-none">
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30"
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 450, damping: 18 }}
            >
              <FileText size={15} className="text-primary-foreground" />
            </motion.div>
            <span className="hidden sm:block text-[15px] font-bold tracking-tight">
              Bewerbung<span className="text-primary">Manager</span>
            </span>
          </NavLink>

          {/* ── Desktop pill nav ───────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-0.5 rounded-xl border border-border/50 bg-muted/50 p-1">
            {navItems.map((item) => {
              const isActive = item.end
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <NavLink key={item.to} to={item.to} end={item.end} className="relative block focus:outline-none">
                  {isActive && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 rounded-lg bg-background shadow-sm"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  <div
                    className={`relative z-10 flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon size={14} />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>

          {/* ── Mobile hamburger ───────────────────────────────────────── */}
          <motion.div className="md:hidden" whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => setMobileOpen(true)}
              aria-label="Menü öffnen"
            >
              <Menu size={19} />
            </Button>
          </motion.div>
        </div>
      </header>

      {/* ── Mobile full-panel drawer ────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-[3px]"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed right-0 top-0 z-[61] flex h-full w-[72vw] max-w-[300px] flex-col bg-background shadow-2xl"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Drawer header */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                    <FileText size={13} className="text-primary-foreground" />
                  </div>
                  <span className="text-[13px] font-bold tracking-tight">Navigation</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setMobileOpen(false)}>
                  <X size={16} />
                </Button>
              </div>

              {/* Drawer nav items */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.065, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3.5 text-[13px] font-semibold transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon size={17} />
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="shrink-0 border-t border-border/60 px-5 py-4">
                <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Bewerbung Manager
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
