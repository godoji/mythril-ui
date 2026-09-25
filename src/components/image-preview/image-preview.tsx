import type { ComponentPropsWithRef, ReactElement } from "react";
import { X } from "lucide-react";
import { IconButton } from "../icon-button/icon-button.js";
import { cx } from "../../lib/classes.js";
import styles from "./image-preview.module.css";

export interface ImagePreviewProps extends Omit<
  ComponentPropsWithRef<"figure">,
  "children"
> {
  src: string;
  alt: string;
  caption?: string;
  fit?: "contain" | "cover";
  onRemove?: () => void;
  removeLabel?: string;
}
export const ImagePreview = ({
  src,
  alt,
  caption,
  fit = "contain",
  onRemove,
  removeLabel = "Remove image",
  className,
  ...props
}: ImagePreviewProps): ReactElement => (
  <figure {...props} className={cx(styles.figure, className)}>
    <div className={styles.frame} data-fit={fit}>
      <img src={src} alt={alt} />
      {onRemove && (
        <IconButton
          icon={X}
          label={removeLabel}
          size="small"
          className={styles.remove}
          onClick={onRemove}
        />
      )}
    </div>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);
