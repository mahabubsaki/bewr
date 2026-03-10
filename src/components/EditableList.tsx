import { useState, useRef, useEffect } from "react";
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  className?: string;
}

export default function EditableList({
  items,
  onChange,
  className = "",
}: EditableListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setTempValue(items[index]);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const newItems = [...items];
    if (tempValue.trim()) {
      newItems[editingIndex] = tempValue;
    } else {
      newItems.splice(editingIndex, 1);
    }
    onChange(newItems);
    setEditingIndex(null);
  };

  const addItemAt = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 0, "Neuer Eintrag");
    onChange(newItems);
    setEditingIndex(index);
    setTempValue("Neuer Eintrag");
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [
      newItems[newIndex],
      newItems[index],
    ];
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  return (
    <div className={`editable-list ${className}`}>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="editable-list-item">
            {/* Insertion button ABOVE the item */}
            <div className="list-item-insert-wrapper no-print">
              <button
                className="list-insert-btn"
                onClick={() => addItemAt(index)}
                title="Hier einfügen"
              >
                <Plus size={10} />
              </button>
            </div>

            <div className="list-item-content">
              {editingIndex === index ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingIndex(null);
                  }}
                  className="editable-input"
                  autoFocus
                />
              ) : (
                <span
                  className="editable-text list-item-text"
                  onClick={() => startEdit(index)}
                >
                  {item}
                </span>
              )}

              {/* Action buttons on the right, hover only */}
              <div className="list-item-actions no-print">
                <button
                  className="item-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(index, "up");
                  }}
                  disabled={index === 0}
                  title="Nach oben"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  className="item-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(index, "down");
                  }}
                  disabled={index === items.length - 1}
                  title="Nach unten"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  className="item-action-btn remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(index);
                  }}
                  title="Entfernen"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="add-btn no-print"
        onClick={() => addItemAt(items.length)}
      >
        <Plus size={14} /> Hinzufügen
      </button>
    </div>
  );
}
