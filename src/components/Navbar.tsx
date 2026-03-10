import { NavLink } from "react-router-dom";
import { FileText, Home, File, Mail, Layers } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center gap-12 border-b bg-card/80 px-8 backdrop-blur-md">
      <div className="flex items-center gap-2.5 whitespace-nowrap text-lg font-bold text-primary">
        <FileText className="h-6 w-6" />
        <span>Bewerbung Manager</span>
      </div>
      <div className="flex h-full gap-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors hover:bg-white/5 hover:text-foreground ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`
          }
        >
          <Home className="h-[18px] w-[18px]" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/deckblatt"
          className={({ isActive }) =>
            `flex items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors hover:bg-white/5 hover:text-foreground ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`
          }
        >
          <Layers className="h-[18px] w-[18px]" />
          <span>Deckblatt</span>
        </NavLink>
        <NavLink
          to="/anschreiben"
          className={({ isActive }) =>
            `flex items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors hover:bg-white/5 hover:text-foreground ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`
          }
        >
          <Mail className="h-[18px] w-[18px]" />
          <span>Anschreiben</span>
        </NavLink>
        <NavLink
          to="/lebenslauf"
          className={({ isActive }) =>
            `flex items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors hover:bg-white/5 hover:text-foreground ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`
          }
        >
          <File className="h-[18px] w-[18px]" />
          <span>Lebenslauf</span>
        </NavLink>
      </div>
    </nav>
  );
}
