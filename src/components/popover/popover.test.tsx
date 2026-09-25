import { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button/button.js";
import { Checkbox } from "../checkbox/checkbox.js";
import { Popover } from "./popover.js";

describe("Popover", () => {
  it("preserves trigger handlers and refs, manages focus, and closes on Escape", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Popover
        label="Options"
        trigger={
          <Button ref={ref} onClick={onClick}>
            Options
          </Button>
        }
      >
        <Checkbox label="Timestamps" />
      </Popover>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(
      await screen.findByRole("dialog", { name: "Options" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("checkbox")).toHaveFocus();
    });
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(ref.current).toHaveFocus();
    });
  });
  it("dismisses when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Popover label="Options" trigger={<Button>Options</Button>}>
          <Checkbox label="Timestamps" />
        </Popover>
        <Button>Outside</Button>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Options" }));
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("opens a hover-enabled popover on keyboard focus", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        label="Account actions"
        trigger={<Button>Account</Button>}
        openOn="hover"
      >
        <Button>Sign out</Button>
      </Popover>,
    );
    await user.tab();
    expect(
      await screen.findByRole("dialog", { name: "Account actions" }),
    ).toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole("button", { name: "Sign out" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("opens a hover-enabled popover on pointer hover", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        label="Account actions"
        trigger={<Button>Account</Button>}
        openOn="hover"
      >
        <Button>Sign out</Button>
      </Popover>,
    );
    await user.hover(screen.getByRole("button", { name: "Account" }));
    expect(
      await screen.findByRole("dialog", { name: "Account actions" }),
    ).toBeInTheDocument();
  });
  it("allows click activation in hover mode", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        label="Account actions"
        trigger={<Button>Account</Button>}
        openOn="hover"
      >
        <Button>Sign out</Button>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Account" }));
    expect(
      await screen.findByRole("dialog", { name: "Account actions" }),
    ).toBeInTheDocument();
  });
});
