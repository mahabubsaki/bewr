import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  firmaName: string;
  onFirmaNameChange: (v: string) => void;
  onConfirm: () => void;
  docLabel?: string; // e.g. "Anschreiben"
}

export default function FirmaModal({
  open,
  onOpenChange,
  firmaName,
  onFirmaNameChange,
  onConfirm,
  docLabel = "Dokument",
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {docLabel} exportieren
          </DialogTitle>
          <DialogDescription>
            Für welche Firma ist diese Bewerbung? Der Firmenname wird im
            Dateinamen verwendet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="firma-input">
              Firma <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="firma-input"
              placeholder="z.B. Google, Siemens, BMW…"
              value={firmaName}
              onChange={(e) => onFirmaNameChange(e.target.value)}
              autoFocus
              className="h-11 rounded-xl"
              onKeyDown={(e) => e.key === "Enter" && onConfirm()}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Abbrechen
          </Button>
          <Button className="rounded-xl px-6" onClick={onConfirm}>
            PDF generieren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
