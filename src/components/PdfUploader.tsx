import { useRef } from "react";
import { Upload, FileText, X, Download } from "lucide-react";
import type { CertificateFile } from "../data/defaultData";

interface PdfUploaderProps {
  files: CertificateFile[];
  onAdd: (files: CertificateFile[]) => void;
  onRemove: (id: string) => void;
}

export default function PdfUploader({ files, onAdd, onRemove }: PdfUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const processFiles = (selected: FileList | File[]) => {
    const fileArray = Array.from(selected);
    if (fileArray.length === 0) return;

    const results: CertificateFile[] = [];
    let loadedCount = 0;

    fileArray.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        results.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + idx,
          name: file.name,
          data: reader.result as string,
          size: file.size,
        });
        loadedCount++;
        if (loadedCount === fileArray.length) {
          onAdd(results);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const downloadFile = (file: CertificateFile) => {
    const a = document.createElement("a");
    a.href = file.data;
    a.download = file.name;
    a.click();
  };

  return (
    <div className="w-full space-y-4">
      <div
        className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm p-8 text-center transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer rounded-2xl shadow-sm"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-primary", "bg-primary/5");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("border-primary", "bg-primary/5");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-primary", "bg-primary/5");
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
          }
        }}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
          <Upload size={24} className="text-primary" />
        </div>
        <p className="text-sm font-semibold text-slate-700">
          PDF-Dateien hier ablegen oder klicken
        </p>
        <p className="mt-1 text-xs text-slate-500 font-medium tracking-tight">
          Zeugnisse, Zertifikate, Empfehlungsschreiben
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition-all hover:border-primary/20"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <FileText size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-xs font-bold text-slate-700"
                  title={file.name}
                >
                  {file.name}
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  {formatSize(file.size)}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => downloadFile(file)}
                  title="Herunterladen"
                >
                  <Download size={14} />
                </button>
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  onClick={() => onRemove(file.id)}
                  title="Entfernen"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
