import { useRef } from "react";
import { Upload, FileText, X,  Download } from "lucide-react";
import type { CertificateFile } from "../data/defaultData";

interface PdfUploaderProps {
  files: CertificateFile[];
  onChange: (files: CertificateFile[]) => void;
}

export default function PdfUploader({ files, onChange }: PdfUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    Array.from(selected).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newFile: CertificateFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          data: reader.result as string,
          size: file.size,
        };
        onChange([...files, newFile]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = (id: string) => {
    onChange(files.filter((f) => f.id !== id));
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
        className="group relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer rounded-2xl"
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
          const dt = e.dataTransfer;
          if (dt.files) {
            const input = fileRef.current;
            if (input) {
              const dataTransfer = new DataTransfer();
              Array.from(dt.files).forEach((f) => dataTransfer.items.add(f));
              input.files = dataTransfer.files;
              input.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }
        }}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
          <Upload size={24} className="text-primary" />
        </div>
        <p className="text-sm font-semibold text-slate-700">PDF-Dateien hier ablegen oder klicken</p>
        <p className="mt-1 text-xs text-slate-500 font-medium tracking-tight">Zeugnisse, Zertifikate, Empfehlungsschreiben</p>
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
            <div key={file.id} className="group relative flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition-all hover:border-primary/20">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <FileText size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-700" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[10px] font-medium text-slate-400">{formatSize(file.size)}</p>
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
                  onClick={() => removeFile(file.id)}
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
