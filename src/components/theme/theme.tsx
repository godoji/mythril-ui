import { createContext, useContext } from "react";
import type {
  ComponentPropsWithRef,
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";
import { cx } from "../../lib/classes.js";
import styles from "./theme.module.css";

export interface ThemeTokens extends CSSProperties {
  [name: `--mythril-${string}`]: string | number | undefined;
}

interface ThemeSettings {
  mode: "light" | "dark";
  tokens?: ThemeTokens | undefined;
}
const ThemeContext = createContext<ThemeSettings>({ mode: "light" });

export interface ThemeProps extends ComponentPropsWithRef<"div"> {
  mode?: "light" | "dark";
  /** Custom CSS variables, also applied to portaled overlays. */
  tokens?: ThemeTokens;
}
/** Scopes the theme without changing the host application's global styles. */
export const Theme = ({
  mode = "dark",
  tokens,
  className,
  style,
  children,
  ...props
}: ThemeProps): ReactElement => (
  <ThemeContext.Provider value={{ mode, tokens }}>
    <div
      {...props}
      data-theme={mode}
      className={cx(styles.theme, className)}
      style={{ ...tokens, ...style }}
    >
      {children}
    </div>
  </ThemeContext.Provider>
);

// Portals cannot inherit CSS variables from their original DOM ancestors.
export const OverlayTheme = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const { mode, tokens } = useContext(ThemeContext);
  return (
    <div
      className={cx(styles.theme, styles.overlayTheme)}
      data-theme={mode}
      style={tokens}
    >
      {children}
    </div>
  );
};
