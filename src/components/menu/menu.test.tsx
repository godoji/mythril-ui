import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button/button.js";
import { Menu } from "./menu.js";

describe("Menu", () => {
  it("supports arrows, disabled items, typeahead, selection, and focus return", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Menu
        label="Actions"
        trigger={<Button>Actions</Button>}
        items={[
          { id: "copy", label: "Copy", onSelect },
          { id: "disabled", label: "Unavailable", disabled: true, onSelect },
          { id: "export", label: "Export", onSelect },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.tab();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("menu");
    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus();
    });
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Export" })).toHaveFocus();
    await user.keyboard("c");
    expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it("shows a focus ring only after keyboard interaction", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        label="Actions"
        trigger={<Button>Actions</Button>}
        items={[{ id: "copy", label: "Copy", onSelect: vi.fn() }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Actions" }));
    const menu = await screen.findByRole("menu");
    expect(menu).toHaveAttribute("data-keyboard-focus", "false");
    await user.keyboard("{ArrowDown}");
    expect(menu).toHaveAttribute("data-keyboard-focus", "true");
  });

  it("closes on Escape without selecting an action", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Menu
        label="Actions"
        trigger={<Button>Actions</Button>}
        items={[{ id: "copy", label: "Copy", onSelect }]}
      />,
    );
    await user.click(screen.getByRole("button"));
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    expect(onSelect).not.toHaveBeenCalled();
  });
});
