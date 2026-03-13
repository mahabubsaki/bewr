import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { LebenslaufData, AnschreibenData, DeckblattData } from '../data/defaultData';
import type { DocumentFontId } from '../lib/fontConfig';
import { DEFAULT_EDITOR_FONT_SETTINGS } from '../lib/fontConfig';
import LebenslaufPDF from '../pdf/LebenslaufPDF';
import AnschreibenPDF from '../pdf/AnschreibenPDF';
import DeckblattPDF from '../pdf/DeckblattPDF';

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function renderPdf(element: React.ReactElement<any>): Promise<Blob> {
    return pdf(element).toBlob();
}

export async function generateLebenslaufPdf(data: LebenslaufData, filename: string, activeSections?: string[], fontId: DocumentFontId = DEFAULT_EDITOR_FONT_SETTINGS.fontId): Promise<Blob> {
    const blob = await renderPdf(React.createElement(LebenslaufPDF, { data, activeSections, fontId }));
    triggerDownload(blob, filename);
    return blob;
}

export async function generateLebenslaufBlob(data: LebenslaufData, activeSections?: string[], fontId: DocumentFontId = DEFAULT_EDITOR_FONT_SETTINGS.fontId): Promise<Blob> {
    return renderPdf(React.createElement(LebenslaufPDF, { data, activeSections, fontId }));
}

export async function generateAnschreibenPdf(data: AnschreibenData, filename: string, fontId: DocumentFontId = DEFAULT_EDITOR_FONT_SETTINGS.fontId): Promise<Blob> {
    const blob = await renderPdf(React.createElement(AnschreibenPDF, { data, fontId }));
    triggerDownload(blob, filename);
    return blob;
}

export async function generateAnschreibenBlob(data: AnschreibenData, fontId: DocumentFontId = DEFAULT_EDITOR_FONT_SETTINGS.fontId): Promise<Blob> {
    return renderPdf(React.createElement(AnschreibenPDF, { data, fontId }));
}

export async function generateDeckblattPdf(data: DeckblattData, filename: string, fontId: DocumentFontId = DEFAULT_EDITOR_FONT_SETTINGS.fontId): Promise<Blob> {
    const blob = await renderPdf(React.createElement(DeckblattPDF, { data, fontId }));
    triggerDownload(blob, filename);
    return blob;
}

export async function generateDeckblattBlob(data: DeckblattData, fontId: DocumentFontId = DEFAULT_EDITOR_FONT_SETTINGS.fontId): Promise<Blob> {
    return renderPdf(React.createElement(DeckblattPDF, { data, fontId }));
}
