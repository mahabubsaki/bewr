import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  createVariation,
  getActiveVariation,
} from "../../lib/variationManager";
import { toast } from "sonner";

interface Props {
  /** Optional button class override */
  className?: string;
}

export default function CopyPresetDialog({ className }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleOpen = () => {
    const active = getActiveVariation();
    setName(`${active.name} Kopie`);
    setOpen(true);
  };

  const handleConfirm = () => {
    const active = getActiveVariation();
    const trimmed = name.trim();
    const nextName = trimmed || `${active.name} Kopie`;

    createVariation(nextName, {
      sourceVariationId: active.id,
      switchToNew: true,
    });
    toast.success(`Preset "${nextName}" wurde erstellt.`);
    setOpen(false);
    setName("");
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={className ?? "gap-2 border-border/60"}
        onClick={handleOpen}
        title="Preset kopieren"
      >
        <Copy size={14} />
        <span className="hidden sm:inline">Preset kopieren</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Copy size={18} />
              </div>
              <div>
                <DialogTitle className="text-base font-black">Preset kopieren</DialogTitle>
                <DialogDescription className="text-[11px]">
                  Das aktive Preset wird komplett kopiert, inklusive Lebenslauf, Anschreiben, Deckblatt und Preset-Einstellungen.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Name des neuen Presets
            </Label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              placeholder="z.B. Frontend Entwickler"
              className="h-10 rounded-xl"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleConfirm}>
              <Copy size={14} className="mr-1.5" />
              Kopieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
