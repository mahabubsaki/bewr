import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LebenslaufPage from "./pages/LebenslaufPage";
import AnschreibenPage from "./pages/AnschreibenPage";
import DeckblattPage from "./pages/DeckblattPage";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/lebenslauf" element={<LebenslaufPage />} />
            <Route path="/anschreiben" element={<AnschreibenPage />} />
            <Route path="/deckblatt" element={<DeckblattPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
