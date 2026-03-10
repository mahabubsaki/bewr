import { useState, useRef, useEffect } from "react";

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
      inputRef.current.select();
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
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`editable-input editable-textarea ${className}`}
        placeholder={placeholder}
        autoFocus
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`editable-input ${className}`}
        placeholder={placeholder}
        autoFocus
      />
    );
  }

  return (
    <Tag
      className={`editable-text ${className} ${!value ? "editable-placeholder" : ""}`}
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
