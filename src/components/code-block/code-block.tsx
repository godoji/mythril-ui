import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, ReactElement } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../button/button.js";
import { IconButton } from "../icon-button/icon-button.js";
import { cx } from "../../lib/classes.js";
import styles from "./code-block.module.css";

export interface CodeBlockProps {
  code: string;
  label?: string;
  language?: string;
  /** Bounds the rendered preview by characters, without changing copied output. */
  previewLimit?: number;
  maxHeight?: CSSProperties["maxHeight"];
  wrap?: boolean;
  className?: string;
}
/** Plain text output: escaped by React, with no HTML injection or syntax parser. */
export const CodeBlock = ({
  code,
  label = "Output",
  language,
  previewLimit = 12000,
  maxHeight = "24rem",
  wrap = false,
  className,
}: CodeBlockProps): ReactElement => {
  const [expanded, setExpanded] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const active = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId();
  useEffect(() => {
    active.current = true;
    return (): void => {
      active.current = false;
      clearTimeout(timer.current);
    };
  }, []);
  const limit = Number.isFinite(previewLimit)
    ? Math.max(1, Math.floor(previewLimit))
    : 12000;
  const truncated = code.length > limit;
  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      if (!active.current) return;
      setCopyState("copied");
    } catch {
      if (!active.current) return;
      setCopyState("error");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopyState("idle");
    }, 3000);
  };
  return (
    <section className={cx(styles.block, className)} aria-label={label}>
      <header className={styles.header}>
        <span>
          {label}
          {language && <span className={styles.language}> · {language}</span>}
        </span>
        <div className={styles.actions}>
          <span role="status" className={styles.copyStatus}>
            {copyState === "copied"
              ? "Copied"
              : copyState === "error"
                ? "Copy failed. Select and copy the text."
                : ""}
          </span>
          <IconButton
            icon={copyState === "copied" ? Check : Copy}
            label="Copy full output"
            size="small"
            onClick={() => {
              void copy();
            }}
          />
        </div>
      </header>
      <pre
        role="region"
        id={id}
        className={styles.code}
        style={{ maxHeight }}
        data-wrap={wrap}
        tabIndex={0}
        aria-label={`${label} text`}
      >
        <code>{truncated && !expanded ? code.slice(0, limit) : code}</code>
      </pre>
      {truncated && (
        <footer className={styles.footer}>
          <span>
            {expanded
              ? `${code.length.toLocaleString()} characters`
              : `Showing ${limit.toLocaleString()} of ${code.length.toLocaleString()} characters`}
          </span>
          <Button
            size="small"
            variant="ghost"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            {expanded ? "Show preview" : "Show full output"}
          </Button>
        </footer>
      )}
    </section>
  );
};
