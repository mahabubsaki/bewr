import { NavLink } from "react-router-dom";
import { FileText, Home, File, Mail, Layers, Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const navItems = [
    { to: "/", label: "Dashboard", icon: Home, end: true },
    { to: "/deckblatt", label: "Deckblatt", icon: Layers },
    { to: "/anschreiben", label: "Anschreiben", icon: Mail },
    { to: "/lebenslauf", label: "Lebenslauf", icon: File },
  ];

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-2.5 whitespace-nowrap text-lg font-bold text-primary">
        <FileText className="h-6 w-6" />
        <span className="hidden xs:inline">Bewerbung Manager</span>
        <span className="xs:hidden">Bewerbung</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex h-full gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2 border-b-2 px-4 text-sm font-medium transition-all hover:bg-primary/5 hover:text-foreground ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 shadow-xl ring-1 ring-black/5">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.to} asChild className="focus:bg-primary focus:text-primary-foreground cursor-pointer">
                <NavLink to={item.to} end={item.end} className="flex items-center gap-3 w-full px-2 py-2.5 text-sm font-medium">
                  <item.icon className="h-5 w-5 opacity-70" />
                  {item.label}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
