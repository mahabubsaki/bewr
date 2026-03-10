import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultDeckblatt } from "../data/defaultData";
import type { DeckblattData } from "../data/defaultData";
import { Download, Plus, Trash2, Sparkle } from "lucide-react";
import { generateDeckblattPdf } from "../utils/generatePdf";
import MarginControls from "../components/MarginControls";
import { formatFilename } from "../utils/dateUtils";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useNavigate } from "react-router-dom";
import DeckblattPreview from "../components/DeckblattPreview";
import PhotoUpload from "../components/PhotoUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "../components/ui/dialog";
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
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-30 flex flex-col gap-4 border-b bg-background/80 px-4 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
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

        <div className="flex items-center gap-2 sm:gap-3">
           <Dialog open={isSmartEditOpen} onOpenChange={setIsSmartEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none gap-2 border-primary/20 hover:bg-primary/5 shadow-sm">
                <Sparkle size={16} className="text-amber-500 animate-pulse" />
                <span>Smart Edit</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl sm:rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Quick Details</DialogTitle>
                <DialogDescription>Schnellbearbeitung Ihrer wichtigsten Informationen auf dem Deckblatt.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ihr Name</Label>
                    <Input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Max Mustermann" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Zielposition</Label>
                    <Input value={data.position} onChange={(e) => update("position", e.target.value)} placeholder="Fullstack Developer" className="h-11" />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">E-Mail</Label>
                    <Input value={data.email} onChange={(e) => update("email", e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Telefon</Label>
                    <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} className="h-11" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                 <Button onClick={() => setIsSmartEditOpen(false)} className="w-full sm:w-auto h-11 px-8 rounded-xl">Speichern</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Separator orientation="vertical" className="hidden sm:block h-8" />
          
          <MarginControls
            margins={data.margins || defaultDeckblatt.margins}
            onChange={(m) => update("margins", m)}
          />
          
          <Button onClick={handleDownload} className="flex-1 sm:flex-none gap-2 bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Download size={18} /> <span className="hidden sm:inline text-white">Export PDF</span>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden bg-muted/30 lg:rounded-2xl border-y lg:border shadow-inner">
        {/* Settings Sidebar - Scrollable */}
        <div className="lg:col-span-5 h-auto overflow-y-visible lg:overflow-y-auto border-t lg:border-t-0 lg:border-r bg-background/50 backdrop-blur-sm order-2 lg:order-1">
          <Tabs defaultValue="basis" className="w-full">
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b px-4">
              <TabsList className="w-full grid grid-cols-2 bg-muted/30 p-1 h-11">
                <TabsTrigger value="basis" className="gap-2 rounded-md text-xs">Basis-Infos</TabsTrigger>
                <TabsTrigger value="anlagen" className="gap-2 rounded-md text-xs">Anlagen-Liste</TabsTrigger>
              </TabsList>
            </div>

            <div className="px-4 py-6 space-y-8 pb-32">
                <TabsContent value="basis" className="m-0 space-y-8">
                  <div className="grid gap-6">
                    <Card className="border-none shadow-none bg-transparent">
                      <CardContent className="p-0 space-y-6">
                        <div className="space-y-4 p-5 rounded-2xl border bg-white/40 shadow-sm">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Titel & Position</Label>
                          <div className="grid gap-4">
                            <Input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Max Mustermann" className="h-11 bg-white border-slate-200" />
                            <Input value={data.position} onChange={(e) => update("position", e.target.value)} placeholder="Fullstack Developer" className="h-11 bg-white border-slate-200" />
                          </div>
                        </div>

                        <div className="space-y-4 p-5 rounded-2xl border bg-white/40 shadow-sm">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Profilbild / Foto</Label>
                          <div className="flex justify-center py-4">
                            <PhotoUpload
                              photo={data.photo}
                              onPhotoChange={(v) => update("photo", v)}
                              width={230}
                              height={300}
                              className="rounded-xl border-2 border-dashed border-slate-200 bg-white/50 hover:border-primary/40 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 p-5 rounded-2xl border bg-white/40 shadow-sm">
                          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Kontaktdaten</Label>
                          <div className="grid grid-cols-1 gap-4">
                            <Input value={data.street} onChange={(e) => update("street", e.target.value)} placeholder="Musterstraße 1" className="h-11 bg-white border-slate-200" />
                            <Input value={data.city} onChange={(e) => update("city", e.target.value)} placeholder="12345 Berlin" className="h-11 bg-white border-slate-200" />
                            <div className="grid grid-cols-2 gap-3">
                              <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Telefon" className="h-11 bg-white border-slate-200" />
                              <Input value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="E-Mail" className="h-11 bg-white border-slate-200" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="anlagen" className="m-0 space-y-6">
                  <div className="space-y-4 p-5 rounded-2xl border bg-white/40 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                       <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Dokument-Anlagen</Label>
                       <Button variant="ghost" size="sm" onClick={addAnlage} className="h-8 text-xs text-primary hover:bg-primary/5">
                        <Plus size={14} className="mr-1.5" /> Anlage hinzufügen
                       </Button>
                    </div>
                    <div className="space-y-2.5">
                      <AnimatePresence>
                        {data.anlagen.map((anlage, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center gap-2"
                          >
                             <Input 
                               value={anlage} 
                               onChange={(e) => updateAnlagen(idx, e.target.value)}
                               className="h-11 bg-white border-slate-200 flex-1"
                             />
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               onClick={() => removeAnlage(idx)}
                               className="h-11 w-11 text-destructive hover:bg-destructive/5 shrink-0"
                             >
                               <Trash2 size={16} />
                             </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Preview Panel - Matching LebenslaufPage structure */}
        <div className="lg:col-span-7 bg-[#525659] flex flex-col order-1 lg:order-2 border-b lg:border-b-0 shadow-inner overflow-hidden">
          <div className="sticky top-0 z-40 flex items-center justify-between px-4 lg:px-6 py-3 bg-black/50 backdrop-blur-md text-white/95 border-b border-white/10 shadow-xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden xs:inline">Live Preview</span><span className="xs:hidden">Live</span>
              </div>
              <span className="text-[10px] xs:text-xs font-medium text-white/40 border-l border-white/10 pl-3">A4 Preview</span>
            </div>
          </div>
          <div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="flex justify-center items-start py-8 sm:py-12 lg:py-16">
              <DeckblattPreview data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
