import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(pdfBlobs: Blob[], filename: string): Promise<void> {
    const mergedPdf = await PDFDocument.create();

    for (const blob of pdfBlobs) {
        const arrayBuffer = await blob.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const mergedBlob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });

    const url = URL.createObjectURL(mergedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export async function base64ToBlob(base64: string): Promise<Blob> {
    const response = await fetch(base64);
    return response.blob();
}
