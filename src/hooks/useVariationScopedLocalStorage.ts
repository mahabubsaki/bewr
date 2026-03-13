import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useActiveVariationId } from "./useActiveVariationId";
import { getVariationStorageKey } from "../lib/variationManager";

function parseStoredValue<T>(rawValue: string | null, fallback: T): T {
  if (!rawValue) return fallback;
  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function useVariationScopedLocalStorage<T>(
  baseKey: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void, string] {
  const activeVariationId = useActiveVariationId();

  // Capture the initial defaultValue in a ref so unstable references (inline [] or {})
  // don't trigger the sync effect on every render and cause an infinite loop.
  const defaultValueRef = useRef(defaultValue);

  const storageKey = useMemo(
    () => getVariationStorageKey(baseKey, activeVariationId),
    [baseKey, activeVariationId],
  );

  const [value, setValue] = useState<T>(() => parseStoredValue(localStorage.getItem(storageKey), defaultValueRef.current));

  // Re-read from storage only when the storage key changes (variation switch).
  // Intentionally omit defaultValue from deps — we only need the ref's stable value.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setValue(parseStoredValue(localStorage.getItem(storageKey), defaultValueRef.current));
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save variation-scoped value:", error);
    }
  }, [storageKey, value]);

  const reset = useCallback(() => {
    setValue(defaultValueRef.current);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return [value, setValue, reset, activeVariationId];
}
