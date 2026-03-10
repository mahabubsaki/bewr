import { useRef } from "react";
import { Camera } from "lucide-react";
import { cn } from "../lib/utils";

interface PhotoUploadProps {
  photo: string;
  onPhotoChange: (base64: string) => void;
  className?: string;
  width?: number;
  height?: number;
  label?: string;
  rounded?: boolean;
}

export default function PhotoUpload({
  photo,
  onPhotoChange,
  className = "",
  width = 120,
  height = 150,
  label = "Foto hochladen",
  rounded = false,
}: PhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onPhotoChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/30 bg-muted/50 transition-all hover:border-primary/50 hover:bg-muted font-sans",
        rounded ? "rounded-full" : "rounded-lg",
        className
      )}
      style={{ width, height }}
      onClick={() => fileRef.current?.click()}
      title={label}
    >
      {photo ? (
        <>
          <img
            src={photo}
            alt="Foto"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="text-white" size={24} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Camera size={24} />
          <span className="text-[10px] uppercase tracking-wider font-bold">{label}</span>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
