export interface VariationMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const VARIATION_STORAGE_PREFIX = "variation";
export const VARIATIONS_STORAGE_KEY = "app-variations";
export const ACTIVE_VARIATION_STORAGE_KEY = "app-active-variation";
export const VARIATION_MIGRATION_FLAG = "app-variation-migrated-v1";

export const VARIATION_CHANGED_EVENT = "app:variation-changed";
export const VARIATIONS_UPDATED_EVENT = "app:variations-updated";

export const DEFAULT_VARIATION_ID = "default";

export const VARIATION_DATA_KEYS = [
  "lebenslauf",
  "anschreiben",
  "deckblatt",
  "lebenslauf-section-order",
  "lebenslauf-deleted-sections",
  "editor-font-settings",
] as const;

const DEFAULT_VARIATION: VariationMeta = {
  id: DEFAULT_VARIATION_ID,
  name: "Standard",
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function emit(eventName: string, detail?: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

function generateVariationId(): string {
  return `var-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeVariationName(name: string, fallback: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function saveVariations(next: VariationMeta[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(VARIATIONS_STORAGE_KEY, JSON.stringify(next));
}

function ensureVariationList(): VariationMeta[] {
  if (!canUseStorage()) return [DEFAULT_VARIATION];

  const raw = parseJson<VariationMeta[]>(localStorage.getItem(VARIATIONS_STORAGE_KEY), []);
  const safe = raw.filter((item) => Boolean(item?.id));

  if (safe.length === 0) {
    saveVariations([DEFAULT_VARIATION]);
    return [DEFAULT_VARIATION];
  }

  const hasDefault = safe.some((item) => item.id === DEFAULT_VARIATION_ID);
  if (!hasDefault) {
    const next = [DEFAULT_VARIATION, ...safe];
    saveVariations(next);
    return next;
  }

  return safe;
}

function ensureActiveVariationId(variations: VariationMeta[]): string {
  if (!canUseStorage()) return DEFAULT_VARIATION_ID;

  const existing = localStorage.getItem(ACTIVE_VARIATION_STORAGE_KEY);
  const fallback = variations[0]?.id ?? DEFAULT_VARIATION_ID;
  const resolved = existing && variations.some((item) => item.id === existing) ? existing : fallback;
  localStorage.setItem(ACTIVE_VARIATION_STORAGE_KEY, resolved);
  return resolved;
}

function migrateLegacyKeysToDefaultVariation() {
  if (!canUseStorage()) return;

  const alreadyMigrated = localStorage.getItem(VARIATION_MIGRATION_FLAG) === "1";
  if (alreadyMigrated) return;

  for (const key of VARIATION_DATA_KEYS) {
    const legacyValue = localStorage.getItem(key);
    const scopedKey = getVariationStorageKey(key, DEFAULT_VARIATION_ID);
    if (legacyValue !== null && localStorage.getItem(scopedKey) === null) {
      localStorage.setItem(scopedKey, legacyValue);
    }
  }

  localStorage.setItem(VARIATION_MIGRATION_FLAG, "1");
}

function touchVariation(variationId: string) {
  if (!canUseStorage()) return;
  const variations = listVariations();
  const now = new Date().toISOString();
  const next = variations.map((item) =>
    item.id === variationId ? { ...item, updatedAt: now } : item,
  );
  saveVariations(next);
  emit(VARIATIONS_UPDATED_EVENT, next);
}

export function getVariationStorageKey(baseKey: string, variationId?: string): string {
  const resolvedVariationId = variationId ?? getActiveVariationId();
  return `${VARIATION_STORAGE_PREFIX}:${resolvedVariationId}:${baseKey}`;
}

export function ensureVariationSystem(): {
  variations: VariationMeta[];
  activeVariationId: string;
} {
  const variations = ensureVariationList();
  const activeVariationId = ensureActiveVariationId(variations);
  migrateLegacyKeysToDefaultVariation();
  return { variations, activeVariationId };
}

export function listVariations(): VariationMeta[] {
  return ensureVariationSystem().variations;
}

export function getActiveVariationId(): string {
  return ensureVariationSystem().activeVariationId;
}

export function getActiveVariation(): VariationMeta {
  const { variations, activeVariationId } = ensureVariationSystem();
  return (
    variations.find((item) => item.id === activeVariationId) ??
    variations[0] ??
    DEFAULT_VARIATION
  );
}

export function setActiveVariationId(variationId: string): void {
  const variations = listVariations();
  if (!variations.some((item) => item.id === variationId)) return;
  if (!canUseStorage()) return;

  localStorage.setItem(ACTIVE_VARIATION_STORAGE_KEY, variationId);
  emit(VARIATION_CHANGED_EVENT, variationId);
}

export function createVariation(
  name: string,
  options?: {
    sourceVariationId?: string;
    switchToNew?: boolean;
  },
): VariationMeta {
  const { variations } = ensureVariationSystem();
  const now = new Date().toISOString();

  const created: VariationMeta = {
    id: generateVariationId(),
    name: normalizeVariationName(name, `Variation ${variations.length + 1}`),
    createdAt: now,
    updatedAt: now,
  };

  const next = [...variations, created];
  saveVariations(next);

  const sourceVariationId = options?.sourceVariationId;
  if (sourceVariationId) {
    for (const key of VARIATION_DATA_KEYS) {
      const sourceKey = getVariationStorageKey(key, sourceVariationId);
      const targetKey = getVariationStorageKey(key, created.id);
      const value = localStorage.getItem(sourceKey);
      if (value !== null) {
        localStorage.setItem(targetKey, value);
      }
    }
  }

  if (options?.switchToNew !== false) {
    setActiveVariationId(created.id);
  }

  emit(VARIATIONS_UPDATED_EVENT, next);
  return created;
}

export function renameVariation(variationId: string, nextName: string): void {
  const variations = listVariations();
  const normalizedName = normalizeVariationName(nextName, "Variation");

  const next = variations.map((item) =>
    item.id === variationId
      ? { ...item, name: normalizedName, updatedAt: new Date().toISOString() }
      : item,
  );

  saveVariations(next);
  emit(VARIATIONS_UPDATED_EVENT, next);
}

export function deleteVariation(variationId: string): void {
  const { variations, activeVariationId } = ensureVariationSystem();
  if (variations.length <= 1) return;

  const next = variations.filter((item) => item.id !== variationId);
  if (next.length === variations.length) return;

  for (const key of VARIATION_DATA_KEYS) {
    localStorage.removeItem(getVariationStorageKey(key, variationId));
  }

  saveVariations(next);

  if (activeVariationId === variationId) {
    const fallback = next[0]?.id ?? DEFAULT_VARIATION_ID;
    setActiveVariationId(fallback);
  }

  emit(VARIATIONS_UPDATED_EVENT, next);
}

export function markActiveVariationUpdated(): void {
  touchVariation(getActiveVariationId());
}
