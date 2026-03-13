import { Type } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DOCUMENT_FONT_OPTIONS,
  type DocumentFontId,
} from "../../lib/fontConfig";

interface Props {
  value: DocumentFontId;
  onChange: (fontId: DocumentFontId) => void;
}

export default function DocumentFontSelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as DocumentFontId)}>
      <SelectTrigger className="h-9 w-44 rounded-lg border-border/60 bg-background">
        <div className="flex items-center gap-2">
          <Type size={14} className="text-muted-foreground" />
          <SelectValue placeholder="Schriftart" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {DOCUMENT_FONT_OPTIONS.map((font) => (
          <SelectItem key={font.id} value={font.id}>
            {font.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
