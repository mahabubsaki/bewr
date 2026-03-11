import { motion, AnimatePresence } from "framer-motion";
import type { DeckblattData } from "../../data/defaultData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Plus, Trash2, User, Layers, Phone, Mail, MapPin, Camera, List } from "lucide-react";
import PhotoUpload from "../PhotoUpload";

interface Props {
  data: DeckblattData;
  update: (key: keyof DeckblattData, value: unknown) => void;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

function SectionHeader({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
        {icon}
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-indigo-600/80">
        {label}
      </span>
      <div className="flex-1 h-px bg-indigo-500/10" />
    </div>
  );
}

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-indigo-500/20 transition-all duration-200"
    >
      {children}
    </motion.div>
  );
}

function Field({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
      </Label>
      {children}
    </div>
  );
}

function StyledInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className={`h-11 rounded-xl border-border/60 bg-background/80 transition-all focus-visible:border-indigo-500/60 focus-visible:ring-2 focus-visible:ring-indigo-500/15 ${props.className ?? ""}`}
    />
  );
}

export default function DeckblattEditorPanel({ data, update }: Props) {
  const updateAnlagen = (index: number, value: string) => {
    const next = [...data.anlagen];
    next[index] = value;
    update("anlagen", next);
  };

  const addAnlage = () => update("anlagen", [...data.anlagen, "Neues Dokument"]);

  const removeAnlage = (index: number) =>
    update("anlagen", data.anlagen.filter((_, i) => i !== index));

  return (
    <div className="order-2 flex h-auto flex-col overflow-y-visible border-t bg-background/50 backdrop-blur-sm lg:col-span-5 lg:order-1 lg:h-full lg:overflow-y-auto lg:border-t-0 lg:border-r">
      <Tabs defaultValue="basis" className="flex flex-1 flex-col">

        {/* ── Sticky Tab Bar ── */}
        <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-md">
          <div className="px-4 py-3">
            <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl bg-muted/50 p-1 gap-1">
              {[
                { value: "basis", icon: <User size={13} />, label: "Basis-Infos" },
                { value: "anlagen", icon: <List size={13} />, label: "Anlagen" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 rounded-lg py-2 text-[11px] font-bold uppercase tracking-wide transition-all data-[state=active]:bg-background data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="flex-1 px-4 py-5 pb-32">
          <AnimatePresence mode="wait">

            {/* ── Basis Tab ─────────────────────────────────── */}
            <TabsContent value="basis" className="m-0">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">

                {/* Name & Position */}
                <FieldCard>
                  <div className="p-5">
                    <SectionHeader label="Identität & Zielposition" icon={<Layers size={13} />} />
                    <div className="space-y-3">
                      <Field label="Vollständiger Name" icon={<User size={11} />}>
                        <StyledInput
                          value={data.personal.name}
                          onChange={(e) => update("personal", { ...data.personal, name: e.target.value })}
                          placeholder="Max Mustermann"
                        />
                      </Field>
                      <Field label="Zielposition / Bewerbung als" icon={<Layers size={11} />}>
                        <StyledInput
                          value={data.position}
                          onChange={(e) => update("position", e.target.value)}
                          placeholder="Fullstack Developer"
                          className="font-semibold italic"
                        />
                      </Field>
                    </div>
                  </div>
                </FieldCard>

                {/* Photo */}
                <FieldCard>
                  <div className="p-5">
                    <SectionHeader label="Profilbild" icon={<Camera size={13} />} />
                    <div className="flex justify-center py-2">
                      <div className="relative">
                        <PhotoUpload
                          photo={data.personal.photo}
                          onPhotoChange={(v) => update("personal", { ...data.personal, photo: v })}
                          width={200}
                          height={260}
                          className="rounded-2xl border-2 border-dashed border-indigo-500/30 bg-indigo-500/3 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5"
                        />
                        {!data.personal.photo && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15">
                              <Camera size={18} className="text-indigo-500/60" />
                            </div>
                            <p className="text-[11px] font-medium text-muted-foreground/60">
                              Bild hochladen
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </FieldCard>

                {/* Contact */}
                <FieldCard>
                  <div className="p-5">
                    <SectionHeader label="Kontaktdaten" icon={<Phone size={13} />} />
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Straße & Nr." icon={<MapPin size={11} />}>
                          <StyledInput
                            value={data.personal.street}
                            onChange={(e) => update("personal", { ...data.personal, street: e.target.value })}
                            placeholder="Musterstraße 1"
                          />
                        </Field>
                        <Field label="PLZ & Stadt" icon={<MapPin size={11} />}>
                          <StyledInput
                            value={data.personal.city}
                            onChange={(e) => update("personal", { ...data.personal, city: e.target.value })}
                            placeholder="12345 Berlin"
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Telefon" icon={<Phone size={11} />}>
                          <StyledInput
                            value={data.personal.phone}
                            onChange={(e) => update("personal", { ...data.personal, phone: e.target.value })}
                            placeholder="+49 …"
                          />
                        </Field>
                        <Field label="E-Mail" icon={<Mail size={11} />}>
                          <StyledInput
                            value={data.personal.email}
                            onChange={(e) => update("personal", { ...data.personal, email: e.target.value })}
                            placeholder="max@mail.de"
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                </FieldCard>
              </motion.div>
            </TabsContent>

            {/* ── Anlagen Tab ───────────────────────────────── */}
            <TabsContent value="anlagen" className="m-0">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                <FieldCard>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <SectionHeader label="Dokument-Anlagen" icon={<List size={13} />} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addAnlage}
                        className="h-8 -mt-5 gap-1.5 rounded-lg text-[11px] font-bold text-indigo-600 hover:bg-indigo-500/8 hover:text-indigo-700"
                      >
                        <Plus size={12} />
                        Hinzufügen
                      </Button>
                    </div>

                    {data.anlagen.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-3 py-10 text-center"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                          <List size={20} className="text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Keine Anlagen</p>
                          <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                            Klicke auf „Hinzufügen" um Dokumente einzutragen
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addAnlage}
                          className="mt-1 border-indigo-500/30 text-indigo-600 hover:bg-indigo-500/8"
                        >
                          <Plus size={13} className="mr-1.5" />
                          Erste Anlage hinzufügen
                        </Button>
                      </motion.div>
                    )}

                    <div className="space-y-2.5">
                      <AnimatePresence>
                        {data.anlagen.map((anlage, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 group"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-[11px] font-black text-indigo-600">
                              {idx + 1}
                            </div>
                            <StyledInput
                              value={anlage}
                              onChange={(e) => updateAnlagen(idx, e.target.value)}
                              className="flex-1 h-10"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAnlage(idx)}
                              className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </FieldCard>
              </motion.div>
            </TabsContent>

          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
