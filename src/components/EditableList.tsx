import { useState, useRef, useEffect, useMemo } from "react";
import { Plus, X, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface SortableItemProps {
  id: string;
  index: number;
  item: string;
  editingIndex: number | null;
  tempValue: string;
  totalItems: number;
  inputRef: React.RefObject<HTMLInputElement  | null>;
  onStartEdit: (index: number) => void;
  onSaveEdit: () => void;
  onSetEditingIndex: (index: number | null) => void;
  onSetTempValue: (value: string) => void;
  onMoveItem: (index: number, direction: "up" | "down") => void;
  onRemoveItem: (index: number) => void;
}

function SortableItem({
  id,
  index,
  item,
  editingIndex,
  tempValue,
  totalItems,
  inputRef,
  onStartEdit,
  onSaveEdit,
  onSetEditingIndex,
  onSetTempValue,
  onMoveItem,
  onRemoveItem,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-md transition-all border border-transparent ${
        isDragging ? "bg-primary/10 shadow-lg ring-1 ring-primary/20 z-10" : "bg-muted/30 p-1.5"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex shrink-0 items-center justify-center text-muted-foreground/40 transition-colors cursor-grab active:cursor-grabbing p-1 -ml-1 touch-none"
      >
        <GripVertical size={14} />
      </div>

      <div className="flex-1 min-w-0">
        {editingIndex === index ? (
          <Input
            ref={inputRef}
            value={tempValue}
            onChange={(e) => onSetTempValue(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSaveEdit();
              if (e.key === "Escape") onSetEditingIndex(null);
            }}
            className="h-8 text-[14px] sm:text-xs bg-background border-none ring-1 ring-primary focus-visible:ring-primary shadow-none px-2"
          />
        ) : (
          <div
            className="text-[14px] sm:text-xs text-foreground/80 cursor-pointer hover:text-foreground transition-colors px-2 py-1 truncate"
            onClick={() => onStartEdit(index)}
          >
            {item}
          </div>
        )}
      </div>

      <div className="flex items-center gap-0.5 pr-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground/60 hover:text-primary flex"
          onClick={(e) => {
            e.stopPropagation();
            onMoveItem(index, "up");
          }}
          disabled={index === 0}
        >
          <ChevronUp size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground/60 hover:text-primary flex"
          onClick={(e) => {
            e.stopPropagation();
            onMoveItem(index, "down");
          }}
          disabled={index === totalItems - 1}
        >
          <ChevronDown size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive/60 hover:text-destructive hover:bg-destructive/10 flex"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveItem(index);
          }}
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}

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

  // Generate unique IDs for sortable items based on their content + index
  const itemIds = useMemo(
    () => items.map((item, idx) => `item-${item}-${idx}`),
    [items]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = itemIds.indexOf(active.id as string);
      const newIndex = itemIds.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        onChange(arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={itemIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {items.map((item, index) => (
              <SortableItem
                key={itemIds[index]}
                id={itemIds[index]}
                index={index}
                item={item}
                editingIndex={editingIndex}
                tempValue={tempValue}
                totalItems={items.length}
                inputRef={inputRef}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onSetEditingIndex={setEditingIndex}
                onSetTempValue={setTempValue}
                onMoveItem={moveItem}
                onRemoveItem={removeItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-full border border-dashed border-border/60 text-[10px] uppercase font-bold text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 mt-1"
        onClick={() => addItemAt(items.length)}
      >
        <Plus size={12} className="mr-1.5" /> Hinzufügen
      </Button>
    </div>
  );
}

