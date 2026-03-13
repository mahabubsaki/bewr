import { useState, useEffect, useCallback } from 'react';

const MAX_HISTORY = 50;

export function useUndoRedo<T>(key: string, defaultValue: T): {
    value: T;
    setValue: (v: T | ((prev: T) => T)) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
} {
    const getInitial = (storageKey: string): T => {
        try {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    };

    const [value, setValueInternal] = useState<T>(() => getInitial(key));
    const [history, setHistory] = useState<T[]>([getInitial(key)]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isUndoRedo, setIsUndoRedo] = useState(false);

    // Save to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Failed to save:', e);
        }
    }, [key, value]);

    // Reinitialize when storage key changes (e.g. switching variation)
    useEffect(() => {
        const initial = getInitial(key);
        setIsUndoRedo(true);
        setValueInternal(initial);
        setHistory([JSON.parse(JSON.stringify(initial))]);
        setHistoryIndex(0);
        setIsUndoRedo(false);
    }, [key]);

    const setValue = useCallback((v: T | ((prev: T) => T)) => {
        setValueInternal((prev) => {
            const newVal = typeof v === 'function' ? (v as (prev: T) => T)(prev) : v;
            return newVal;
        });

        // We'll add to history in a separate effect
        setIsUndoRedo(false);
    }, []);

    // Track history changes (only when not undoing/redoing)
    useEffect(() => {
        if (isUndoRedo) return;

        setHistory((prev) => {
            const truncated = prev.slice(0, historyIndex + 1);
            const newHistory = [...truncated, JSON.parse(JSON.stringify(value))];
            if (newHistory.length > MAX_HISTORY) newHistory.shift();
            return newHistory;
        });
        setHistoryIndex((prev) => {
            const newIdx = Math.min(prev + 1, MAX_HISTORY - 1);
            return newIdx;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const undo = useCallback(() => {
        setHistoryIndex((prev) => {
            if (prev <= 0) return prev;
            const newIdx = prev - 1;
            setIsUndoRedo(true);
            setValueInternal(JSON.parse(JSON.stringify(history[newIdx])));
            return newIdx;
        });
    }, [history]);

    const redo = useCallback(() => {
        setHistoryIndex((prev) => {
            if (prev >= history.length - 1) return prev;
            const newIdx = prev + 1;
            setIsUndoRedo(true);
            setValueInternal(JSON.parse(JSON.stringify(history[newIdx])));
            return newIdx;
        });
    }, [history]);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Don't intercept when typing in an input/textarea
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;

            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo]);

    return {
        value,
        setValue,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
    };
}
