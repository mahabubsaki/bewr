import { useRef } from "react";
import { Upload, FileText, X, GripVertical } from "lucide-react";
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
    <div className="pdf-uploader">
      <div
        className="upload-zone"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("drag-over");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("drag-over");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("drag-over");
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
        <Upload size={32} />
        <p>PDF-Dateien hier ablegen oder klicken</p>
        <span>Zeugnisse, Zertifikate, Empfehlungsschreiben</span>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        multiple
        onChange={handleUpload}
        style={{ display: "none" }}
      />

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file) => (
            <div key={file.id} className="file-item">
              <div className="file-grip">
                <GripVertical size={16} />
              </div>
              <FileText size={20} className="file-icon" />
              <div className="file-info">
                <span className="file-name" title={file.name}>
                  {file.name}
                </span>
                <span className="file-size">{formatSize(file.size)}</span>
              </div>
              <button
                className="file-download-btn"
                onClick={() => downloadFile(file)}
                title="Herunterladen"
              >
                ↓
              </button>
              <button
                className="file-remove-btn"
                onClick={() => removeFile(file.id)}
                title="Entfernen"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
