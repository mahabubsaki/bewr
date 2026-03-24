import type { AnschreibenData } from "../../data/defaultData";
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
import { Zap } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: AnschreibenData;
  update: (key: keyof AnschreibenData, value: unknown) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 group">
      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors group-focus-within:text-primary">
        {label}
      </Label>
      {children}
    </div>
  );
}

function SI(props: React.ComponentProps<typeof Input>) {
  return (
    <Input {...props} className={`h-11 rounded-xl border-border/60 bg-background focus-visible:border-rose-500/50 focus-visible:ring-rose-500/15 text-sm ${props.className ?? ""}`} />
  );
}

export default function FsjAnschreibenQuickEdit({ open, onOpenChange, data, update }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-xl overflow-hidden rounded-2xl border-none p-0 shadow-2xl sm:w-full">
        <div className="bg-linear-to-br from-rose-500/10 via-background to-background p-5 sm:p-7">
          <DialogHeader className="pb-5 text-left">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30">
                <Zap size={20} className="fill-white/20" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black tracking-tight">
                  FSJ Quick-Edit
                </DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-widest">
                  Neue FSJ-Bewerbung in Sekunden anlegen
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-4 max-h-[58vh] overflow-y-auto pb-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Ziel-Einrichtung">
                <SI
                  value={data.recipientCompany}
                  onChange={(e) => update("recipientCompany", e.target.value)}
                  placeholder="z.B. Kita Sonnenschein"
                />
              </Field>
              <Field label="Ansprechpartner">
                <SI
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
                  placeholder="z.B. Frau Müller"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Straße & Hausnr.">
                <SI value={data.recipientStreet} onChange={(e) => update("recipientStreet", e.target.value)} placeholder="z.B. Gartenweg 5" />
              </Field>
              <Field label="PLZ & Stadt">
                <SI value={data.recipientCity} onChange={(e) => update("recipientCity", e.target.value)} placeholder="z.B. 61250 Usingen" />
              </Field>
            </div>
            <Field label="FSJ-Stelle / Betreff">
              <SI value={data.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Bewerbung für ein FSJ…" className="font-bold italic" />
            </Field>
            <div className="rounded-xl border border-rose-200/60 bg-rose-50/60 p-3 text-xs text-rose-800/80 dark:bg-rose-950/20 dark:text-rose-300">
              💡 <strong>Tipp:</strong> Anrede wird automatisch gesetzt, wenn du
              „Frau Müller" oder „Herr Schmidt" eingibst.
            </div>
          </div>

          <DialogFooter className="mt-5 gap-2 border-t pt-5">
            <Button variant="ghost" className="rounded-full px-6" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button className="rounded-full px-8 shadow-lg shadow-rose-500/20" onClick={() => onOpenChange(false)}>
              Übernehmen
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
