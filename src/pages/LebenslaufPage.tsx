/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useCallback } from "react";
import EditableList from "../components/EditableList";
import PhotoUpload from "../components/PhotoUpload";
import LebenslaufPreview from "../components/LebenslaufPreview";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultLebenslauf } from "../data/defaultData";
import type { LebenslaufData } from "../data/defaultData";
import {
  Download,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Undo2,
  Redo2,
  Trash2,
  Layout,
  User,
  Settings,
  Briefcase,
  GraduationCap,
  Code2,
  Lightbulb,
  Heart,
  GripVertical,
  PlusCircle,
} from "lucide-react";
import { generateLebenslaufPdf } from "../utils/generatePdf";
import MarginControls from "../components/MarginControls";
import { getCurrentDateGerman, formatDocFilename } from "../utils/dateUtils";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import EditorPageHeader from "../components/editor/EditorPageHeader";
import EditorPreviewPanel from "../components/editor/EditorPreviewPanel";
import FirmaModal from "../components/editor/FirmaModal";

type SectionId =
  | "personal"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "interests";

const DEFAULT_SECTION_ORDER: SectionId[] = [
  "personal",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "interests",
];

const SECTION_LABELS: Record<SectionId, string> = {
  personal: "Persönliche Daten",
  about: "Über mich",
  skills: "IT-Kenntnisse",
  projects: "Projekte",
  experience: "Berufserfahrung",
  education: "Ausbildung",
  interests: "Kenntnisse und Interessen",
};

const SECTION_ICONS: Record<SectionId, React.ReactNode> = {
  personal: <User size={16} />,
  about: <Lightbulb size={16} />,
  skills: <Code2 size={16} />,
  projects: <Layout size={16} />,
  experience: <Briefcase size={16} />,
  education: <GraduationCap size={16} />,
  interests: <Heart size={16} />,
};

interface SortableItemProps {
  id: string;
  idx: number;
  icon: React.ReactNode;
  label: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function SortableItem(props: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
    animateLayoutChanges: () => false, // Disable expensive layout animations during drag
  });

  const style = {
    transform: CSS.Translate.toString(transform), // Use Translate instead of Transform for better performance
    transition: isDragging ? "none" : transition, // Disable transition while dragging for instant response
    zIndex: isDragging ? 50 : undefined,
    touchAction: "none", // Critical for mobile performance
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between p-2 rounded-lg group will-change-transform cursor-grab active:cursor-grabbing select-none border border-transparent transition-colors ${
        isDragging
          ? "bg-primary/10 shadow-xl border-primary/30 z-50 ring-2 ring-primary/20"
          : "hover:bg-muted/80"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pointer-events-none">
        <div className="text-primary/40 group-hover:text-primary transition-colors touch-none">
          <GripVertical size={14} />
        </div>
        <Badge
          variant="secondary"
          className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 rounded-full p-0 flex items-center justify-center font-mono text-[9px] sm:text-[10px]"
        >
          {props.idx + 1}
        </Badge>
        <span className="flex items-center gap-2 text-xs sm:text-sm font-medium truncate">
          <span className="text-primary/60 shrink-0">{props.icon}</span>
          <span className="truncate">{props.label}</span>
        </span>
      </div>
      <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          disabled={props.isFirst}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.onMoveUp();
          }}
        >
          <ChevronUp size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          disabled={props.isLast}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.onMoveDown();
          }}
        >
          <ChevronDown size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 text-destructive"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.onDelete();
          }}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}

export default function LebenslaufPage() {
  const navigate = useNavigate();
  const {
    value: data,
    setValue: setData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<LebenslaufData>("lebenslauf", defaultLebenslauf);

  const [sectionOrder, setSectionOrder] = useLocalStorage<SectionId[]>(
    "lebenslauf-section-order",
    DEFAULT_SECTION_ORDER,
  );

  const [deletedSections, setDeletedSections] = useLocalStorage<SectionId[]>(
    "lebenslauf-deleted-sections",
    [],
  );

  const [activeTab, setActiveTab] = useState<SectionId>("personal");
  const [isFirmaModalOpen, setIsFirmaModalOpen] = useState(false);
  const [firmaName, setFirmaName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced distance for faster response
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Reduced delay for faster touch activation
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const update = useCallback(
    (path: string, value: unknown) => {
      setData((prev: LebenslaufData) => {
        const newData = JSON.parse(JSON.stringify(prev));
        const keys = path.split(".");
        let obj: any = newData;
        for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
        obj[keys[keys.length - 1]] = value;
        return newData;
      });
    },
    [setData],
  );

  // Migration logic
  useEffect(() => {
    if (!data.personalInfo) {
      // Migrate from personalFields if possible
      const fields = data.personalFields || [];
      const name = fields.find((f) => f.label === "Name")?.value || "";
      const streetCity = fields.find((f) => f.label === "Adresse")?.value || "";
      const phone = fields.find((f) => f.label === "Telefon")?.value || "";
      const email = fields.find((f) => f.label === "E-Mail")?.value || "";

      const [street, city] = streetCity.split(",").map((s) => s.trim());

      setData((prev: LebenslaufData) => ({
        ...prev,
        personalInfo: {
          name: name || "Max Mustermann",
          street: street || "",
          city: city || "",
          phone: phone || "",
          email: email || "",
          photo: (prev as any).photo || "",
        },
        personalFields: fields.filter(
          (f) => !["Name", "Adresse", "Telefon", "E-Mail"].includes(f.label),
        ),
      }));
    }

    if (!data.margins) {
      setData((prev) => ({ ...prev, margins: defaultLebenslauf.margins }));
    }

    if (!data.sectionTitles) {
      setData((prev) => ({
        ...prev,
        sectionTitles: defaultLebenslauf.sectionTitles,
      }));
    }

    // Always set current date
    const today = getCurrentDateGerman();
    if (data.signatureDate !== today) {
      update("signatureDate", today);
    }
  }, [
    data.personalInfo,
    data.margins,
    data.sectionTitles,
    data.signatureDate,
    update,
  ]);

  if (!data?.personalInfo) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">
            Daten werden geladen...
          </p>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    setIsFirmaModalOpen(true);
  };

  const executeDownload = async (company: string) => {
    const name = data.personalInfo.name || "Unbekannt";
    const filename = formatDocFilename(name, "Lebenslauf", company);
    await generateLebenslaufPdf(data, filename, activeSections);
  };

  const activeSections = sectionOrder.filter(
    (id) => !deletedSections.includes(id),
  );

  const moveSection = (id: SectionId, dir: "up" | "down") => {
    const idx = sectionOrder.indexOf(id);
    if (idx < 0) return;
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sectionOrder.length) return;
    const o = [...sectionOrder];
    [o[idx], o[newIdx]] = [o[newIdx], o[idx]];
    setSectionOrder(o);
  };

  const deleteSection = (id: SectionId) =>
    setDeletedSections([...deletedSections, id]);
  const restoreSection = (id: SectionId) =>
    setDeletedSections(deletedSections.filter((s) => s !== id));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionId);
      const newIndex = sectionOrder.indexOf(over?.id as SectionId);
      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  const moveInArray = (key: string, i: number, dir: "up" | "down") => {
    const arr = [...(data as any)[key]];
    const ni = dir === "up" ? i - 1 : i + 1;
    if (ni < 0 || ni >= arr.length) return;
    [arr[i], arr[ni]] = [arr[ni], arr[i]];
    update(key, arr);
  };

  const insertIntoArray = (key: string, i: number, newItem: any) => {
    const arr = [...(data as any)[key]];
    arr.splice(i, 0, newItem);
    update(key, arr);
  };

  const removeFromArray = (key: string, i: number) => {
    const arr = [...(data as any)[key]];
    arr.splice(i, 1);
    update(key, arr);
  };

  return (
    <>
    <motion.div
      className="flex flex-col bg-background max-w-[1500px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <EditorPageHeader
        title="Lebenslauf"
        breadcrumbLabel="Lebenslauf Editor"
        icon={<FileText size={18} />}
        gradient="bg-linear-to-br from-amber-500 to-orange-600"
        glow="shadow-amber-500/30"
        onBack={() => navigate("/")}
      >
        <div className="flex gap-1 rounded-lg bg-muted/60 p-1">
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} className="h-8 w-8 rounded-md">
            <Undo2 size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} className="h-8 w-8 rounded-md">
            <Redo2 size={15} />
          </Button>
        </div>
        <MarginControls
          margins={data.margins || defaultLebenslauf.margins}
          onChange={(m) => update("margins", m)}
        />
        <Button
          size="sm"
          onClick={handleDownload}
          className="gap-2 bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25 hover:shadow-amber-500/40"
        >
          <Download size={15} />
          <span className="hidden sm:inline">PDF Export</span>
        </Button>
      </EditorPageHeader>

      <div className="grid min-h-[calc(100vh-7.5rem)] grid-cols-1 overflow-hidden border-y bg-muted/20 lg:grid-cols-12 lg:rounded-2xl lg:border lg:shadow-inner">
        {/* Editor Panel - Scrollable */}
        <div className="order-2 h-auto overflow-y-visible p-3 sm:p-4 lg:col-span-5 lg:order-1 lg:h-full lg:overflow-y-auto lg:border-r lg:p-6 space-y-4 lg:space-y-5 bg-background/50 backdrop-blur-sm">
          <Card className="border-amber-500/15 shadow-sm bg-background overflow-hidden rounded-2xl">
            <CardHeader className="py-3 px-4 border-b bg-amber-500/5 lg:sticky lg:top-0 z-10 backdrop-blur-md">
              <CardTitle className="text-xs sm:text-sm font-black flex items-center gap-2 uppercase tracking-wider text-amber-600/80">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15">
                  <GripVertical className="text-amber-600" size={13} />
                </div>
                Struktur & Reihenfolge
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 pb-4 px-3 sm:px-4 space-y-1">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={activeSections}
                  strategy={verticalListSortingStrategy}
                >
                  {activeSections.map((id, idx) => (
                    <SortableItem
                      key={id}
                      id={id}
                      idx={idx}
                      icon={SECTION_ICONS[id]}
                      label={data.sectionTitles?.[id] || SECTION_LABELS[id]}
                      onMoveUp={() => moveSection(id, "up")}
                      onMoveDown={() => moveSection(id, "down")}
                      onDelete={() => deleteSection(id)}
                      isFirst={idx === 0}
                      isLast={idx === activeSections.length - 1}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {deletedSections.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-1">
                    Gesperrte Bereiche
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {deletedSections.map((id) => (
                      <Button
                        key={id}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1 py-0 px-2 rounded-full"
                        onClick={() => restoreSection(id)}
                      >
                        <Plus size={12} /> {SECTION_LABELS[id]}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as SectionId)}
            className="w-full"
          >
            <div className="sticky top-[calc(var(--navbar-height,0px))] lg:top-0 z-20 bg-background/95 backdrop-blur-sm -mx-4 px-4 pb-3 pt-2 border-b mb-6 shadow-sm lg:shadow-none">
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600/70 ml-1">
                  Bereich auswählen
                </Label>
                <Select
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as SectionId)}
                >
                  <SelectTrigger className="w-full h-12 lg:h-11 bg-background border-amber-500/25 hover:border-amber-500/50 focus:ring-amber-500/20 transition-all rounded-xl shadow-sm">
                    <SelectValue placeholder="Bereich wählen" />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-xl"
                    position="popper"
                    sideOffset={5}
                  >
                    {activeSections.map((id) => (
                      <SelectItem
                        key={id}
                        value={id}
                        className="py-3 rounded-lg flex items-center gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="opacity-50 group-hover:opacity-100">
                            {SECTION_ICONS[id]}
                          </span>
                          <span className="font-medium text-sm text-[#111]">
                            {data.sectionTitles?.[id] || SECTION_LABELS[id]}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeSections.map((id) => (
              <TabsContent
                key={id}
                value={id}
                className="focus-visible:outline-none focus-visible:ring-0 mt-0"
              >
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                        {SECTION_ICONS[id]}
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-600/90">
                          {SECTION_LABELS[id]}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                          Inhalte für diesen Bereich bearbeiten
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[180px]">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-px flex-1 bg-border/50" />
                        <Label className="text-[9px] font-black uppercase opacity-40 tracking-tighter whitespace-nowrap">
                          Titel im PDF
                        </Label>
                        <div className="h-px flex-1 bg-border/50" />
                      </div>
                      <Input
                        className="h-11 rounded-xl border-border/60 bg-background/80 text-[13px] font-bold transition-all focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/15"
                        value={data.sectionTitles?.[id] || ""}
                        placeholder={SECTION_LABELS[id]}
                        onChange={(e) => {
                          const st = { ...(data.sectionTitles || {}) };
                          st[id] = e.target.value;
                          update("sectionTitles", st);
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {id === "personal" && (
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-shrink-0 mx-auto md:md:mx-0">
                            <Label className="text-[10px] uppercase font-bold opacity-50 block mb-2">
                              Profilbild
                            </Label>
                            <PhotoUpload
                              photo={data.personalInfo.photo}
                              onPhotoChange={(v) =>
                                update("personalInfo.photo", v)
                              }
                            />
                          </div>

                          <div className="flex-1 grid gap-3 grid-cols-1 sm:grid-cols-2">
                            {([
                              { label: "Vollständiger Name", key: "name", placeholder: "Max Mustermann" },
                              { label: "Straße & Hausnr.", key: "street", placeholder: "Musterstraße 1" },
                              { label: "PLZ & Ort", key: "city", placeholder: "12345 Berlin" },
                              { label: "E-Mail", key: "email", placeholder: "max@mail.de" },
                              { label: "Telefon", key: "phone", placeholder: "+49 …" },
                            ] as const).map(({ label, key, placeholder }) => (
                              <div key={key} className="grid gap-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-amber-600/70">
                                  {label}
                                </Label>
                                <Input
                                  className="h-11 rounded-xl border-border/60 bg-background/80 transition-all focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/15"
                                  placeholder={placeholder}
                                  value={(data.personalInfo as any)[key]}
                                  onChange={(e) => update(`personalInfo.${key}`, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10">
                            <User size={12} className="text-amber-600" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600/70">Weitere Fakten / Social Media</span>
                          <div className="flex-1 h-px bg-amber-500/10" />
                        </div>

                        <div className="space-y-3">
                          {data.personalFields?.map((f, i) => (
                            <div
                              key={i}
                              className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end group bg-muted/20 p-3 sm:p-2 rounded-xl sm:rounded-md border border-border/20 hover:border-border/50 transition-all"
                            >
                              <div className="grid gap-1.5 sm:gap-1 flex-[1.5]">
                                <Label className="text-[10px] uppercase font-bold opacity-50 sm:font-medium">
                                  Bezeichnung
                                </Label>
                                <Input
                                  className="h-10 sm:h-8 text-[13px] sm:text-xs bg-background rounded-lg shadow-sm sm:shadow-none"
                                  placeholder="z.B. E-Mail"
                                  value={f.label}
                                  onChange={(e) => {
                                    const nf = [...data.personalFields];
                                    nf[i].label = e.target.value;
                                    update("personalFields", nf);
                                  }}
                                />
                              </div>
                              <div className="grid gap-1.5 sm:gap-1 flex-[3]">
                                <Label className="text-[10px] uppercase font-bold opacity-50 sm:font-medium">
                                  Inhalt
                                </Label>
                                <Input
                                  className="h-10 sm:h-8 text-[13px] sm:text-xs bg-background rounded-lg shadow-sm sm:shadow-none"
                                  placeholder="..."
                                  value={f.value}
                                  onChange={(e) => {
                                    const nf = [...data.personalFields];
                                    nf[i].value = e.target.value;
                                    update("personalFields", nf);
                                  }}
                                />
                              </div>
                              <div className="flex justify-end gap-1 mt-2 sm:mt-0 sm:mb-px opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pt-2 sm:pt-0 border-t sm:border-t-0 border-border/20">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 sm:h-7 sm:w-7 bg-background/50 sm:bg-transparent"
                                  onClick={() =>
                                    moveInArray("personalFields", i, "up")
                                  }
                                  disabled={i === 0}
                                >
                                  <ChevronUp size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 sm:h-7 sm:w-7 bg-background/50 sm:bg-transparent"
                                  onClick={() =>
                                    moveInArray("personalFields", i, "down")
                                  }
                                  disabled={
                                    i === data.personalFields.length - 1
                                  }
                                >
                                  <ChevronDown size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 sm:h-7 sm:w-7 bg-background/50 sm:bg-transparent text-destructive hover:text-white hover:bg-destructive shadow-sm sm:shadow-none"
                                  onClick={() =>
                                    removeFromArray("personalFields", i)
                                  }
                                >
                                  <X size={14} />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed text-xs h-8"
                            onClick={() =>
                              insertIntoArray(
                                "personalFields",
                                data.personalFields.length,
                                { label: "E-Mail", value: "" },
                              )
                            }
                          >
                            <Plus size={14} className="mr-2" /> Weiteres
                            Kontaktfeld
                          </Button>
                        </div>
                      </div>
                    )}

                    {id === "about" && (
                      <div className="rounded-2xl border border-border/50 bg-card p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10">
                            <User size={12} className="text-amber-600" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600/70">Kurzbeschreibung</span>
                          <div className="flex-1 h-px bg-amber-500/10" />
                        </div>
                        <Textarea
                          rows={10}
                          value={data.aboutMe}
                          onChange={(e) => update("aboutMe", e.target.value)}
                          placeholder="Motivierter Softwareentwickler mit 3 Jahren Erfahrung in…"
                          className="resize-none border-none bg-transparent p-0 text-[13px] leading-relaxed focus-visible:ring-0"
                        />
                      </div>
                    )}

                    {(id === "experience" ||
                      id === "education" ||
                      id === "projects") && (
                      <div className="space-y-6">
                        {(data[id] as any[]).map((item, i) => (
                          <div
                            key={i}
                            className="group relative rounded-xl border border-border/40 bg-card/40 p-2 sm:p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                          >
                            {/* Toolbar - Sticky on mobile, hover on desktop */}
                            <div className="flex sm:absolute sm:-right-2 sm:-top-2 z-10 gap-1.5 mb-4 sm:mb-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:scale-95 sm:group-hover:scale-100 justify-end">
                              <Button
                                variant="secondary"
                                size="icon"
                                title="Nach oben"
                                className="h-9 w-9 sm:h-8 sm:w-8 rounded-full border bg-background shadow-sm hover:bg-secondary transition-colors"
                                onClick={() => moveInArray(id, i, "up")}
                                disabled={i === 0}
                              >
                                <ChevronUp size={16} />
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                title="Nach unten"
                                className="h-9 w-9 sm:h-8 sm:w-8 rounded-full border bg-background shadow-sm hover:bg-secondary transition-colors"
                                onClick={() => moveInArray(id, i, "down")}
                                disabled={i === (data[id] as any[]).length - 1}
                              >
                                <ChevronDown size={16} />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                title="Entfernen"
                                className="h-9 w-9 sm:h-8 sm:w-8 rounded-full shadow-md hover:brightness-110 transition-all flex sm:hidden lg:flex"
                                onClick={() => removeFromArray(id, i)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>

                            <div className="space-y-5">
                              {/* Header Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600/70">
                                    Zeitraum
                                  </Label>
                                  <Input
                                    className="h-11 rounded-xl border-border/60 bg-background/80 transition-all focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/15 placeholder:text-muted-foreground/30"
                                    placeholder="z.B. 01/2024 – heute"
                                    value={item.period}
                                    onChange={(e) => {
                                      const a = [...(data[id] as any)];
                                      a[i].period = e.target.value;
                                      update(id, a);
                                    }}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600/70">
                                    {id === "experience"
                                      ? "Unternehmen"
                                      : id === "education"
                                        ? "Bildungseinrichtung"
                                        : "Projektname"}
                                  </Label>
                                  <Input
                                    className="h-11 rounded-xl border-border/60 bg-background/80 font-semibold transition-all focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/15 placeholder:text-muted-foreground/30"
                                    placeholder={
                                      id === "experience"
                                        ? "Firma GmbH"
                                        : id === "education"
                                          ? "Universität"
                                          : "E-Commerce Webanwendung"
                                    }
                                    value={
                                      item.company ||
                                      item.institution ||
                                      item.title
                                    }
                                    onChange={(e) => {
                                      const a = [...(data[id] as any)];
                                      const key =
                                        id === "experience"
                                          ? "company"
                                          : id === "education"
                                            ? "institution"
                                            : "title";
                                      a[i][key] = e.target.value;
                                      update(id, a);
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Bullets Section */}
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600/70">
                                  <Layout size={10} />
                                  Aufgaben & Erfolge
                                </Label>
                                <div className="rounded-lg bg-background/30 p-1 border border-border/20">
                                  <EditableList
                                    items={item.bullets}
                                    onChange={(v) => {
                                      const a = [...(data[id] as any)];
                                      a[i].bullets = v;
                                      update(id, a);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          className="h-12 w-full border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-colors rounded-xl"
                          onClick={() => {
                            const skeleton: any = {
                              period: "",
                              bullets: ["Neuer Eintrag"],
                            };
                            if (id === "experience") skeleton.company = "";
                            if (id === "education") skeleton.institution = "";
                            if (id === "projects") skeleton.title = "";
                            insertIntoArray(
                              id,
                              (data[id] as any).length,
                              skeleton,
                            );
                          }}
                        >
                          <PlusCircle size={16} className="mr-2 text-primary" />{" "}
                          {SECTION_LABELS[id]} hinzufügen
                        </Button>
                      </div>
                    )}

                    {id === "skills" && (
                      <div className="space-y-6">
                        {data.skills.map((s, i) => (
                          <div
                            key={i}
                            className="group relative rounded-xl border border-border/40 bg-card/40 p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] transition-all hover:border-primary/20 hover:shadow-lg hover:bg-card/60"
                          >
                            <div className="flex sm:absolute sm:-right-2 sm:-top-2 z-10 gap-1.5 mb-4 sm:mb-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:scale-95 sm:group-hover:scale-100 justify-end italic">
                              <Button
                                variant="secondary"
                                size="icon"
                                title="Nach oben"
                                className="h-9 w-9 sm:h-8 sm:w-8 rounded-full border bg-background shadow-sm hover:bg-secondary"
                                onClick={() => moveInArray("skills", i, "up")}
                                disabled={i === 0}
                              >
                                <ChevronUp size={16} />
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                title="Nach unten"
                                className="h-9 w-9 sm:h-8 sm:w-8 rounded-full border bg-background shadow-sm hover:bg-secondary"
                                onClick={() => moveInArray("skills", i, "down")}
                                disabled={i === data.skills.length - 1}
                              >
                                <ChevronDown size={16} />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                title="Entfernen"
                                className="h-9 w-9 sm:h-8 sm:w-8 rounded-full shadow-md hover:brightness-110"
                                onClick={() => removeFromArray("skills", i)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-[1fr,2fr]">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-amber-600/70 flex items-center gap-1.5">
                                  <Code2 size={10} /> Kategorie
                                </Label>
                                <Input
                                  placeholder="z.B. IT-Kenntnisse"
                                  className="h-11 rounded-xl border-border/60 bg-background/80 font-semibold transition-all focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/15 text-sm"
                                  value={s.category}
                                  onChange={(e) => {
                                    const ns = [...data.skills];
                                    ns[i].category = e.target.value;
                                    update("skills", ns);
                                  }}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-amber-600/70 flex items-center gap-1.5">
                                  <PlusCircle size={10} /> Kenntnisse (kommagetrennt)
                                </Label>
                                <Textarea
                                  placeholder="React, TypeScript, Tailwind CSS, Node.js..."
                                  className="min-h-25 resize-none rounded-xl border-border/60 text-sm bg-background/80 focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/15 leading-relaxed"
                                  value={s.items}
                                  onChange={(e) => {
                                    const ns = [...data.skills];
                                    ns[i].items = e.target.value;
                                    update("skills", ns);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          className="h-12 w-full border-dashed border-2 border-amber-500/25 text-amber-700 hover:bg-amber-500/5 hover:border-amber-500/50 transition-colors rounded-xl font-medium"
                          onClick={() =>
                            insertIntoArray("skills", data.skills.length, {
                              category: "",
                              items: "",
                            })
                          }
                        >
                          <PlusCircle size={16} className="mr-2 text-primary" />{" "}
                          Neue Kategorie hinzufügen
                        </Button>
                      </div>
                    )}

                    {id === "interests" && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between gap-4">
                            <Label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600/70">
                              <span>🌐</span> Fremdsprachen
                            </Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] uppercase font-bold"
                              onClick={() =>
                                insertIntoArray(
                                  "languages",
                                  data.languages.length,
                                  { name: "", level: "" },
                                )
                              }
                            >
                              <Plus size={12} className="mr-1" /> Hinzufügen
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {data.languages.map((lang, i) => (
                              <div
                                key={i}
                                className="flex gap-2 items-center group/lang"
                              >
                                <Input
                                  placeholder="Deutsch"
                                  className="h-11 rounded-xl border-border/60 bg-background/80 text-xs transition-all focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/15"
                                  value={lang.name}
                                  onChange={(e) => {
                                    const nl = [...data.languages];
                                    nl[i].name = e.target.value;
                                    update("languages", nl);
                                  }}
                                />
                                <Input
                                  placeholder="Muttersprache"
                                  className="h-11 rounded-xl border-border/60 bg-background/80 text-xs transition-all focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/15"
                                  value={lang.level}
                                  onChange={(e) => {
                                    const nl = [...data.languages];
                                    nl[i].level = e.target.value;
                                    update("languages", nl);
                                  }}
                                />
                                <div className="flex gap-0.5 opacity-0 group-hover/lang:opacity-100 transition-opacity whitespace-nowrap">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                      moveInArray("languages", i, "up")
                                    }
                                    disabled={i === 0}
                                  >
                                    <ChevronUp size={14} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                      moveInArray("languages", i, "down")
                                    }
                                    disabled={i === data.languages.length - 1}
                                  >
                                    <ChevronDown size={14} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive"
                                    onClick={() =>
                                      removeFromArray("languages", i)
                                    }
                                  >
                                    <X size={14} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t border-border/40">
                          <Label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600/70">
                            <Heart size={10} /> Hobbys & Sonstiges
                          </Label>
                          <Textarea
                            rows={8}
                            className="min-h-[150px] resize-y rounded-xl border-border/60 text-sm bg-background/80 focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/15 leading-relaxed p-4"
                            value={data.hobbys}
                            onChange={(e) => update("hobbys", e.target.value)}
                            placeholder="Freizeit, Projekte, Interessen..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="relative">
            <Card className="relative bg-card border-amber-500/15 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b bg-amber-500/5">
                <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-wider text-amber-600/80">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15">
                    <Settings size={13} className="text-amber-600" />
                  </div>
                  Abschluss & Signatur
                </CardTitle>
                <CardDescription className="text-[10px] uppercase text-amber-600/50 ml-9">
                  Ort, Datum und Unterschrift
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-amber-600/70">
                      Ort
                    </Label>
                    <Input
                      className="h-11 rounded-xl border-border/60 bg-background/80 transition-all focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/15"
                      placeholder="Berlin"
                      value={data.signatureCity}
                      onChange={(e) => update("signatureCity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-amber-600/70">
                      Datum
                    </Label>
                    <Input
                      disabled
                      className="h-11 rounded-xl border-border/60 bg-muted/20 cursor-not-allowed opacity-60"
                      value={data.signatureDate}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-amber-600/70 block">
                    Handschriftliche Unterschrift (Scan)
                  </Label>
                  <div className="flex justify-center border-2 border-dashed border-amber-500/25 rounded-xl p-6 bg-amber-500/3 transition-colors hover:bg-amber-500/5 hover:border-amber-500/40">
                    <PhotoUpload
                      photo={data.signature}
                      onPhotoChange={(v) => update("signature", v)}
                      width={200}
                      height={80}
                      label="Klicken oder Symbol ziehen"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <EditorPreviewPanel accentColor="bg-amber-400">
          <LebenslaufPreview
            data={data}
            activeSections={activeSections}
            onUpdate={(p, v) => update(p, v)}
          />
        </EditorPreviewPanel>
      </div>
    </motion.div>

      <FirmaModal
        open={isFirmaModalOpen}
        onOpenChange={setIsFirmaModalOpen}
        firmaName={firmaName}
        onFirmaNameChange={setFirmaName}
        onConfirm={async () => {
          const c = firmaName;
          setIsFirmaModalOpen(false);
          setFirmaName("");
          await executeDownload(c);
        }}
        docLabel="Lebenslauf"
      />
    </>
  );
}
