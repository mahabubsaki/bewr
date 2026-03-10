import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  tag?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export default function EditableText({
  value,
  onChange,
  tag: Tag = "span",
  className = "",
  multiline = false,
  placeholder = "Klicken zum Bearbeiten...",
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if ("select" in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [editing]);

  const handleSave = () => {
    setEditing(false);
    onChange(tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleSave();
    }
    if (e.key === "Escape") {
      setTempValue(value);
      setEditing(false);
    }
  };

  if (editing) {
    const commonClasses = "w-full rounded-sm border-2 border-primary bg-background px-1 outline-none ring-0 focus:ring-0";
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(commonClasses, "min-h-[100px] resize-none py-1", className)}
        placeholder={placeholder}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(commonClasses, "h-auto py-0", className)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Tag
      className={cn(
        "cursor-pointer transition-colors hover:bg-primary/5",
        !value && "text-muted-foreground italic",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      title="Klicken zum Bearbeiten"
    >
      {value || placeholder}
    </Tag>
  );
}
