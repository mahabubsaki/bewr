import { useEffect, useMemo, useState } from "react";
import { CopyPlus, Layers3, Pencil, Plus, Trash2 } from "lucide-react";
import {
  ACTIVE_VARIATION_STORAGE_KEY,
  VARIATION_CHANGED_EVENT,
  VARIATIONS_UPDATED_EVENT,
  createVariation,
  deleteVariation,
  ensureVariationSystem,
  renameVariation,
  setActiveVariationId,
} from "../../lib/variationManager";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function VariationManager() {
  const [state, setState] = useState(() => ensureVariationSystem());
  const [newVariationName, setNewVariationName] = useState("");
  const [renameDraftById, setRenameDraftById] = useState<Record<string, string>>({});

  const activeVariation = useMemo(
    () => state.variations.find((item) => item.id === state.activeVariationId),
    [state.activeVariationId, state.variations],
  );

  const renameValue = activeVariation
    ? (renameDraftById[activeVariation.id] ?? activeVariation.name)
    : "";

  const canDelete = state.variations.length > 1;

  useEffect(() => {
    const refresh = () => setState(ensureVariationSystem());

    const onStorage = (event: StorageEvent) => {
      if (event.key === ACTIVE_VARIATION_STORAGE_KEY) {
        refresh();
      }
    };

    window.addEventListener(VARIATION_CHANGED_EVENT, refresh as EventListener);
    window.addEventListener(VARIATIONS_UPDATED_EVENT, refresh as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(VARIATION_CHANGED_EVENT, refresh as EventListener);
      window.removeEventListener(VARIATIONS_UPDATED_EVENT, refresh as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleCreateBlank = () => {
    createVariation(newVariationName, { switchToNew: true });
    setNewVariationName("");
  };

  const handleDuplicateCurrent = () => {
    if (!activeVariation) return;
    createVariation(
      newVariationName || `${activeVariation.name} Kopie`,
      { sourceVariationId: activeVariation.id, switchToNew: true },
    );
    setNewVariationName("");
  };

  const handleRename = () => {
    if (!activeVariation) return;
    renameVariation(activeVariation.id, renameValue);
    setRenameDraftById((prev) => {
      const next = { ...prev };
      delete next[activeVariation.id];
      return next;
    });
  };

  const handleDelete = () => {
    if (!activeVariation || !canDelete) return;
    const approved = confirm(
      `Variation "${activeVariation.name}" loeschen? Alle zugehoerigen Dokumentdaten werden entfernt.`,
    );
    if (!approved) return;
    deleteVariation(activeVariation.id);
  };

  return (
    <section className="mb-8 rounded-2xl border border-border/70 bg-card p-4 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Layers3 size={14} className="text-primary" />
        </div>
        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Variationen / Rollen
        </h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Aktive Variation
          </Label>
          <Select
            value={state.activeVariationId}
            onValueChange={(next) => setActiveVariationId(next)}
          >
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Variation waehlen" />
            </SelectTrigger>
            <SelectContent>
              {state.variations.map((variation) => (
                <SelectItem key={variation.id} value={variation.id}>
                  {variation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Aktive Variation umbenennen
          </Label>
          <div className="flex gap-2">
            <Input
              value={renameValue}
              onChange={(event) => {
                if (!activeVariation) return;
                setRenameDraftById((prev) => ({
                  ...prev,
                  [activeVariation.id]: event.target.value,
                }));
              }}
              placeholder="Neuer Name"
              className="h-10 rounded-xl"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 rounded-xl px-3"
              onClick={handleRename}
            >
              <Pencil size={14} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 rounded-xl px-3 text-destructive"
              onClick={handleDelete}
              disabled={!canDelete}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Neue Variation erstellen
          </Label>
          <Input
            value={newVariationName}
            onChange={(event) => setNewVariationName(event.target.value)}
            placeholder="z.B. Frontend Entwickler"
            className="h-10 rounded-xl"
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" className="h-9 flex-1 rounded-xl" onClick={handleCreateBlank}>
              <Plus size={14} className="mr-1" /> Neu
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 flex-1 rounded-xl"
              onClick={handleDuplicateCurrent}
            >
              <CopyPlus size={14} className="mr-1" /> Duplizieren
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
