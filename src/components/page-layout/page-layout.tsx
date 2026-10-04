import type {
  ComponentPropsWithRef,
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";
import { cx } from "../../lib/classes.js";
import type { SpaceToken } from "../../lib/spacing.js";
import styles from "./page-layout.module.css";

export interface PageContainerProps extends ComponentPropsWithRef<"div"> {
  width?: "reading" | "standard" | "wide" | "full";
  padding?: SpaceToken;
}
/** Centered page content with consistent gutters. */
export const PageContainer = ({
  width = "standard",
  padding = "4",
  className,
  style,
  ...props
}: PageContainerProps): ReactElement => (
  <div
    {...props}
    data-width={width}
    className={cx(styles.page, className)}
    style={{
      ...style,
      padding: `var(--mythril-space-${padding}, ${String(Number(padding) * 0.25)}rem)`,
    }}
  />
);

export interface GridProps extends ComponentPropsWithRef<"div"> {
  /** Preferred minimum column width; columns collapse to fit the container. */
  minColumnWidth?: CSSProperties["width"];
  gap?: SpaceToken;
}
/** Responsive grid without viewport-specific application breakpoints. */
export const Grid = ({
  minColumnWidth = "18rem",
  gap = "4",
  className,
  style,
  ...props
}: GridProps): ReactElement => (
  <div
    {...props}
    className={cx(styles.grid, className)}
    style={{
      ...style,
      gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${typeof minColumnWidth === "number" ? `${String(minColumnWidth)}px` : minColumnWidth}), 1fr))`,
      gap: `var(--mythril-space-${gap}, ${String(Number(gap) * 0.25)}rem)`,
    }}
  />
);

export interface LinkCardProps extends Omit<
  ComponentPropsWithRef<"a">,
  "media"
> {
  href: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Non-interactive image or media; children remain part of the linked content. */
  media?: ReactNode;
  /** Place media above the content or beside it, wrapping when space is limited. */
  orientation?: "vertical" | "horizontal";
  /** Router adapter: forward all supplied anchor props and children. */
  renderLink?: (props: ComponentPropsWithRef<"a">) => ReactElement;
}
/** Entire-card anchor preserving native navigation and modified clicks. */
export const LinkCard = ({
  title,
  description,
  icon,
  media,
  orientation = "vertical",
  renderLink,
  children,
  className,
  ...props
}: LinkCardProps): ReactElement => {
  const content = (
    <>
      {icon && <span aria-hidden="true">{icon}</span>}
      <strong>{title}</strong>
      {description && <span className={styles.description}>{description}</span>}
      {children}
    </>
  );
  const anchorProps = {
    ...props,
    "data-orientation": media == null ? "vertical" : orientation,
    className: cx(styles.linkCard, className),
    children:
      media == null ? (
        content
      ) : (
        <>
          <div className={styles.media}>{media}</div>
          <div className={styles.linkContent}>{content}</div>
        </>
      ),
  };
  return renderLink ? (
    renderLink(anchorProps)
  ) : (
    <a {...anchorProps}>{anchorProps.children}</a>
  );
};
