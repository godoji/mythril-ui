import { useLayoutEffect, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "../button/button.js";
import { IconButton } from "../icon-button/icon-button.js";
import styles from "./collection-editor.module.css";

export interface CollectionItem {
  id: string;
  label: string;
  content: ReactNode;
}
export interface CollectionEditorProps {
  label: string;
  items: readonly CollectionItem[];
  onMove: (id: string, toIndex: number) => void;
  onRemove: (id: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  emptyMessage?: string;
  disabled?: boolean;
  moveUpLabel?: (label: string) => string;
  moveDownLabel?: (label: string) => string;
  removeLabel?: (label: string) => string;
  positionLabel?: (label: string, position: number, total: number) => string;
}
/** Repeated editors with accessible move actions. Stable IDs and mutations belong to the caller. */
export const CollectionEditor = ({
  label,
  items,
  onMove,
  onRemove,
  onAdd,
  addLabel = "Add item",
  emptyMessage = "No items",
  disabled = false,
  moveUpLabel = (name) => `Move ${name} up`,
  moveDownLabel = (name) => `Move ${name} down`,
  removeLabel = (name) => `Remove ${name}`,
  positionLabel = (name, position, total) =>
    `${name}, ${String(position)} of ${String(total)}`,
}: CollectionEditorProps): ReactElement => {
  const root = useRef<HTMLDivElement>(null);
  const headings = useRef(new Map<string, HTMLHeadingElement>());
  const add = useRef<HTMLButtonElement>(null);
  const pending = useRef<{
    id: string | undefined;
    previous: readonly CollectionItem[];
  } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  useLayoutEffect(() => {
    const next = pending.current;
    if (!next || items === next.previous) return;
    pending.current = null;
    const item = items.find((entry) => entry.id === next.id);
    const target = item
      ? headings.current.get(item.id)
      : (add.current ?? root.current);
    target?.focus();
    setAnnouncement(
      item
        ? positionLabel(item.label, items.indexOf(item) + 1, items.length)
        : emptyMessage,
    );
  }, [items, positionLabel, emptyMessage]);
  return (
    <div
      ref={root}
      role="group"
      aria-label={label}
      tabIndex={-1}
      className={styles.root}
    >
      <div className={styles.srOnly} role="status">
        {announcement}
      </div>
      {items.length === 0 && <p className={styles.empty}>{emptyMessage}</p>}
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.header}>
              <h3
                tabIndex={-1}
                ref={(node) => {
                  if (node) headings.current.set(item.id, node);
                  else headings.current.delete(item.id);
                }}
              >
                {item.label}
              </h3>
              <div className={styles.actions}>
                <IconButton
                  icon={ArrowUp}
                  label={moveUpLabel(item.label)}
                  disabled={disabled || index === 0}
                  onClick={() => {
                    pending.current = { id: item.id, previous: items };
                    onMove(item.id, index - 1);
                  }}
                />
                <IconButton
                  icon={ArrowDown}
                  label={moveDownLabel(item.label)}
                  disabled={disabled || index === items.length - 1}
                  onClick={() => {
                    pending.current = { id: item.id, previous: items };
                    onMove(item.id, index + 1);
                  }}
                />
                <IconButton
                  icon={Trash2}
                  label={removeLabel(item.label)}
                  disabled={disabled}
                  onClick={() => {
                    pending.current = {
                      id: items[index + 1]?.id ?? items[index - 1]?.id,
                      previous: items,
                    };
                    onRemove(item.id);
                  }}
                />
              </div>
            </div>
            <fieldset disabled={disabled} className={styles.content}>
              <legend className={styles.srOnly}>{item.label}</legend>
              {item.content}
            </fieldset>
          </li>
        ))}
      </ol>
      {onAdd && (
        <div>
          <Button ref={add} icon={Plus} disabled={disabled} onClick={onAdd}>
            {addLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
