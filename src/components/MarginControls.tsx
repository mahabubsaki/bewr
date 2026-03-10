import { Settings2 } from "lucide-react";
import type { Margins } from "../data/defaultData";

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
    <div className="margin-controls no-print">
      <div className="margin-controls-header">
        <Settings2 size={16} />
        <span>Seitenränder (mm)</span>
      </div>
      <div className="margin-inputs">
        <div className="margin-field">
          <label>Oben</label>
          <input
            type="number"
            value={margins.top}
            onChange={(e) => handleChange("top", e.target.value)}
          />
        </div>
        <div className="margin-field">
          <label>Unten</label>
          <input
            type="number"
            value={margins.bottom}
            onChange={(e) => handleChange("bottom", e.target.value)}
          />
        </div>
        <div className="margin-field">
          <label>Links</label>
          <input
            type="number"
            value={margins.left}
            onChange={(e) => handleChange("left", e.target.value)}
          />
        </div>
        <div className="margin-field">
          <label>Rechts</label>
          <input
            type="number"
            value={margins.right}
            onChange={(e) => handleChange("right", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
