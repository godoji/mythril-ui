import { useState } from "react";
import type { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../button/button.js";
import { Drawer } from "./drawer.js";

const Example = (): ReactElement => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open menu
      </Button>
      <Drawer open={open} onOpenChange={setOpen} title="Navigation">
        <Button>Products</Button>
      </Drawer>
    </>
  );
};

describe("Drawer", () => {
  it("traps focus, dismisses on Escape and returns focus", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    const panel = screen.getByRole("dialog", { name: "Navigation" });
    expect(panel).toHaveAttribute("aria-modal", "true");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Close panel" })).toHaveFocus(),
    );
    // The focused close icon's tooltip consumes the first Escape.
    await user.keyboard("{Escape}{Escape}");
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Navigation" }),
      ).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });
});
