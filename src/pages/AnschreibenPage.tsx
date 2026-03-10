import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultAnschreiben } from "../data/defaultData";
import type { AnschreibenData } from "../data/defaultData";
import { Download, Zap, Settings, Building2, FileText, Edit3 } from "lucide-react";
import { generateAnschreibenPdf } from "../utils/generatePdf";
import MarginControls from "../components/MarginControls";
import { formatFilename } from "../utils/dateUtils";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import { useNavigate } from "react-router-dom";
import AnschreibenPreview from "../components/AnschreibenPreview";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";

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
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10">
      {/* Header Section */}
      <div className="sticky top-0 z-30 flex flex-col gap-4 border-b bg-background/80 px-4 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <Breadcrumb className="hidden sm:inline-flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Anschreiben Premium</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Bewerbungsschreiben</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary-foreground pointer-events-none uppercase text-[10px] font-bold">Premium UI</Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" onClick={() => setIsQuickEditOpen(true)} className="flex-1 sm:flex-none gap-2 border-primary/20 hover:bg-primary/5 transition-all shadow-sm">
            <Zap size={16} className="text-amber-500 fill-amber-500" /> 
            <span>Smart Edit</span>
          </Button>
          <MarginControls
            margins={data.margins || defaultAnschreiben.margins}
            onChange={(m) => update("margins", m)}
          />
          <Button onClick={handleDownload} className="flex-1 sm:flex-none gap-2 bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Download size={18} /> <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden bg-muted/30 lg:rounded-2xl border-y lg:border shadow-inner">
        {/* Editor Panel - Scrollable */}
        <div className="lg:col-span-5 h-auto overflow-y-visible lg:overflow-y-auto border-t lg:border-t-0 lg:border-r bg-background/50 backdrop-blur-sm order-2 lg:order-1">
          <Tabs defaultValue="content" className="w-full">
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b px-4">
              <TabsList className="w-full grid grid-cols-3 h-11 p-1 bg-muted/30">
                <TabsTrigger value="content" className="gap-2 rounded-md transition-all text-xs">
                  <Edit3 size={14} /> Text
                </TabsTrigger>
                <TabsTrigger value="recipient" className="gap-2 rounded-md text-xs">
                   <Building2 size={14} /> Adresse
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2 rounded-md text-xs">
                   <Settings size={14} /> Details
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="px-4 py-6 space-y-8 pb-32">
                <TabsContent value="content" className="m-0 space-y-6">
                  <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0 pt-0 pb-4">
                      <CardTitle className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 flex items-center gap-2">
                        <FileText size={13} className="text-primary/70" /> Betreff & Anrede
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-2 space-y-5">
                      <div className="grid gap-5">
                        <div className="grid gap-2">
                          <Label htmlFor="subject" className="text-xs font-semibold text-slate-700">Betreffzeile</Label>
                          <Input id="subject" value={data.subject} onChange={(e) => update("subject", e.target.value)} className="bg-white/80 border-primary/10 transition-all focus:border-primary/40 focus:ring-primary/10 h-11 font-medium text-sm" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="salutation" className="text-xs font-semibold text-slate-700">Anredeformel</Label>
                          <Input id="salutation" value={data.salutation} onChange={(e) => update("salutation", e.target.value)} className="bg-white/80 border-primary/10 transition-all focus:border-primary/40 focus:ring-primary/10 h-11 text-sm" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Separator className="bg-slate-200" />

                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Edit3 size={13} className="text-primary/70" />
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">InhaltsparaGraphen</h3>
                    </div>
                    {data.paragraphs.map((para, i) => (
                      <div key={i} className="group relative grid gap-2.5 p-4 rounded-xl border border-primary/5 bg-white/40 hover:bg-white/70 transition-all">
                        <Label className="text-[10px] font-bold uppercase text-primary/60 tracking-wider">
                          {SECTION_LABELS[i]}
                        </Label>
                        <Textarea
                          value={para}
                          onChange={(e) => updateParagraph(i, e.target.value)}
                          className="min-h-[140px] resize-none bg-transparent border-none focus-visible:ring-0 p-0 text-[13px] leading-relaxed text-slate-700"
                          placeholder="Ihr Text hier..."
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="recipient" className="m-0 space-y-8">
                  <div className="grid gap-6">
                    <div className="grid gap-4 p-5 rounded-2xl border bg-white/40 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 size={13} className="text-primary/70" />
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Empfänger</h3>
                      </div>
                      <div className="grid gap-4">
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase">Firma</Label>
                          <Input value={data.recipientCompany} onChange={(e) => update("recipientCompany", e.target.value)} className="bg-white h-10 border-slate-200" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase">Abteilung (Optional)</Label>
                          <Input value={data.recipientDepartment} onChange={(e) => update("recipientDepartment", e.target.value)} className="bg-white h-10 border-slate-200" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase">Straße & Hausnr.</Label>
                          <Input value={data.recipientStreet} onChange={(e) => update("recipientStreet", e.target.value)} className="bg-white h-10 border-slate-200" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase">PLZ & Ort</Label>
                          <Input value={data.recipientCity} onChange={(e) => update("recipientCity", e.target.value)} className="bg-white h-10 border-slate-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="m-0">
                  <div className="grid gap-6">
                    <div className="grid gap-4 p-5 rounded-2xl border bg-white/40 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings size={13} className="text-primary/70" />
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Dokument-Details</h3>
                      </div>
                      <div className="grid gap-4">
                         <div className="grid gap-1.5">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase">Abschlussfloskel</Label>
                          <Input value={data.closing} onChange={(e) => update("closing", e.target.value)} className="bg-white h-10 border-slate-200" />
                        </div>
                        <div className="grid gap-1.5">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase">Datum</Label>
                          <Input value={data.date} onChange={(e) => update("date", e.target.value)} className="bg-white h-10 border-slate-200" />
                        </div>
                      </div>
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
              <AnschreibenPreview data={data} />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isQuickEditOpen} onOpenChange={setIsQuickEditOpen}>
        <DialogContent className="w-[95vw] max-w-xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl sm:w-full">
          <div className="bg-gradient-to-br from-primary/10 via-background to-background p-4 sm:p-6">
            <DialogHeader className="pb-4 sm:pb-6 text-left">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <Zap size={22} className="fill-white/20" />
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-xl font-black tracking-tight underline decoration-primary/30 underline-offset-4 line-clamp-1">Smart Quick-Edit</DialogTitle>
                  <DialogDescription className="text-[10px] sm:text-xs font-medium text-muted-foreground/80 mt-1 uppercase tracking-tight">
                    Neue Bewerbung in sekunden anlegen
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="grid gap-4 sm:gap-8 py-2 max-h-[60vh] overflow-y-auto px-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2 group">
                   <Label className="text-[10px] items-center font-black text-muted-foreground group-focus-within:text-primary transition-all uppercase tracking-widest">Target Company</Label>
                  <Input
                    value={data.recipientCompany}
                    onChange={(e) => update("recipientCompany", e.target.value)}
                    placeholder="z.B. Muster GmbH"
                    className="bg-white border-primary/5 focus:border-primary/40 focus:ring-primary/10 h-10 sm:h-11 text-sm"
                  />
                </div>
                <div className="grid gap-2 group">
                  <Label className="text-[10px] font-black text-muted-foreground group-focus-within:text-primary transition-all uppercase tracking-widest">Contact Person</Label>
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
                    className="bg-white border-primary/5 focus:border-primary/40 focus:ring-primary/10 h-10 sm:h-11 text-sm"
                  />
                </div>
              </div>
              <div className="grid gap-2 group">
                <Label className="text-[10px] font-black text-muted-foreground group-focus-within:text-primary transition-all uppercase tracking-widest">Job Position Title</Label>
                <Input
                  value={data.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="Bewerbung als..."
                  className="bg-white border-primary/5 focus:border-primary/40 focus:ring-primary/10 h-10 sm:h-11 font-bold italic text-sm"
                />
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10 text-[11px] sm:text-xs text-primary/80 font-medium leading-relaxed">
                💡 <strong>Tipp:</strong> Die Anrede wird automatisch angepasst, wenn du "Herr Müller" oder "Frau Schmidt" eingibst.
              </div>
            </div>
            <DialogFooter className="pt-6 sm:pt-8 border-t mt-4 gap-2 sm:gap-3 flex-col sm:flex-row">
              <Button variant="ghost" onClick={() => setIsQuickEditOpen(false)} className="rounded-full px-6 w-full sm:w-auto h-10 sm:h-auto">Abbrechen</Button>
              <Button onClick={() => setIsQuickEditOpen(false)} className="rounded-full px-8 shadow-lg shadow-primary/20 w-full sm:w-auto h-10 sm:h-auto">Einstellungen übernehmen</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
