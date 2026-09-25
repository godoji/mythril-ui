import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentPropsWithRef, ReactElement } from "react";
import { useMergeRefs } from "@floating-ui/react";
import { ArrowDown } from "lucide-react";
import { Button } from "../button/button.js";
import { cx } from "../../lib/classes.js";
import styles from "./scroll-area.module.css";

export interface ScrollAreaProps extends ComponentPropsWithRef<"div"> {
  label: string;
  /** Follow appended/resized content until the reader scrolls away. */
  followLatest?: boolean;
  threshold?: number;
  onFollowChange?: (following: boolean) => void;
  latestLabel?: string;
}

/** The ref targets the scroll viewport; className and style target the outer frame. */
export const ScrollArea = ({
  label,
  followLatest = false,
  threshold = 32,
  onFollowChange,
  latestLabel = "Jump to latest",
  children,
  className,
  style,
  ref,
  onScroll,
  ...props
}: ScrollAreaProps): ReactElement => {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const followingRef = useRef(true);
  const [following, setFollowing] = useState(true);
  const mergedRef = useMergeRefs([viewport, ref]);
  const scrollToLatest = useCallback((): void => {
    if (viewport.current)
      viewport.current.scrollTop = viewport.current.scrollHeight;
  }, []);
  const sync = useCallback((): void => {
    if (followLatest && followingRef.current) scrollToLatest();
  }, [followLatest, scrollToLatest]);
  useEffect(() => {
    sync();
  }, [children, sync]);
  useEffect(() => {
    if (
      !viewport.current ||
      !content.current ||
      typeof ResizeObserver === "undefined"
    )
      return;
    const observer = new ResizeObserver(sync);
    observer.observe(viewport.current);
    observer.observe(content.current);
    return (): void => {
      observer.disconnect();
    };
  }, [sync]);
  const updateFollowing = (next: boolean): void => {
    if (next === followingRef.current) return;
    followingRef.current = next;
    setFollowing(next);
    onFollowChange?.(next);
  };
  return (
    <div className={cx(styles.frame, className)} style={style}>
      <div
        {...props}
        ref={mergedRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={styles.viewport}
        onScroll={(event) => {
          const element = event.currentTarget;
          updateFollowing(
            element.scrollHeight - element.scrollTop - element.clientHeight <=
              Math.max(0, threshold),
          );
          onScroll?.(event);
        }}
      >
        <div ref={content}>{children}</div>
      </div>
      {followLatest && !following && (
        <div className={styles.footer}>
          <Button
            size="small"
            onClick={() => {
              updateFollowing(true);
              scrollToLatest();
            }}
          >
            <ArrowDown size={14} aria-hidden="true" />
            {latestLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
