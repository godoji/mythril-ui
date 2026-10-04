import { useId, useRef, useState } from "react";
import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { Menu } from "lucide-react";
import { Drawer } from "../drawer/drawer.js";
import { IconButton } from "../icon-button/icon-button.js";
import { NavigationWidthProvider } from "../navigation/navigation.js";
import { cx } from "../../lib/classes.js";
import styles from "./app-shell.module.css";

export interface AppShellProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children"
> {
  header: ReactNode;
  navigation: ReactNode;
  /** Expanded navigation for narrow screens; call close after selecting a destination. */
  mobileNavigation: (close: () => void) => ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  navigationLabel?: string;
  skipLabel?: string;
  mainLabel?: string;
  /** Fill a bounded workspace and scroll panes independently, or scroll with the document. */
  scroll?: "document" | "panes";
  /** Fill the viewport, a parent with a defined height, or only the content. */
  height?: "content" | "parent" | "viewport";
}
/** Responsive application frame; routing and navigation state belong to the consumer. */
export const AppShell = ({
  header,
  navigation,
  mobileNavigation,
  children,
  aside,
  navigationLabel = "Navigation",
  skipLabel = "Skip to content",
  mainLabel,
  scroll = "document",
  height = "content",
  className,
  ...props
}: AppShellProps): ReactElement => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const mainId = useId();
  return (
    <div
      {...props}
      className={cx(styles.shell, className)}
      data-scroll={scroll}
      data-height={height}
    >
      <a className={styles.skip} href={`#${mainId}`}>
        {skipLabel}
      </a>
      <header className={styles.header}>
        <div className={styles.mobileTrigger}>
          <IconButton
            ref={triggerRef}
            icon={Menu}
            label={navigationLabel}
            aria-expanded={open}
            onClick={() => {
              setOpen(true);
            }}
          />
        </div>
        <div className={styles.headerContent}>{header}</div>
      </header>
      <div className={styles.body}>
        <div className={styles.navigation}>{navigation}</div>
        <main
          id={mainId}
          tabIndex={-1}
          aria-label={mainLabel}
          className={styles.main}
        >
          {children}
        </main>
        {aside && <aside className={styles.aside}>{aside}</aside>}
      </div>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title={navigationLabel}
        returnFocus={triggerRef}
      >
        <NavigationWidthProvider width="full">
          {mobileNavigation(() => {
            setOpen(false);
          })}
        </NavigationWidthProvider>
      </Drawer>
    </div>
  );
};
