import { useEffect, useState } from "react";
import {
  ACTIVE_VARIATION_STORAGE_KEY,
  VARIATION_CHANGED_EVENT,
  ensureVariationSystem,
  getActiveVariationId,
} from "../lib/variationManager";

export function useActiveVariationId(): string {
  const [activeVariationId, setActiveVariationId] = useState<string>(
    () => ensureVariationSystem().activeVariationId,
  );

  useEffect(() => {
    const sync = () => setActiveVariationId(getActiveVariationId());

    const onStorage = (event: StorageEvent) => {
      if (event.key === ACTIVE_VARIATION_STORAGE_KEY) {
        sync();
      }
    };

    window.addEventListener(VARIATION_CHANGED_EVENT, sync as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(VARIATION_CHANGED_EVENT, sync as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return activeVariationId;
}
