import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Package } from "lucide-react";
import {
  Navigation,
  NavigationLink,
  NavigationAction,
  NavigationGroup,
} from "./navigation.js";
import { Theme } from "../theme/theme.js";

describe("Navigation", () => {
  it("preserves router anchors, active state and disabled actions", async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(
      <Navigation label="Workspace">
        <NavigationLink
          label="Products"
          href="/products"
          current
          renderLink={(props) => (
            <a {...props} data-router="true">
              {props.children}
            </a>
          )}
        />
        <NavigationAction label="Archive" onClick={action} disabled />
      </Navigation>,
    );
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "href",
      "/products",
    );
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(action).not.toHaveBeenCalled();
  });
  it("opens sidebar groups by keyboard and restores focus on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Navigation label="Workspace">
        <NavigationGroup label="Catalog">
          <NavigationLink label="Products" href="/products" />
        </NavigationGroup>
      </Navigation>,
    );
    await user.tab();
    await user.keyboard("{Enter}{Tab}");
    expect(screen.getByRole("link", { name: "Products" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Catalog" })).toHaveFocus();
  });
  it.each(["light", "dark", undefined] as const)(
    "themes rail flyouts in %s and returns focus",
    async (mode) => {
      const user = userEvent.setup();
      const nav = (
        <Navigation label="Workspace" variant="rail">
          <NavigationGroup label="Catalog" icon={Package}>
            <NavigationLink label="Products" href="/products" />
          </NavigationGroup>
        </Navigation>
      );
      render(mode ? <Theme mode={mode}>{nav}</Theme> : nav);
      const trigger = screen.getByRole("button", { name: "Catalog" });
      await user.click(trigger);
      const dialog = screen.getByRole("dialog", { name: "Catalog" });
      expect(dialog.closest("[data-theme]")).toHaveAttribute(
        "data-theme",
        mode ?? "light",
      );
      expect(screen.getByRole("link", { name: "Products" })).toBeVisible();
      await user.keyboard("{Escape}");
      expect(trigger).toHaveFocus();
    },
  );
});
