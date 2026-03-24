import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LebenslaufPage from "./pages/LebenslaufPage";
import AnschreibenPage from "./pages/AnschreibenPage";
import DeckblattPage from "./pages/DeckblattPage";
import FsjLebenslaufPage from "./pages/FsjLebenslaufPage";
import FsjAnschreibenPage from "./pages/FsjAnschreibenPage";
import "./index.css";

function AppContent() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="w-full flex-1 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lebenslauf" element={<LebenslaufPage />} />
              <Route path="/anschreiben" element={<AnschreibenPage />} />
              <Route path="/deckblatt" element={<DeckblattPage />} />
              <Route path="/fsj-lebenslauf" element={<FsjLebenslaufPage />} />
              <Route path="/fsj-anschreiben" element={<FsjAnschreibenPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
