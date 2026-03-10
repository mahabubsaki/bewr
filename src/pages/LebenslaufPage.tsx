import { useState, useEffect } from "react";
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
  Eye,
  Layout,
  User,
  Settings,
  Briefcase,
  GraduationCap,
  Code2,
  Lightbulb,
  Heart,
  GripVertical,
  PlusCircle
} from "lucide-react";
import { generateLebenslaufPdf } from "../utils/generatePdf";
import MarginControls from "../components/MarginControls";
import { formatFilename } from "../utils/dateUtils";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { useNavigate } from "react-router-dom";

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

  // Migration logic
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = data as any;
    if (!data.personalFields && raw.personalData) {
      const pd = raw.personalData;
      const fields = [
        { label: "Name", value: pd.name || "" },
        { label: "Geburtsdatum", value: pd.geburtsdatum || "" },
        { label: "Adresse", value: pd.adresse || "" },
        { label: "Telefon", value: pd.telefon || "" },
        { label: "E-Mail", value: pd.email || "" },
        { label: "Portfolio", value: pd.portfolio || "" },
        { label: "Github", value: pd.github || "" },
      ];
      if (raw.extraPersonal) fields.push(...raw.extraPersonal);
      const migrated = { ...data, personalFields: fields };
      delete (migrated as any).personalData;
      delete (migrated as any).extraPersonal;
      setData(migrated as LebenslaufData);
    }

    if (!data.margins) {
      setData((prev) => ({ ...prev, margins: defaultLebenslauf.margins }));
    }

    if (!data.sectionTitles) {
      setData((prev) => ({ ...prev, sectionTitles: defaultLebenslauf.sectionTitles }));
    }
  }, [data, setData]);

  const update = (path: string, value: unknown) => {
    setData((prev: LebenslaufData) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj: any = newData;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleDownload = async () => {
    const name = data.personalFields?.find((f) => f.label === "Name")?.value || "Unbekannt";
    const filename = formatFilename(name, "Lebenslauf");
    await generateLebenslaufPdf(data, filename);
  };

  const activeSections = sectionOrder.filter((id) => !deletedSections.includes(id));

  const moveSection = (id: SectionId, dir: "up" | "down") => {
    const idx = sectionOrder.indexOf(id);
    if (idx < 0) return;
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sectionOrder.length) return;
    const o = [...sectionOrder];
    [o[idx], o[newIdx]] = [o[newIdx], o[idx]];
    setSectionOrder(o);
  };

  const deleteSection = (id: SectionId) => setDeletedSections([...deletedSections, id]);
  const restoreSection = (id: SectionId) => setDeletedSections(deletedSections.filter((s) => s !== id));

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
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Lebenslauf Editor</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Lebenslauf</h1>
            <Badge variant="outline" className="h-5 text-[10px] uppercase">Custom Order</Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="mr-4 flex gap-1 rounded-md bg-muted p-1">
            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} className="h-8 w-8">
              <Undo2 size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} className="h-8 w-8">
              <Redo2 size={16} />
            </Button>
          </div>
          <MarginControls
            margins={data.margins || defaultLebenslauf.margins}
            onChange={(m) => update("margins", m)}
          />
          <Button onClick={handleDownload} className="gap-2">
            <Download size={18} /> PDF Export
          </Button>
        </div>
      </div>

      <div className="grid h-full lg:grid-cols-12 overflow-hidden bg-muted/30">
        {/* Editor Panel - Scrollable */}
        <div className="lg:col-span-5 h-[calc(100vh-10rem)] overflow-y-auto p-4 space-y-6 lg:border-r bg-background/50 backdrop-blur-sm">
          <Card className="border-primary/10 shadow-sm bg-background">
            <CardHeader className="pb-3 border-b bg-muted/30 sticky top-0 z-10 backdrop-blur-md">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GripVertical className="text-muted-foreground" size={16} />
                Struktur & Reihenfolge
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {activeSections.map((id, idx) => (
                <div key={id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg group transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 flex items-center justify-center font-mono text-[10px]">
                      {idx + 1}
                    </Badge>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {SECTION_ICONS[id]}
                      {data.sectionTitles?.[id] || SECTION_LABELS[id]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" 
                      disabled={idx === 0} onClick={() => moveSection(id, "up")}>
                      <ChevronUp size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" 
                      disabled={idx === activeSections.length - 1} onClick={() => moveSection(id, "down")}>
                      <ChevronDown size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteSection(id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}

              {deletedSections.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-1">Gesperrte Bereiche</p>
                  <div className="flex flex-wrap gap-2">
                    {deletedSections.map(id => (
                      <Button key={id} variant="outline" size="sm" className="h-7 text-xs gap-1 py-0 px-2 rounded-full"
                        onClick={() => restoreSection(id)}>
                        <Plus size={12} /> {SECTION_LABELS[id]}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="personal" className="w-full">
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <TabsList className="w-auto flex">
                {activeSections.map(id => (
                  <TabsTrigger key={id} value={id} className="gap-2 px-4">
                    {SECTION_ICONS[id]}
                    <span className="max-w-[100px] truncate">{data.sectionTitles?.[id] || SECTION_LABELS[id].split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            {activeSections.map(id => (
              <TabsContent key={id} value={id} className="pt-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Bereich bearbeiten</CardTitle>
                      <CardDescription>Daten anpassen oder Titel ändern</CardDescription>
                    </div>
                    <Input 
                      className="max-w-[180px] h-8 text-xs font-semibold"
                      value={data.sectionTitles?.[id] || ""}
                      placeholder={SECTION_LABELS[id]}
                      onChange={(e) => {
                        const st = { ...(data.sectionTitles || {}) };
                        st[id] = e.target.value;
                        update("sectionTitles", st);
                      }}
                    />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {id === "personal" && (
                      <div className="space-y-4">
                        {data.personalFields?.map((f, i) => (
                          <div key={i} className="flex gap-3 items-end group">
                            <div className="grid gap-1.5 flex-[1.5]">
                              <Label className="text-[10px] uppercase font-bold opacity-50">Feld</Label>
                              <Input value={f.label} onChange={(e) => {
                                const nf = [...data.personalFields];
                                nf[i].label = e.target.value;
                                update("personalFields", nf);
                              }} />
                            </div>
                            <div className="grid gap-1.5 flex-[3]">
                              <Label className="text-[10px] uppercase font-bold opacity-50">Inhalt</Label>
                              <Input value={f.value} onChange={(e) => {
                                const nf = [...data.personalFields];
                                nf[i].value = e.target.value;
                                update("personalFields", nf);
                              }} />
                            </div>
                            <div className="flex gap-1 mb-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveInArray("personalFields", i, "up")} disabled={i===0}>
                                <ChevronUp size={14} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromArray("personalFields", i)}>
                                <X size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full border-dashed" onClick={() => insertIntoArray("personalFields", data.personalFields.length, { label: "Feld", value: "Neu" })}>
                          <PlusCircle size={14} className="mr-2" /> Weiteres Feld
                        </Button>
                      </div>
                    )}

                    {id === "about" && (
                      <Textarea 
                        rows={10} 
                        value={data.aboutMe} 
                        onChange={(e) => update("aboutMe", e.target.value)} 
                        placeholder="Kurze Vorstellung..."
                      />
                    )}

                    {(id === "experience" || id === "education" || id === "projects") && (
                      <div className="space-y-6">
                        {(data[id] as any[]).map((item, i) => (
                          <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/50 relative group">
                            <div className="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <Button variant="secondary" size="icon" className="h-7 w-7 shadow-sm border" onClick={() => moveInArray(id, i, "up")} disabled={i===0}>
                                <ChevronUp size={14} />
                              </Button>
                              <Button variant="destructive" size="icon" className="h-7 w-7 shadow-sm" onClick={() => removeFromArray(id, i)}>
                                <X size={14} />
                              </Button>
                            </div>
                            
                            <div className="grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5">
                                  <Label className="text-xs">Zeitraum</Label>
                                  <Input value={item.period} onChange={(e) => {
                                    const a = [...(data[id] as any)];
                                    a[i].period = e.target.value;
                                    update(id, a);
                                  }} />
                                </div>
                                <div className="grid gap-1.5">
                                  <Label className="text-xs">
                                    {id === "experience" ? "Firma" : id === "education" ? "Institution" : "Projektname"}
                                  </Label>
                                  <Input value={item.company || item.institution || item.title} onChange={(e) => {
                                    const a = [...(data[id] as any)];
                                    const key = id === "experience" ? "company" : id === "education" ? "institution" : "title";
                                    a[i][key] = e.target.value;
                                    update(id, a);
                                  }} />
                                </div>
                              </div>
                              <div className="grid gap-1.5">
                                <Label className="text-xs">Details / Aufzählung</Label>
                                <EditableList items={item.bullets} onChange={(v) => {
                                  const a = [...(data[id] as any)];
                                  a[i].bullets = v;
                                  update(id, a);
                                }} />
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full border-dashed" onClick={() => {
                          const skeleton: any = { period: "JJJJ - heute", bullets: ["Neuer Eintrag"] };
                          if (id === "experience") skeleton.company = "Firma";
                          if (id === "education") skeleton.institution = "Institution";
                          if (id === "projects") skeleton.title = "Projekt";
                          insertIntoArray(id, (data[id] as any).length, skeleton);
                        }}>
                          <PlusCircle size={14} className="mr-2" /> {SECTION_LABELS[id]} hinzufügen
                        </Button>
                      </div>
                    )}

                    {id === "skills" && (
                      <div className="space-y-4">
                        {data.skills.map((s, i) => (
                           <div key={i} className="flex gap-3 items-start group">
                             <div className="flex-1 space-y-2">
                               <Input placeholder="Kategorie" className="h-8 font-bold" value={s.category} onChange={(e) => {
                                 const ns = [...data.skills];
                                 ns[i].category = e.target.value;
                                 update("skills", ns);
                               }} />
                               <Textarea placeholder="Details (kommagetrennt)" className="h-20 resize-none text-sm" value={s.items} onChange={(e) => {
                                 const ns = [...data.skills];
                                 ns[i].items = e.target.value;
                                 update("skills", ns);
                               }} />
                             </div>
                             <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                               <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveInArray("skills", i, "up")} disabled={i===0}>
                                 <ChevronUp size={14} />
                               </Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeFromArray("skills", i)}>
                                 <X size={14} />
                               </Button>
                             </div>
                           </div>
                        ))}
                        <Button variant="outline" className="w-full border-dashed" onClick={() => insertIntoArray("skills", data.skills.length, { category: "Neu", items: "..." })}>
                          <PlusCircle size={14} className="mr-2" /> Kategorie hinzufügen
                        </Button>
                      </div>
                    )}

                    {id === "interests" && (
                      <Textarea 
                        rows={10} 
                        value={data.hobbys} 
                        onChange={(e) => update("hobbys", e.target.value)} 
                        placeholder="Freizeit, Projekte, Interessen..."
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Settings size={16} /> Abschluss & Signatur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="text-xs">Ort</Label>
                  <Input value={data.signatureCity} onChange={(e) => update("signatureCity", e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Datum</Label>
                  <Input value={data.signatureDate} onChange={(e) => update("signatureDate", e.target.value)} />
                </div>
              </div>
              <div className="flex justify-center border-2 border-dashed rounded-xl p-4 bg-white/50">
                <PhotoUpload
                  photo={data.signature}
                  onPhotoChange={(v) => update("signature", v)}
                  width={200}
                  height={80}
                  label="Scan der Unterschrift"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel - Fixed for PDF consistency and Responsiveness */}
        <div className="lg:col-span-7 bg-[#525659] h-[calc(100vh-10rem)] overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-black/40 backdrop-blur-md text-white/90 border-b border-white/5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Preview
              </div>
              <span className="text-xs font-medium text-white/40 border-l border-white/10 pl-3">DIN-A4 Render Engine v1.0</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-tighter">
              <Eye size={12} className="text-white/10" /> 
              Real-time Output Sync
            </div>
          </div>

          <div className="flex justify-center p-4 lg:p-12 overflow-x-auto min-h-full">
            <div className="shadow-2xl">
              <LebenslaufPreview 
                data={data} 
                activeSections={activeSections} 
                onUpdate={(p, v) => update(p, v)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
