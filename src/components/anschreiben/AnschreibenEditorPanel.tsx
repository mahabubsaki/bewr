import { motion, AnimatePresence } from "framer-motion";
import type { AnschreibenData } from "../../data/defaultData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Edit3, User, Building2, Settings, RefreshCw, FileText, Phone, Mail, MapPin, AlignLeft } from "lucide-react";

const SECTION_LABELS = [
  { emoji: "📌", label: "Einleitung", hint: "Wecke Interesse vom ersten Satz an" },
  { emoji: "🚀", label: "Warum diese Stelle?", hint: "Zeige Motivation und Begeisterung" },
  { emoji: "🏢", label: "Warum das Unternehmen?", hint: "Recherche und Unternehmensfit" },
  { emoji: "🎓", label: "Qualifikationen", hint: "Belege deine Eignung konkret" },
  { emoji: "💎", label: "Ihr Benefit", hint: "Was gewinnst du durch mich?" },
  { emoji: "🤝", label: "Abschluss", hint: "Klarer Call-to-Action" },
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
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
        {icon}
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600/80">
        {label}
      </span>
      <div className="flex-1 h-px bg-emerald-500/10" />
    </div>
  );
}

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all duration-200"
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
      className={`h-11 rounded-xl border-border/60 bg-background/80 transition-all focus-visible:border-emerald-500/60 focus-visible:ring-2 focus-visible:ring-emerald-500/15 ${props.className ?? ""}`}
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

export default function AnschreibenEditorPanel({
  data,
  update,
  updateParagraph,
  onSyncFromDeckblatt,
}: Props) {
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
                  className="flex flex-col gap-0.5 rounded-lg py-1.5 text-[10px] font-bold uppercase tracking-wide transition-all data-[state=active]:bg-background data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
                >
                  {tab.icon}
                  <span className="hidden sm:block">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="flex-1 px-4 py-5 pb-32">
          <AnimatePresence mode="wait">

            {/* ── Text Tab ─────────────────────────────────── */}
            <TabsContent value="content" className="m-0">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                <FieldCard>
                  <div className="p-5">
                    <SectionHeader label="Betreff & Anrede" icon={<FileText size={13} />} />
                    <div className="space-y-3">
                      <Field label="Betreffzeile" icon={<FileText size={11} />}>
                        <StyledInput
                          value={data.subject}
                          onChange={(e) => update("subject", e.target.value)}
                          placeholder="Bewerbung als Fullstack Developer…"
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
                    className="group relative rounded-2xl border border-border/40 bg-card transition-all duration-200 hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5"
                  >
                    <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-emerald-500/25 group-hover:bg-emerald-500/55 transition-colors" />
                    <div className="p-4 pl-5">
                      <div className="mb-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-black text-emerald-600">
                            {i + 1}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600/70">
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

            {/* ── Sender Tab ───────────────────────────────────── */}
            <TabsContent value="sender" className="m-0">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                <FieldCard>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <SectionHeader label="Absender-Daten" icon={<User size={13} />} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onSyncFromDeckblatt}
                        className="h-8 -mt-5 gap-1.5 rounded-lg text-[11px] font-bold text-emerald-600 hover:bg-emerald-500/8 hover:text-emerald-700"
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
                          placeholder="Max Mustermann"
                        />
                      </Field>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Straße & Nr." icon={<MapPin size={11} />}>
                          <StyledInput
                            value={data.sender.street}
                            onChange={(e) => update("sender", { ...data.sender, street: e.target.value })}
                            placeholder="Musterstraße 1"
                          />
                        </Field>
                        <Field label="PLZ & Stadt" icon={<MapPin size={11} />}>
                          <StyledInput
                            value={data.sender.city}
                            onChange={(e) => update("sender", { ...data.sender, city: e.target.value })}
                            placeholder="12345 Berlin"
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Telefon" icon={<Phone size={11} />}>
                          <StyledInput
                            value={data.sender.phone}
                            onChange={(e) => update("sender", { ...data.sender, phone: e.target.value })}
                            placeholder="+49 …"
                          />
                        </Field>
                        <Field label="E-Mail" icon={<Mail size={11} />}>
                          <StyledInput
                            value={data.sender.email}
                            onChange={(e) => update("sender", { ...data.sender, email: e.target.value })}
                            placeholder="max@mail.de"
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
                        placeholder="Max Mustermann"
                      />
                    </Field>
                  </div>
                </FieldCard>
              </motion.div>
            </TabsContent>

            {/* ── Recipient Tab ─────────────────────────────────── */}
            <TabsContent value="recipient" className="m-0">
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                <FieldCard>
                  <div className="p-5">
                    <SectionHeader label="Empfänger" icon={<Building2 size={13} />} />
                    <div className="space-y-3">
                      <Field label="Firma / Organisation" icon={<Building2 size={11} />}>
                        <StyledInput
                          value={data.recipientCompany}
                          onChange={(e) => update("recipientCompany", e.target.value)}
                          placeholder="Muster GmbH"
                        />
                      </Field>
                      <Field label="Abteilung / Ansprechpartner" icon={<User size={11} />}>
                        <StyledInput
                          value={data.recipientDepartment}
                          onChange={(e) => update("recipientDepartment", e.target.value)}
                          placeholder="HR / Frau Schmidt"
                        />
                      </Field>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field label="Straße & Nr." icon={<MapPin size={11} />}>
                          <StyledInput
                            value={data.recipientStreet}
                            onChange={(e) => update("recipientStreet", e.target.value)}
                            placeholder="Unternehmensstr. 12"
                          />
                        </Field>
                        <Field label="PLZ & Stadt" icon={<MapPin size={11} />}>
                          <StyledInput
                            value={data.recipientCity}
                            onChange={(e) => update("recipientCity", e.target.value)}
                            placeholder="10115 Berlin"
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                </FieldCard>
              </motion.div>
            </TabsContent>

            {/* ── Settings Tab ──────────────────────────────────── */}
            <TabsContent value="settings" className="m-0">
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
