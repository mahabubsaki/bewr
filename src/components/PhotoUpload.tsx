import { useRef } from "react";
import { Camera } from "lucide-react";

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
      className={`photo-upload ${className} ${rounded ? "photo-rounded" : ""}`}
      style={{ width, height }}
      onClick={() => fileRef.current?.click()}
      title={label}
    >
      {photo ? (
        <img
          src={photo}
          alt="Foto"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div className="photo-placeholder">
          <Camera size={24} />
          <span>{label}</span>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
