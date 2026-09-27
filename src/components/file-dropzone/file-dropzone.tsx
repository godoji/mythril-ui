import { useRef, useState } from "react";
import type { DragEvent, ReactElement } from "react";
import { Upload } from "lucide-react";
import { Button } from "../button/button.js";
import { cx } from "../../lib/classes.js";
import { useComponentMessages } from "../messages/messages.js";
import styles from "./file-dropzone.module.css";

export interface FileDropzoneProps {
  label: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  busy?: boolean;
  onFiles: (files: File[]) => void;
  className?: string;
}

/** Native file selection and drop surface; validation and uploads stay in the app. */
export const FileDropzone = ({
  label,
  description,
  accept,
  multiple = false,
  disabled = false,
  busy = false,
  onFiles,
  className,
}: FileDropzoneProps): ReactElement => {
  const messages = useComponentMessages();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const unavailable = disabled || busy;
  const acceptFiles = (files: FileList | null): void => {
    if (!files || unavailable) return;
    const selected = Array.from(files);
    if (selected.length) onFiles(multiple ? selected : selected.slice(0, 1));
  };
  const onDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setDragging(false);
    acceptFiles(event.dataTransfer.files);
  };
  return (
    <div
      className={cx(styles.dropzone, className)}
      data-dragging={dragging}
      data-disabled={unavailable}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!unavailable) setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          setDragging(false);
      }}
      onDrop={onDrop}
    >
      <Upload size={18} aria-hidden="true" />
      <strong>{label}</strong>
      {description && <span>{description}</span>}
      <Button
        size="small"
        disabled={unavailable}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? messages.uploading : messages.chooseFile}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={unavailable}
        tabIndex={-1}
        aria-label={label}
        className={styles.input}
        onChange={(event) => {
          acceptFiles(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
};
