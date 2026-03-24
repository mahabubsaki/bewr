import LebenslaufPage from "./LebenslaufPage";
import { defaultFsjLebenslauf } from "../data/defaultData";
import type { LebenslaufConfig } from "./LebenslaufPage";

const FSJ_CONFIG: Partial<LebenslaufConfig> = {
  storageKey: "fsj-lebenslauf",
  sectionOrderKey: "fsj-lebenslauf-section-order",
  deletedSectionsKey: "fsj-lebenslauf-deleted-sections",
  defaultData: defaultFsjLebenslauf,
  defaultSectionOrder: [
    "personal",
    "about",
    "experience",
    "education",
    "interests",
    "skills",
    "projects",
  ],
  defaultDeletedSections: ["projects"],
  title: "FSJ Lebenslauf",
  breadcrumbLabel: "FSJ Lebenslauf Editor",
  gradient: "bg-linear-to-br from-rose-500 to-pink-600",
  glow: "shadow-rose-500/30",
  accentColor: "bg-rose-400",
  downloadLabel: "FSJ-Lebenslauf",
};

export default function FsjLebenslaufPage() {
  return <LebenslaufPage config={FSJ_CONFIG} />;
}
