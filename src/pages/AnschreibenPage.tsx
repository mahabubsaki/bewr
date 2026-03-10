import { useEffect, useState } from "react";
import PhotoUpload from "../components/PhotoUpload";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultAnschreiben } from "../data/defaultData";
import type { AnschreibenData } from "../data/defaultData";
import { Download, Zap, Layout, Settings, Eye, Building2, User, FileText, Calendar, Edit3, Save } from "lucide-react";
import { generateAnschreibenPdf } from "../utils/generatePdf";
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
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useNavigate } from "react-router-dom";
import AnschreibenPreview from "../components/AnschreibenPreview";

export default function AnschreibenPage() {
  const navigate = useNavigate();
  const [data, setData] = useLocalStorage<AnschreibenData>(
    "anschreiben",
    defaultAnschreiben,
  );

  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);

  // Ensure margins and paragraphs exist/are up to date (migration)
  useEffect(() => {
    let updated = false;
    const newData = { ...data };

    if (!data.margins) {
      newData.margins = defaultAnschreiben.margins;
      updated = true;
    }

    if (!data.paragraphs || data.paragraphs.length < 6) {
      const newParas = [...(data.paragraphs || [])];
      while (newParas.length < 6) {
        newParas.push(defaultAnschreiben.paragraphs[newParas.length]);
      }
      newData.paragraphs = newParas;
      updated = true;
    }

    if (updated) {
      setData(newData);
    }
  }, [data, setData]);

  const update = (key: keyof AnschreibenData, value: unknown) => {
    setData((prev: AnschreibenData) => ({ ...prev, [key]: value }));
  };

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...data.paragraphs];
    newParagraphs[index] = value;
    update("paragraphs", newParagraphs);
  };

  const SECTION_LABELS = [
    "📌 Einleitung",
    "🚀 Warum diese Stelle?",
    "🏢 Warum das Unternehmen?",
    "🎓 Qualifikationen",
    "💎 Ihr Benefit",
    "🤝 Abschluss",
  ];

  const handleDownload = async () => {
    const filename = formatFilename(data.senderName, "Anschreiben");
    await generateAnschreibenPdf(data, filename);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-0 bg-white/50 sticky top-16 z-20 backdrop-blur-sm -mx-4 lg:mx-0">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bewerbungsschreiben Editor</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Anschreiben</h1>
            <Badge variant="secondary" className="h-5 text-[10px] uppercase font-bold tracking-wider">Premium Layout</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsQuickEditOpen(true)} className="gap-2 border-primary/20 hover:bg-primary/5 transition-all shadow-sm">
            <Zap size={16} className="text-amber-500 fill-amber-500" /> 
            <span className="hidden sm:inline">Smart Edit</span>
          </Button>
          <MarginControls
            margins={data.margins || defaultAnschreiben.margins}
            onChange={(m) => update("margins", m)}
          />
          <Button onClick={handleDownload} className="gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} /> Export
          </Button>
        </div>
      </div>

      <div className="grid h-full lg:grid-cols-12 overflow-hidden bg-muted/30">
        {/* Editor Panel - Scrollable */}
        <div className="lg:col-span-5 h-[calc(100vh-10rem)] overflow-y-auto p-4 space-y-6 lg:border-r bg-background/50 backdrop-blur-sm shadow-inner">
          <Tabs defaultValue="content" className="w-full">
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b mb-6 shadow-sm -mx-4 px-4">
              <TabsList className="w-full grid grid-cols-3 h-12 p-1 bg-muted/30">
                <TabsTrigger value="content" className="gap-2 rounded-md transition-all">
                  <Edit3 size={15} /> Textinhalt
                </TabsTrigger>
                <TabsTrigger value="recipient" className="gap-2 rounded-md">
                   <Building2 size={15} /> Adresse
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2 rounded-md">
                   <Settings size={15} /> Details
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="content" className="space-y-6 flex-1 py-4">
               <Card className="border-none shadow-none bg-transparent">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <FileText size={14} className="text-primary" /> Betreff & Anrede
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-2 space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="subject" className="text-xs font-semibold">Betreffzeile</Label>
                        <Input id="subject" value={data.subject} onChange={(e) => update("subject", e.target.value)} className="bg-white/80 border-primary/10 transition-all focus:border-primary/40 focus:ring-primary/10 h-10 font-medium" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="salutation" className="text-xs font-semibold">Anredeformel</Label>
                        <Input id="salutation" value={data.salutation} onChange={(e) => update("salutation", e.target.value)} className="bg-white/80 border-primary/10 focus:border-primary/40 h-10" />
                      </div>
                    </div>
                  </CardContent>
               </Card>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Strukturierte Absätze</h3>
                   <div className="w-1/2 h-[1px] bg-muted/50" />
                </div>
                
                {data.paragraphs.map((para, i) => (
                  <div className="group relative" key={i}>
                    <div className="absolute -left-3 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-primary transition-all rounded-full" />
                    <div className="grid gap-2 hover:bg-muted/10 p-2 rounded-lg transition-colors">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-muted-foreground transition-all group-focus-within:text-primary uppercase tracking-tight">{SECTION_LABELS[i]}</Label>
                        <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">Block {i+1}</span>
                      </div>
                      <Textarea 
                        value={para} 
                        onChange={(e) => updateParagraph(i, e.target.value)} 
                        rows={4}
                        placeholder={`Schreiben Sie etwas über ${SECTION_LABELS[i].split(' ')[1]}...`}
                        className="resize-none focus-visible:ring-primary/20 bg-white shadow-sm border-primary/5 transition-all min-h-[120px]"
                      />
                    </div>
                  </div>
                ))}
              </div>

               <Card className="border-none shadow-none bg-transparent pt-6">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Save size={14} className="text-primary" /> Abschluss
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="closing" className="text-xs font-semibold">Grußformel</Label>
                        <Input id="closing" value={data.closing} onChange={(e) => update("closing", e.target.value)} className="bg-white border-primary/10 focus:border-primary/40 h-10" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nameClosing" className="text-xs font-semibold">Signatur Name</Label>
                        <Input id="nameClosing" value={data.senderNameClosing} onChange={(e) => update("senderNameClosing", e.target.value)} className="bg-white border-primary/10 focus:border-primary/40 h-10 font-semibold" />
                      </div>
                    </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="recipient" className="space-y-8 py-4">
              <ScrollArea className="h-[70vh] pr-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Building2 size={18} />
                    </div>
                    <h3 className="font-bold text-lg">Unternehmensdaten</h3>
                  </div>
                  <div className="grid gap-4 bg-muted/20 p-6 rounded-xl border border-border/50">
                    <div className="grid gap-2">
                      <Label className="text-xs font-bold opacity-60">FIRMA / ORGANISATION</Label>
                      <Input value={data.recipientCompany} onChange={(e) => update("recipientCompany", e.target.value)} className="bg-white" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-bold opacity-60">ABTEILUNG / ANSPRECHPARTNER</Label>
                      <Input value={data.recipientDepartment} onChange={(e) => update("recipientDepartment", e.target.value)} className="bg-white" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-bold opacity-60">STRASSE / NR</Label>
                      <Input value={data.recipientStreet} onChange={(e) => update("recipientStreet", e.target.value)} className="bg-white" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-bold opacity-60">PLZ / ORT</Label>
                      <Input value={data.recipientCity} onChange={(e) => update("recipientCity", e.target.value)} className="bg-white" />
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User size={18} />
                    </div>
                    <h3 className="font-bold text-lg">Persönliche Daten</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 bg-muted/20 p-6 rounded-xl border border-border/50">
                    <div className="grid gap-2 sm:col-span-2">
                      <Label className="text-xs font-bold opacity-60">VOLLER NAME</Label>
                      <Input value={data.senderName} onChange={(e) => update("senderName", e.target.value)} className="bg-white" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-bold opacity-60">STRASSE</Label>
                      <Input value={data.senderStreet} onChange={(e) => update("senderStreet", e.target.value)} className="bg-white" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-bold opacity-60">PLZ / ORT</Label>
                      <Input value={data.senderCity} onChange={(e) => update("senderCity", e.target.value)} className="bg-white" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-bold opacity-60">TELEFON</Label>
                      <Input value={data.senderPhone} onChange={(e) => update("senderPhone", e.target.value)} className="bg-white" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-bold opacity-60">E-MAIL</Label>
                      <Input value={data.senderEmail} onChange={(e) => update("senderEmail", e.target.value)} className="bg-white" />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8 py-4">
               <Card className="border-primary/5 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Calendar size={16} className="text-primary" /> Datum & Formalia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-xs">Ausstellungsdatum</Label>
                      <Input value={data.date} onChange={(e) => update("date", e.target.value)} />
                    </div>
                  </CardContent>
               </Card>

               <Card className="border-primary/5 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Edit3 size={16} className="text-primary" /> Unterschrift hochladen
                    </CardTitle>
                    <CardDescription className="text-[11px]">Empfohlen: PNG mit transparentem Hintergrund</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 border-2 border-dashed rounded-xl bg-white/50 flex flex-col items-center gap-4 group hover:border-primary/40 transition-all">
                      <PhotoUpload
                        photo={data.signature}
                        onPhotoChange={(v) => update("signature", v)}
                        width={250}
                        height={80}
                        label="Scannen oder hochladen"
                        className="bg-transparent border-none shadow-none"
                      />
                    </div>
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel - Fixed & Integrated Component */}
        {/* Live Preview Panel - Fixed Logic */}
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
              <AnschreibenPreview data={data} />
            </div>
          </div>
        </div>
      </div>

      {/* Improved Quick Edit Dialog */}
      <Dialog open={isQuickEditOpen} onOpenChange={setIsQuickEditOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
          <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6">
            <DialogHeader className="pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <Zap size={22} className="fill-white/20" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black tracking-tight underline decoration-primary/30 underline-offset-4">Smart Quick-Edit</DialogTitle>
                  <DialogDescription className="text-xs font-medium text-muted-foreground/80 mt-1 uppercase tracking-tight">
                    Neue Bewerbung in sekunden anlegen
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="grid gap-8 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2 group">
                  <Label className="text-[10px] items-center font-black text-muted-foreground group-focus-within:text-primary transition-all">TARGET COMPANY</Label>
                  <Input
                    value={data.recipientCompany}
                    onChange={(e) => update("recipientCompany", e.target.value)}
                    placeholder="z.B. Muster GmbH"
                    className="bg-white border-primary/5 focus:border-primary/40 focus:ring-primary/10 h-11"
                  />
                </div>
                <div className="grid gap-2 group">
                  <Label className="text-[10px] font-black text-muted-foreground group-focus-within:text-primary transition-all">CONTACT PERSON (AUTO-SALUTATION)</Label>
                  <Input
                    value={data.recipientDepartment}
                    onChange={(e) => {
                      const val = e.target.value;
                      update("recipientDepartment", val);
                      if (val.includes("Herr")) {
                        const name = val.split("Herr")[1]?.trim();
                        if (name) update("salutation", `Sehr geehrter Herr ${name},`);
                      } else if (val.includes("Frau")) {
                        const name = val.split("Frau")[1]?.trim();
                        if (name) update("salutation", `Sehr geehrte Frau ${name},`);
                      } else if (!val || val.toLowerCase().includes("personal")) {
                        update("salutation", "Sehr geehrte Damen und Herren,");
                      }
                    }}
                    placeholder="z.B. Herr Müller"
                    className="bg-white border-primary/5 focus:border-primary/40 focus:ring-primary/10 h-11"
                  />
                </div>
              </div>
              <div className="grid gap-2 group">
                <Label className="text-[10px] font-black text-muted-foreground group-focus-within:text-primary transition-all">JOB POSITION TITLE</Label>
                <Input
                  value={data.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="Bewerbung als..."
                  className="bg-white border-primary/5 focus:border-primary/40 focus:ring-primary/10 h-11 font-bold italic"
                />
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-primary/80 font-medium leading-relaxed">
                💡 <strong>Tipp:</strong> Die Anrede wird automatisch angepasst, wenn du "Herr Müller" oder "Frau Schmidt" eingibst.
              </div>
            </div>
            <DialogFooter className="pt-8 border-t mt-4 gap-3">
              <Button variant="ghost" onClick={() => setIsQuickEditOpen(false)} className="rounded-full px-6">Abbrechen</Button>
              <Button onClick={() => setIsQuickEditOpen(false)} className="rounded-full px-8 shadow-lg shadow-primary/20">Einstellungen übernehmen</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
