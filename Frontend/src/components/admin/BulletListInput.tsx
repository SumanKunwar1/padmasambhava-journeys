// src/components/admin/BulletListInput.tsx
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const BULLET = "• ";

// Leading list markers we strip from a line: bullets, "- ", "* ", "1. ", "2) ".
// Dashes and numbers need a following space so "-5°C" or "1.5 litres" survive.
const MARKER = /^\s*(?:[•●▪◦·‣✓✔✗✘–—]\s*|[-*]\s+|\d+[.)]\s+)/;

const stripMarker = (line: string) => line.replace(MARKER, "").trim();

const parseBulletText =(text: string): string[] =>
  text.split(/\r?\n/).map(stripMarker).filter(Boolean);

const toBulletText = (items: string[]) =>
  items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => BULLET + item)
    .join("\n");

interface BulletListInputProps {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

// One box, one bullet per line. The parent still gets a plain string[] - the
// same shape the per-row inputs produced - so nothing downstream changes.
export default function BulletListInput({
  value,
  onChange,
  placeholder,
  rows = 6,
  className,
}: BulletListInputProps) {
  const [text, setText] = useState(() => toBulletText(value));

  // Re-sync when the list changes from outside (trip loaded, day removed...)
  useEffect(() => {
    const incoming = value.map((v) => v.trim()).filter(Boolean);
    if (parseBulletText(text).join("\n") !== incoming.join("\n")) {
      setText(toBulletText(value));
    }
  }, [value, text]);

  const commit = (next: string) => {
    setText(next);
    onChange(parseBulletText(next));
  };

  // execCommand keeps the browser's undo history intact; setRangeText is the
  // fallback where it is unavailable.
  const insertAtCaret = (el: HTMLTextAreaElement, snippet: string) => {
    if (document.execCommand?.("insertText", false, snippet)) return;
    el.setRangeText(snippet, el.selectionStart, el.selectionEnd, "end");
    commit(el.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    insertAtCaret(e.currentTarget, "\n" + BULLET);
  };

  // Pasting a list (from Word, WhatsApp, a PDF...) becomes one bullet per line
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (!/\r?\n/.test(pasted)) return;

    const lines = parseBulletText(pasted);
    if (lines.length === 0) return;
    e.preventDefault();

    const el = e.currentTarget;
    const lineStart = el.value.lastIndexOf("\n", el.selectionStart - 1) + 1;
    const before = el.value.slice(lineStart, el.selectionStart);
    const lead =
      before.trim() === ""
        ? BULLET
        : stripMarker(before) === ""
          ? ""
          : "\n" + BULLET;

    insertAtCaret(el, lead + lines.join("\n" + BULLET));
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (text.trim() !== "") return;
    const el = e.currentTarget;
    setText(BULLET);
    requestAnimationFrame(() =>
      el.setSelectionRange(BULLET.length, BULLET.length)
    );
  };

  const count = parseBulletText(text).length;

  return (
    <div>
      <Textarea
        value={text}
        onChange={(e) => commit(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={handleFocus}
        // Drop empty bullets and tidy the markers once the admin leaves the box
        onBlur={() => setText(toBulletText(parseBulletText(text)))}
        placeholder={placeholder}
        rows={rows}
        className={cn("leading-relaxed resize-y", className)}
      />
      <p className="text-xs text-muted-foreground mt-1.5">
        {count} {count === 1 ? "item" : "items"} · one per line, press Enter
        for the next bullet, or paste a whole list at once
      </p>
    </div>
  );
}
