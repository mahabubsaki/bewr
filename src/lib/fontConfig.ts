export type DocumentFontId =
  | "roboto"
  | "arial"
  | "calibri"
  | "cambria"
  | "georgia"
  | "garamond"
  | "helvetica"
  | "times";

export interface EditorFontSettings {
  fontId: DocumentFontId;
}

export interface DocumentFontOption {
  id: DocumentFontId;
  label: string;
  browserFamily: string;
  pdfFamily: string;
}

export const DEFAULT_EDITOR_FONT_SETTINGS: EditorFontSettings = {
  fontId: "roboto",
};

export const DOCUMENT_FONT_OPTIONS: DocumentFontOption[] = [
  {
    id: "roboto",
    label: "Roboto",
    browserFamily: '"DocRoboto", "Roboto", sans-serif',
    pdfFamily: "DocRoboto",
  },
  {
    id: "arial",
    label: "Arial",
    browserFamily: '"DocArial", Arial, sans-serif',
    pdfFamily: "DocArial",
  },
  {
    id: "calibri",
    label: "Calibri",
    browserFamily: '"DocCalibri", Calibri, sans-serif',
    pdfFamily: "DocCalibri",
  },
  {
    id: "cambria",
    label: "Cambria",
    browserFamily: '"DocCambria", Cambria, serif',
    pdfFamily: "DocCambria",
  },
  {
    id: "georgia",
    label: "Georgia",
    browserFamily: '"DocGeorgia", Georgia, serif',
    pdfFamily: "DocGeorgia",
  },
  {
    id: "garamond",
    label: "Garamond",
    browserFamily: '"DocGaramond", Garamond, serif',
    pdfFamily: "DocGaramond",
  },
  {
    id: "helvetica",
    label: "Helvetica",
    browserFamily: '"DocHelvetica", Helvetica, Arial, sans-serif',
    pdfFamily: "DocHelvetica",
  },
  {
    id: "times",
    label: "Times New Roman",
    browserFamily: '"DocTimesNewRoman", "Times New Roman", Times, serif',
    pdfFamily: "DocTimesNewRoman",
  },
];

export function getDocumentFontOption(fontId: DocumentFontId): DocumentFontOption {
  return (
    DOCUMENT_FONT_OPTIONS.find((item) => item.id === fontId) ??
    DOCUMENT_FONT_OPTIONS[0]
  );
}

export function getBrowserDocumentFontFamily(fontId: DocumentFontId): string {
  return getDocumentFontOption(fontId).browserFamily;
}

export function getPdfDocumentFontFamily(fontId: DocumentFontId): string {
  return getDocumentFontOption(fontId).pdfFamily;
}
