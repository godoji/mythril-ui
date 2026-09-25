import type { HTMLProps, ReactElement } from "react";
import type { Placement } from "@floating-ui/react";
import { Menu } from "../menu/menu.js";
import type { MenuItem } from "../menu/menu.js";
import type { FloatingBoundary } from "../../lib/floating-position.js";

export interface ContextMenuProps {
  /** Focusable region that forwards DOM props and its ref. */
  children: ReactElement<HTMLProps<HTMLElement>>;
  label: string;
  items: readonly MenuItem[];
  placement?: Placement;
  boundary?: FloatingBoundary | null;
}

/** Action menu at the pointer, ContextMenu key, or Shift+F10 location. */
export const ContextMenu = ({
  children,
  label,
  items,
  placement = "right-start",
  boundary,
}: ContextMenuProps): ReactElement => (
  <Menu
    trigger={children}
    label={label}
    items={items}
    placement={placement}
    {...(boundary !== undefined && { boundary })}
    openOn="contextmenu"
  />
);
