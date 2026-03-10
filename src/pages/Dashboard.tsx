import { useState } from "react";
import {
  Download,
  FileText,
  Mail,
  Layers,
  Upload,
  Package,
  Loader2,
  X,
  Database,
  Settings,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  defaultLebenslauf,
  defaultAnschreiben,
  defaultDeckblatt,
} from "../data/defaultData";
import type {
  CertificateFile,
  LebenslaufData,
  AnschreibenData,
  DeckblattData,
} from "../data/defaultData";
import PdfUploader from "../components/PdfUploader";
import {
  generateLebenslaufPdf,
  generateLebenslaufBlob,
  generateAnschreibenPdf,
  generateAnschreibenBlob,
  generateDeckblattPdf,
  generateDeckblattBlob,
} from "../utils/generatePdf";
import { mergePdfs, base64ToBlob } from "../utils/mergePdfs";
import { useNavigate } from "react-router-dom";
import { formatFilename } from "../utils/dateUtils";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useLocalStorage<CertificateFile[]>(
    "certificates",
    [],
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [isFirmaModalOpen, setIsFirmaModalOpen] = useState(false);
  const [firmaName, setFirmaName] = useState("");

  const hasLebenslauf = !!localStorage.getItem("lebenslauf");
  const hasAnschreiben = !!localStorage.getItem("anschreiben");
  const hasDeckblatt = !!localStorage.getItem("deckblatt");

  const downloadSingle = async (docId: string) => {
    setLoading(docId);
    try {
      if (docId === "lebenslauf") {
        const data = loadFromStorage<LebenslaufData>(
          "lebenslauf",
          defaultLebenslauf,
        );
        const filename = formatFilename(
          data.personalFields[0].value,
          "Lebenslauf",
        );
        await generateLebenslaufPdf(data, filename);
      } else if (docId === "anschreiben") {
        const data = loadFromStorage<AnschreibenData>(
          "anschreiben",
          defaultAnschreiben,
        );
        const filename = formatFilename(data.senderName, "Anschreiben");
        await generateAnschreibenPdf(data, filename);
      } else if (docId === "deckblatt") {
        const data = loadFromStorage<DeckblattData>(
          "deckblatt",
          defaultDeckblatt,
        );
        const filename = formatFilename(data.name, "Deckblatt");
        await generateDeckblattPdf(data, filename);
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Fehler beim Erstellen der PDF.");
    }
    setLoading(null);
  };

  const handleCombinedClick = () => {
    setIsFirmaModalOpen(true);
  };

  const downloadCombined = async () => {
    setIsFirmaModalOpen(false);
    setLoading("combined");
    try {
      const blobs: Blob[] = [];
      let candidateName = "Bewerbung";
      let position = "Fachinformatiker_AE";

      // Generate each document from stored data
      try {
        const deckData = loadFromStorage<DeckblattData>(
          "deckblatt",
          defaultDeckblatt,
        );
        candidateName = deckData.name;
        position = deckData.position;
        blobs.push(await generateDeckblattBlob(deckData));
      } catch {
        console.warn("Deckblatt generation failed, skipping");
      }

      try {
        const ansData = loadFromStorage<AnschreibenData>(
          "anschreiben",
          defaultAnschreiben,
        );
        if (!candidateName) candidateName = ansData.senderName;
        blobs.push(await generateAnschreibenBlob(ansData));
      } catch {
        console.warn("Anschreiben generation failed, skipping");
      }

      try {
        const lblData = loadFromStorage<LebenslaufData>(
          "lebenslauf",
          defaultLebenslauf,
        );
        if (!candidateName) candidateName = lblData.personalFields[0].value;
        blobs.push(await generateLebenslaufBlob(lblData));
      } catch {
        console.warn("Lebenslauf generation failed, skipping");
      }

      // Add certificates
      for (const cert of certificates) {
        try {
          const blob = await base64ToBlob(cert.data);
          blobs.push(blob);
        } catch {
          console.warn(`Certificate ${cert.name} could not be loaded`);
        }
      }

      if (blobs.length > 0) {
        const filename = formatFilename(
          candidateName,
          `Bewerbung_${position}`,
          firmaName,
        );
        await mergePdfs(blobs, filename);
      } else {
        alert("Keine Dokumente zum Zusammenfügen verfügbar.");
      }
    } catch (err) {
      console.error("Combined PDF failed:", err);
      alert("Fehler beim Erstellen der kombinierten PDF.");
    }
    setLoading(null);
  };

  const exportData = () => {
    const data: Record<string, unknown> = {};
    const keys = [
      "lebenslauf",
      "anschreiben",
      "deckblatt",
      "certificates",
      "lebenslauf-section-order",
      "lebenslauf-deleted-sections",
    ];

    keys.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val) {
        try {
          data[key] = JSON.parse(val);
        } catch {
          data[key] = val;
        }
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bewerbung_Daten_Backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (
          confirm(
            "Möchten Sie alle Daten überschreiben? Dies kann nicht rückgängig gemacht werden.",
          )
        ) {
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
          });
          window.location.reload();
        }
      } catch (err) {
        console.error("Import failed:", err);
        alert(
          "Fehler beim Importieren der Datei. Bitte stellen Sie sicher, dass es eine gültige JSON-Datei ist.",
        );
      }
    };
    reader.readAsText(file);
  };

  const resetToDefault = () => {
    if (
      confirm(
        "Möchten Sie alle Ihre Daten löschen und die Beispiel-Daten wiederherstellen? Dies kann nicht rückgängig gemacht werden!",
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="py-12 pb-10 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-4xl font-extrabold text-transparent">
          Bewerbung Manager
        </h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Bewerbungsunterlagen an einem Ort
        </p>
      </div>

      {/* Document Cards */}
      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        {[
          {
            id: "deckblatt",
            title: "Deckblatt",
            desc: "Titelseite Ihrer Bewerbung",
            icon: Layers,
            color: "text-blue-500 bg-blue-500/10",
            ready: hasDeckblatt,
            path: "/deckblatt"
          },
          {
            id: "anschreiben",
            title: "Anschreiben",
            desc: "Ihr Bewerbungsschreiben",
            icon: Mail,
            color: "text-emerald-500 bg-emerald-500/10",
            ready: hasAnschreiben,
            path: "/anschreiben"
          },
          {
            id: "lebenslauf",
            title: "Lebenslauf",
            desc: "Ihr tabellarischer Lebenslauf",
            icon: FileText,
            color: "text-amber-500 bg-amber-500/10",
            ready: hasLebenslauf,
            path: "/lebenslauf"
          },
        ].map((item) => (
          <Card
            key={item.id}
            className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
            onClick={() => navigate(item.path)}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`inline-flex items-center gap-1 text-xs font-medium ${item.ready ? "text-emerald-500" : "text-muted-foreground"}`}>
                {item.ready ? "✓ Bearbeitet" : "Standard"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-8">
        {/* Certificates Section */}
        <section>
          <div className="mb-4 flex items-center gap-2 px-1">
            <Upload size={20} className="text-primary" />
            <h2 className="text-xl font-semibold">Zeugnisse & Zertifikate</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <PdfUploader files={certificates} onChange={setCertificates} />
            </CardContent>
          </Card>
        </section>

        {/* Download Section */}
        <section>
          <div className="mb-4 flex items-center gap-2 px-1">
            <Package size={20} className="text-primary" />
            <h2 className="text-xl font-semibold">Downloads</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { id: "deckblatt", label: "Deckblatt", icon: Layers },
              { id: "anschreiben", label: "Anschreiben", icon: Mail },
              { id: "lebenslauf", label: "Lebenslauf", icon: FileText },
            ].map((doc) => (
              <Button
                key={doc.id}
                variant="outline"
                className="h-20 flex-col gap-1 border-dashed"
                onClick={() => downloadSingle(doc.id)}
                disabled={loading !== null}
              >
                {loading === doc.id ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <doc.icon size={20} />
                )}
                <span>{doc.label}</span>
              </Button>
            ))}
            <Button
              className="h-20 flex-col gap-1 bg-primary/90 text-primary-foreground hover:bg-primary"
              onClick={handleCombinedClick}
              disabled={loading !== null}
            >
              {loading === "combined" ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Download size={20} />
              )}
              <div className="flex flex-col items-center">
                <span>Komplette Bewerbung</span>
                <span className="text-[10px] opacity-70">Alles in einem PDF</span>
              </div>
            </Button>
          </div>
        </section>

        <Separator />

        {/* Data Management Section */}
        <section>
          <div className="mb-4 flex items-center gap-2 px-1">
            <Database size={20} className="text-muted-foreground" />
            <h2 className="text-xl font-semibold">Daten-Verwaltung</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-muted/30">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex gap-4">
                  <ShieldCheck size={24} className="text-primary" />
                  <div>
                    <h4 className="font-medium">Exportieren</h4>
                    <p className="text-xs text-muted-foreground">Sichern Sie Ihre Eingaben</p>
                  </div>
                </div>
                <Button size="sm" onClick={exportData}>Backup</Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex gap-4">
                  <Settings size={24} className="text-primary" />
                  <div>
                    <h4 className="font-medium">Importieren</h4>
                    <p className="text-xs text-muted-foreground">Backup wiederherstellen</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    Einspielen
                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                  </label>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5 sm:col-span-2 lg:col-span-1">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex gap-4">
                  <Trash2 size={24} className="text-destructive" />
                  <div>
                    <h4 className="font-medium">Zurücksetzen</h4>
                    <p className="text-xs text-muted-foreground">Löscht alle Ihre Daten</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={resetToDefault}>Reset</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Dialog open={isFirmaModalOpen} onOpenChange={setIsFirmaModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kombinierte PDF erstellen</DialogTitle>
            <DialogDescription>
              Für welche Firma ist diese Bewerbung? Dies wird im Dateinamen verwendet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="firma">Firma Name (optional)</Label>
              <Input
                id="firma"
                placeholder="z.B. Google, Siemens, etc."
                value={firmaName}
                onChange={(e) => setFirmaName(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && downloadCombined()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFirmaModalOpen(false)}>Abbrechen</Button>
            <Button onClick={downloadCombined}>PDF Generieren</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
