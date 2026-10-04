import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppShell } from "./app-shell.js";
import { Navigation, NavigationLink } from "../navigation/navigation.js";
import { Theme } from "../theme/theme.js";

describe("AppShell", () => {
  it.each(["light", "dark", undefined] as const)(
    "opens on the first touch click and restores focus with theme %s",
    async (mode) => {
      const user = userEvent.setup();
      const shell = (
        <AppShell
          header="Workspace"
          navigation={<nav aria-label="Desktop">Desktop links</nav>}
          mobileNavigation={(close) => (
            <Navigation label="Mobile">
              <NavigationLink
                label="Products"
                href="#products"
                onClick={close}
              />
            </Navigation>
          )}
        >
          <h1>Products</h1>
        </AppShell>
      );
      render(mode ? <Theme mode={mode}>{shell}</Theme> : shell);
      const trigger = screen.getByRole("button", { name: "Navigation" });
      const enter = new MouseEvent("pointerover", { bubbles: true });
      Object.defineProperty(enter, "pointerType", { value: "touch" });
      fireEvent(trigger, enter);
      fireEvent.mouseEnter(trigger);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      fireEvent.click(trigger);
      expect(
        screen.getByRole("dialog").closest("[data-theme]"),
      ).toHaveAttribute("data-theme", mode ?? "light");
      expect(
        screen.getByRole("navigation", { name: "Mobile" }),
      ).toHaveAttribute("data-width", "full");
      await user.click(
        within(screen.getByRole("dialog")).getByRole("link", {
          name: "Products",
        }),
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
      expect(
        screen
          .getByRole("link", { name: "Skip to content" })
          .getAttribute("href"),
      ).toBe(`#${screen.getByRole("main").id}`);
    },
  );
});
