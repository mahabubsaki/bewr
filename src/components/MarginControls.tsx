import { Settings2 } from "lucide-react";
import type { Margins } from "../data/defaultData";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface MarginControlsProps {
  margins: Margins;
  onChange: (margins: Margins) => void;
}

export default function MarginControls({
  margins,
  onChange,
}: MarginControlsProps) {
  const handleChange = (key: keyof Margins, value: string) => {
    const num = parseInt(value) || 0;
    onChange({ ...margins, [key]: num });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 size={16} />
          <span>Seitenränder</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-4">
        <div className="mb-4 text-sm font-medium">Ränder (mm)</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="margin-top" className="text-xs">Oben</Label>
            <Input
              id="margin-top"
              type="number"
              value={margins.top}
              className="h-8 px-2 py-1 text-xs"
              onChange={(e) => handleChange("top", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="margin-bottom" className="text-xs">Unten</Label>
            <Input
              id="margin-bottom"
              type="number"
              value={margins.bottom}
              className="h-8 px-2 py-1 text-xs"
              onChange={(e) => handleChange("bottom", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="margin-left" className="text-xs">Links</Label>
            <Input
              id="margin-left"
              type="number"
              value={margins.left}
              className="h-8 px-2 py-1 text-xs"
              onChange={(e) => handleChange("left", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="margin-right" className="text-xs">Rechts</Label>
            <Input
              id="margin-right"
              type="number"
              value={margins.right}
              className="h-8 px-2 py-1 text-xs"
              onChange={(e) => handleChange("right", e.target.value)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
