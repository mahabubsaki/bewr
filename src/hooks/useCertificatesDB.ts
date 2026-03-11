import { useState, useEffect, useCallback } from 'react';
import type { CertificateFile } from '../data/defaultData';

const DB_NAME = 'bewerbung-db';
const DB_VERSION = 1;
const STORE_NAME = 'certificates';

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function getAllCerts(): Promise<CertificateFile[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = () => resolve(req.result as CertificateFile[]);
        req.onerror = () => reject(req.error);
    });
}

async function putCert(cert: CertificateFile): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(cert);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function deleteCert(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function clearAllCerts(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

/** Migrates any certificates still sitting in localStorage into IndexedDB, then removes them. */
async function migrateFromLocalStorage(): Promise<void> {
    try {
        const raw = localStorage.getItem('certificates');
        if (!raw) return;
        const certs: CertificateFile[] = JSON.parse(raw);
        if (!Array.isArray(certs) || certs.length === 0) {
            localStorage.removeItem('certificates');
            return;
        }
        for (const cert of certs) {
            await putCert(cert);
        }
        localStorage.removeItem('certificates');
    } catch {
        // ignore migration errors
    }
}

export function useCertificatesDB(): {
    certificates: CertificateFile[];
    addCertificates: (files: CertificateFile[]) => Promise<void>;
    removeCertificate: (id: string) => Promise<void>;
    clearCertificates: () => Promise<void>;
    loading: boolean;
} {
    const [certificates, setCertificates] = useState<CertificateFile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            await migrateFromLocalStorage();
            const certs = await getAllCerts();
            if (!cancelled) {
                setCertificates(certs);
                setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const addCertificates = useCallback(async (newFiles: CertificateFile[]) => {
        for (const f of newFiles) {
            await putCert(f);
        }
        setCertificates(await getAllCerts());
    }, []);

    const removeCertificate = useCallback(async (id: string) => {
        await deleteCert(id);
        setCertificates((prev) => prev.filter((c) => c.id !== id));
    }, []);

    const clearCertificates = useCallback(async () => {
        await clearAllCerts();
        setCertificates([]);
    }, []);

    return { certificates, addCertificates, removeCertificate, clearCertificates, loading };
}
