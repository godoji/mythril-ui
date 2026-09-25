import { useRef, useState } from "react";
import type { ReactElement } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../button/button.js";
import { Dialog } from "./dialog.js";
import { Popover } from "../popover/popover.js";
import { Checkbox } from "../checkbox/checkbox.js";

const Example = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const cancel = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Delete item
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this item?"
        description="This cannot be undone."
        role="alertdialog"
        initialFocus={cancel}
        footer={
          <>
            <Button
              ref={cancel}
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger">Confirm deletion</Button>
          </>
        }
      />
    </>
  );
};
describe("Dialog", () => {
  it("allows interaction with a nested portaled popover", async () => {
    const user = userEvent.setup();
    const Nested = (): ReactElement => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            Open
          </Button>
          <Dialog open={open} onOpenChange={setOpen} title="Settings">
            <Popover
              label="More options"
              trigger={<Button>More options</Button>}
            >
              <Checkbox label="Timestamps" />
            </Popover>
          </Dialog>
        </>
      );
    };
    render(<Nested />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "More options" }));
    const checkbox = await screen.findByRole("checkbox", {
      name: "Timestamps",
    });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "More options" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toBeInTheDocument();
  });
  it("names the dialog, focuses Cancel, traps focus, and restores the trigger on Escape", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Delete item" });
    await user.click(trigger);
    const dialog = await screen.findByRole("alertdialog", {
      name: "Delete this item?",
    });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    await waitFor(() => {
      expect(
        within(dialog).getByRole("button", { name: "Cancel" }),
      ).toHaveFocus();
    });
    await user.tab();
    expect(
      within(dialog).getByRole("button", { name: "Confirm deletion" }),
    ).toHaveFocus();
    await user.tab();
    await waitFor(() => {
      expect(
        within(dialog).getByRole("button", { name: "Close dialog" }),
      ).toHaveFocus();
    });
    await user.keyboard("{Escape}");
    // The close button's tooltip is the topmost layer; Escape dismisses it first.
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it("does not dismiss consequential actions on an outside click", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Delete item" }));
    await user.click(document.body);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });
});
