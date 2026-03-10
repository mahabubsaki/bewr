import { NavLink } from "react-router-dom";
import { FileText, Home, File, Mail, Layers } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FileText size={24} />
        <span>Bewerbung Manager</span>
      </div>
      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Home size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/deckblatt"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Layers size={18} />
          <span>Deckblatt</span>
        </NavLink>
        <NavLink
          to="/anschreiben"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Mail size={18} />
          <span>Anschreiben</span>
        </NavLink>
        <NavLink
          to="/lebenslauf"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <File size={18} />
          <span>Lebenslauf</span>
        </NavLink>
      </div>
    </nav>
  );
}
