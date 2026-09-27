import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppShell } from "./app-shell.js";

describe("AppShell", () => {
  it("opens mobile navigation and restores focus when a destination closes it", async () => {
    const user = userEvent.setup();
    render(
      <AppShell
        header="Workspace"
        navigation={<nav aria-label="Desktop">Desktop links</nav>}
        mobileNavigation={(close) => <button onClick={close}>Products</button>}
      >
        <h1>Products</h1>
      </AppShell>,
    );
    const trigger = screen.getByRole("button", { name: "Navigation" });
    await user.click(trigger);
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
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
  });
});
