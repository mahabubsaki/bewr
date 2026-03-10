import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultDeckblatt } from "../data/defaultData";
import type { DeckblattData } from "../data/defaultData";
import { Download, Layout, Settings as SettingsIcon, Eye, Plus, Trash2, Smartphone, Monitor, Sparkle } from "lucide-react";
import { generateDeckblattPdf } from "../utils/generatePdf";
import MarginControls from "../components/MarginControls";
import { formatFilename } from "../utils/dateUtils";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useNavigate } from "react-router-dom";
import DeckblattPreview from "../components/DeckblattPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

export default function DeckblattPage() {
  const navigate = useNavigate();
  const [data, setData] = useLocalStorage<DeckblattData>(
    "deckblatt",
    defaultDeckblatt,
  );
  const [isSmartEditOpen, setIsSmartEditOpen] = useState(false);

  // Ensure margins exist (migration for existing data)
  useEffect(() => {
    if (!data.margins) {
      setData((prev: DeckblattData) => ({
        ...prev,
        margins: defaultDeckblatt.margins,
      }));
    }
  }, [data.margins, setData]);

  const update = (key: keyof DeckblattData, value: unknown) => {
    setData((prev: DeckblattData) => ({ ...prev, [key]: value }));
  };

  const updateAnlagen = (index: number, value: string) => {
    const next = [...data.anlagen];
    next[index] = value;
    update("anlagen", next);
  };

  const addAnlage = () => {
    update("anlagen", [...data.anlagen, "Musteranlage"]);
  };

  const removeAnlage = (index: number) => {
    update("anlagen", data.anlagen.filter((_, i) => i !== index));
  };

  const handleDownload = async () => {
    const filename = formatFilename(data.name, "Deckblatt");
    await generateDeckblattPdf(data, filename);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background/50">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="flex flex-col gap-1">
          <Breadcrumb className="hidden sm:inline-flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Deckblatt Premium</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Deckblatt Editor</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary-foreground pointer-events-none uppercase text-[10px] font-bold">
              Premium UI
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <Dialog open={isSmartEditOpen} onOpenChange={setIsSmartEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                <Sparkle size={16} className="text-primary animate-pulse" />
                <span>Smart Edit</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Quick Details</DialogTitle>
                <DialogDescription>Schnellbearbeitung Ihrer wichtigsten Informationen auf dem Deckblatt.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ihr Name</Label>
                    <Input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Max Mustermann" />
                  </div>
                  <div className="space-y-2">
                    <Label>Zielposition</Label>
                    <Input value={data.position} onChange={(e) => update("position", e.target.value)} placeholder="Fullstack Developer" />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E-Mail</Label>
                    <Input value={data.email} onChange={(e) => update("email", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                 <Button onClick={() => setIsSmartEditOpen(false)}>Speichern</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Separator orientation="vertical" className="h-8" />
          
          <MarginControls
            margins={data.margins || defaultDeckblatt.margins}
            onChange={(m) => update("margins", m)}
          />
          
          <Button onClick={handleDownload} className="gap-2 bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Download size={18} /> Export PDF
          </Button>
        </div>
      </header>

      <main className="grid h-full lg:grid-cols-12 overflow-hidden bg-muted/30">
        {/* Settings Sidebar - Scrollable */}
        <aside className="lg:col-span-4 h-full overflow-y-auto p-4 lg:border-r bg-background/50 backdrop-blur-sm shadow-inner overflow-x-hidden">
          <div className="space-y-8">
            <Tabs defaultValue="basis" className="w-full">
              <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b mb-6 shadow-sm -mx-4 px-4">
                <TabsList className="w-full grid grid-cols-2 bg-muted/30 p-1">
                  <TabsTrigger value="basis" className="data-[state=active]:bg-background font-bold">Basis</TabsTrigger>
                  <TabsTrigger value="anlagen" className="data-[state=active]:bg-background font-bold">Anlagen</TabsTrigger>
                </TabsList>
              </div>

                  <TabsContent value="basis" className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Inhalt</Label>
                      <div className="space-y-3">
                        <Input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Ihr Name" className="border-slate-200" />
                        <Input value={data.position} onChange={(e) => update("position", e.target.value)} placeholder="Position" />
                        <Input value={data.street} onChange={(e) => update("street", e.target.value)} placeholder="Straße & Hausnr." />
                        <Input value={data.city} onChange={(e) => update("city", e.target.value)} placeholder="PLZ & Ort" />
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-4">
                       <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Beschriftung</Label>
                       <div className="space-y-3">
                         <div className="space-y-1.5 text-xs">
                           <Label className="text-muted-foreground">Kontakt-Titel</Label>
                           <Input value={data.sectionTitles?.contact} onChange={(e) => update("sectionTitles", { ...data.sectionTitles, contact: e.target.value })} />
                         </div>
                         <div className="space-y-1.5 text-xs">
                           <Label className="text-muted-foreground">Anlagen-Titel</Label>
                           <Input value={data.sectionTitles?.anlagen} onChange={(e) => update("sectionTitles", { ...data.sectionTitles, anlagen: e.target.value })} />
                         </div>
                       </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="anlagen" className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Anlagen-Liste</Label>
                      <Button variant="ghost" size="sm" onClick={addAnlage} className="h-6 gap-1 px-2 text-[10px] text-primary hover:bg-primary/5">
                        <Plus size={12} /> Hinzufügen
                      </Button>
                    </div>
                    <div className="space-y-2">
                       {data.anlagen.map((anlage, idx) => (
                         <div key={idx} className="flex gap-2 group">
                            <Input value={anlage} onChange={(e) => updateAnlagen(idx, e.target.value)} className="bg-background/50 focus:bg-background transition-colors" />
                            <Button variant="ghost" size="icon" onClick={() => removeAnlage(idx)} className="opacity-0 transition-opacity group-hover:opacity-100 text-destructive h-9 w-9">
                              <Trash2 size={16} />
                            </Button>
                         </div>
                       ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
        </aside>

        {/* Live High-End Preview - Fixed for PDF consistency and Responsiveness */}
        <div className="lg:col-span-8 bg-[#525659] h-full overflow-y-auto">
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
              <DeckblattPreview 
                data={data} 
                onPhotoChange={(p) => update("photo", p)} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
