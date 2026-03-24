import { motion, AnimatePresence } from "framer-motion";
import type { AnschreibenData } from "../../data/defaultData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Edit3, User, Building2, Settings, RefreshCw, FileText, Phone, Mail, MapPin, AlignLeft, Minus, Plus, Type } from "lucide-react";

const SECTION_LABELS = [
  { emoji: "📌", label: "Einleitung", hint: "Warum bewerbe ich mich? Erster Eindruck" },
  { emoji: "🏢", label: "Warum diese Einrichtung?", hint: "Was gefällt mir an dem Kindergarten/der Schule?" },
  { emoji: "🎓", label: "Erfahrungen & Fähigkeiten", hint: "Praktikum, Babysitten, Nachhilfe, kreative Hobbys" },
  { emoji: "💎", label: "Persönliche Stärken", hint: "Soft Skills und Vereinserfahrungen" },
  { emoji: "💚", label: "Motivation für FSJ", hint: "Warum möchte ich mich sozial engagieren?" },
  { emoji: "🤝", label: "Abschluss", hint: "Zeitraum der Verfügbarkeit & Verabschiedung" },
];

interface Props {
  data: AnschreibenData;
  update: (key: keyof AnschreibenData, value: unknown) => void;
  updateParagraph: (index: number, value: string) => void;
  onSyncFromDeckblatt: () => void;
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
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
        {icon}
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-rose-600/80">
        {label}
      </span>
      <div className="flex-1 h-px bg-rose-500/10" />
    </div>
  );
}

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-rose-500/20 transition-all duration-200"
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
      className={`h-11 rounded-xl border-border/60 bg-background/80 transition-all focus-visible:border-rose-500/60 focus-visible:ring-2 focus-visible:ring-rose-500/15 ${props.className ?? ""}`}
    />
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const pct = Math.min(len / max, 1);
  const color =
    pct > 0.9
      ? "text-red-500"
      : pct > 0.7
        ? "text-amber-500"
        : "text-muted-foreground/40";
  return (
    <span className={`text-[10px] tabular-nums ${color}`}>
      {len}/{max}
    </span>
  );
}

export default function FsjAnschreibenEditorPanel({
  data,
  update,
  updateParagraph,
  onSyncFromDeckblatt,
}: Props) {
  const fontSize = data.fontSize ?? 10;
  const clampFontSize = (value: number) => Math.min(12, Math.max(9, value));
  const updateFontSize = (value: number) => update("fontSize", clampFontSize(value));
  const paragraphSpacing = data.paragraphSpacing ?? 10;
  const clampParagraphSpacing = (value: number) => Math.min(20, Math.max(6, value));
  const updateParagraphSpacing = (value: number) =>
    update("paragraphSpacing", clampParagraphSpacing(value));

  return (
    <div className="order-2 flex h-auto flex-col overflow-y-visible border-t bg-background/50 backdrop-blur-sm lg:col-span-5 lg:order-1 lg:h-full lg:overflow-y-auto lg:border-t-0 lg:border-r">
      <Tabs defaultValue="content" className="flex flex-1 flex-col">

        {/* ── Sticky Tab Bar ── */}
        <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-md">
          <div className="px-4 py-3">
            <TabsList className="grid h-12 w-full grid-cols-4 rounded-xl bg-muted/50 p-1 gap-1">
              {[
                { value: "content", icon: <Edit3 size={13} />, label: "Text" },
                { value: "sender", icon: <User size={13} />, label: "Absender" },
                { value: "recipient", icon: <Building2 size={13} />, label: "Empfänger" },
                { value: "settings", icon: <Settings size={13} />, label: "Details" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col gap-0.5 rounded-lg py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all data-[state=active]:bg-background data-[state=active]:text-rose-600 data-[state=active]:shadow-sm"
                >
                  {tab.icon}
                  <span className="hidden sm:block">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="flex-1 px-4 py-5 pb-32">
          <AnimatePresence>

            {/* ── Text Tab ── */}
            <TabsContent key="content" value="content" className="m-0">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                <FieldCard>
                  <div className="p-5">
                    <SectionHeader label="Betreff & Anrede" icon={<FileText size={13} />} />
                    <div className="space-y-3">
                      <Field label="Betreffzeile" icon={<FileText size={11} />}>
                        <StyledInput
                          value={data.subject}
                          onChange={(e) => update("subject", e.target.value)}
                          placeholder="Bewerbung für ein FSJ…"
                          className="font-semibold"
                        />
                      </Field>
                      <Field label="Anredeformel" icon={<Mail size={11} />}>
                        <StyledInput
                          value={data.salutation}
                          onChange={(e) => update("salutation", e.target.value)}
                          placeholder="Sehr geehrte Damen und Herren,"
                        />
                      </Field>
                    </div>
                  </div>
                </FieldCard>

                <div className="flex items-center gap-3 px-1 py-1">
                  <div className="h-px flex-1 bg-border/40" />
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    <AlignLeft size={10} /> Brieftext
                  </span>
                  <div className="h-px flex-1 bg-border/40" />
                </div>

                {data.paragraphs.map((para, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="group relative rounded-2xl border border-border/40 bg-card transition-all duration-200 hover:border-rose-500/30 hover:shadow-md hover:shadow-rose-500/5"
                  >
                    <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-rose-500/25 group-hover:bg-rose-500/55 transition-colors" />
                    <div className="p-4 pl-5">
                      <div className="mb-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10 text-[11px] font-black text-rose-600">
                            {i + 1}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-600/70">
                            {SECTION_LABELS[i]?.label}
                          </span>
                        </div>
                        <span className="text-base">{SECTION_LABELS[i]?.emoji}</span>
                      </div>
                      <p className="mb-2.5 text-[11px] italic text-muted-foreground/55">
                        {SECTION_LABELS[i]?.hint}
                      </p>
                      <Textarea
                        value={para}
                        onChange={(e) => updateParagraph(i, e.target.value)}
                        className="min-h-[120px] resize-none border-none bg-transparent p-0 text-[13px] leading-relaxed focus-visible:ring-0"
                        placeholder="Ihr Text hier…"
                      />
                      <div className="mt-2 flex justify-end">
                        <CharCount value={para} max={400} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* ── Sender Tab ── */}
            <TabsContent key="sender" value="sender" className="m-0">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                <FieldCard>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <SectionHeader label="Absender-Daten" icon={<User size={13} />} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onSyncFromDeckblatt}
                        className="h-8 -mt-5 gap-1.5 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-500/8 hover:text-rose-700"
                      >
                        <RefreshCw size={12} />
                        Sync Deckblatt
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <Field label="Vor- & Nachname" icon={<User size={11} />}>
                        <StyledInput
                          value={data.sender.name}
                          onChange={(e) => update("sender", { ...data.sender, name: e.target.value })}
                          placeholder="Lena Wagner"
                        />
                      </Field>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Straße & Nr." icon={<MapPin size={11} />}>
                          <StyledInput
                            value={data.sender.street}
                            onChange={(e) => update("sender", { ...data.sender, street: e.target.value })}
                            placeholder="Am Stadtrand 12"
                          />
                        </Field>
                        <Field label="PLZ & Stadt" icon={<MapPin size={11} />}>
                          <StyledInput
                            value={data.sender.city}
                            onChange={(e) => update("sender", { ...data.sender, city: e.target.value })}
                            placeholder="61250 Usingen"
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Telefon" icon={<Phone size={11} />}>
                          <StyledInput
                            value={data.sender.phone}
                            onChange={(e) => update("sender", { ...data.sender, phone: e.target.value })}
                            placeholder="0177 …"
                          />
                        </Field>
                        <Field label="E-Mail" icon={<Mail size={11} />}>
                          <StyledInput
                            value={data.sender.email}
                            onChange={(e) => update("sender", { ...data.sender, email: e.target.value })}
                            placeholder="beispiel@mail.de"
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                </FieldCard>
                <FieldCard>
                  <div className="p-5">
                    <SectionHeader label="Abschluss" icon={<Edit3 size={13} />} />
                    <Field label="Name im Abschluss" icon={<User size={11} />}>
                      <StyledInput
                        value={data.senderNameClosing}
                        onChange={(e) => update("senderNameClosing", e.target.value)}
                        placeholder="Lena Wagner"
                      />
                    </Field>
                  </div>
                </FieldCard>
              </motion.div>
            </TabsContent>

            {/* ── Recipient Tab ── */}
            <TabsContent key="recipient" value="recipient" className="m-0">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                <FieldCard>
                  <div className="p-5">
                    <SectionHeader label="Empfänger" icon={<Building2 size={13} />} />
                    <div className="space-y-3">
                      <Field label="Einrichtung / Organisation" icon={<Building2 size={11} />}>
                        <StyledInput
                          value={data.recipientCompany}
                          onChange={(e) => update("recipientCompany", e.target.value)}
                          placeholder="Kindertagesstätte Sonnenschein"
                        />
                      </Field>
                      <Field label="Ansprechpartner" icon={<User size={11} />}>
                        <StyledInput
                          value={data.recipientDepartment}
                          onChange={(e) => update("recipientDepartment", e.target.value)}
                          placeholder="Frau Müller"
                        />
                      </Field>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Straße & Nr." icon={<MapPin size={11} />}>
                          <StyledInput
                            value={data.recipientStreet}
                            onChange={(e) => update("recipientStreet", e.target.value)}
                            placeholder="Gartenweg 5"
                          />
                        </Field>
                        <Field label="PLZ & Stadt" icon={<MapPin size={11} />}>
                          <StyledInput
                            value={data.recipientCity}
                            onChange={(e) => update("recipientCity", e.target.value)}
                            placeholder="61250 Usingen"
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                </FieldCard>
              </motion.div>
            </TabsContent>

            {/* ── Settings Tab ── */}
            <TabsContent key="settings" value="settings" className="m-0">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                <FieldCard>
                  <div className="p-5">
                    <SectionHeader label="Dokument-Details" icon={<Settings size={13} />} />
                    <Field label="Abschlussfloskel" icon={<Edit3 size={11} />}>
                      <StyledInput
                        value={data.closing}
                        onChange={(e) => update("closing", e.target.value)}
                        placeholder="Mit freundlichen Grüßen,"
                      />
                    </Field>
                    <div className="mt-4">
                      <Field label="Schriftgröße (pt)" icon={<Type size={11} />}>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" size="icon" onClick={() => updateFontSize(fontSize - 0.5)} className="h-10 w-10 rounded-xl" aria-label="Schrift verkleinern">
                            <Minus size={14} />
                          </Button>
                          <Input
                            type="number"
                            min={9}
                            max={12}
                            step={0.5}
                            value={Number.isFinite(fontSize) ? fontSize : 10}
                            onChange={(e) => {
                              const next = Number(e.target.value);
                              if (Number.isFinite(next)) updateFontSize(next);
                            }}
                            className="h-11 w-24 rounded-xl text-center"
                          />
                          <Button type="button" variant="outline" size="icon" onClick={() => updateFontSize(fontSize + 0.5)} className="h-10 w-10 rounded-xl" aria-label="Schrift vergrößern">
                            <Plus size={14} />
                          </Button>
                        </div>
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field label="Absatzabstand (pt)" icon={<AlignLeft size={11} />}>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" size="icon" onClick={() => updateParagraphSpacing(paragraphSpacing - 1)} className="h-10 w-10 rounded-xl" aria-label="Absatzabstand verringern">
                            <Minus size={14} />
                          </Button>
                          <Input
                            type="number"
                            min={6}
                            max={20}
                            step={1}
                            value={Number.isFinite(paragraphSpacing) ? paragraphSpacing : 10}
                            onChange={(e) => {
                              const next = Number(e.target.value);
                              if (Number.isFinite(next)) updateParagraphSpacing(next);
                            }}
                            className="h-11 w-24 rounded-xl text-center"
                          />
                          <Button type="button" variant="outline" size="icon" onClick={() => updateParagraphSpacing(paragraphSpacing + 1)} className="h-10 w-10 rounded-xl" aria-label="Absatzabstand erhöhen">
                            <Plus size={14} />
                          </Button>
                        </div>
                      </Field>
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
