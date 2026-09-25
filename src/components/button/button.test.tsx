import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArrowRight, Plus } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button.js";

describe("Button", () => {
  it("places a decorative icon before or after a visible label", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <>
        <Button icon={Plus} ref={ref} onClick={onClick}>
          Add entry
        </Button>
        <Button icon={ArrowRight} iconPosition="end" size="small">
          Continue
        </Button>
      </>,
    );

    const leading = screen.getByRole("button", { name: "Add entry" });
    const trailing = screen.getByRole("button", { name: "Continue" });
    expect(leading.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(trailing.lastElementChild).toHaveAttribute("aria-hidden", "true");
    expect(trailing).toHaveAttribute("data-size", "small");
    expect(ref.current).toBe(leading);
    await user.click(leading);
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("supports keyboard activation and forwards its DOM ref", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} onClick={onClick}>
        Save
      </Button>,
    );

    await user.tab();
    expect(ref.current).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not submit a form unless requested", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    render(
      <form onSubmit={onSubmit}>
        <Button>Cancel</Button>
        <Button type="submit">Save</Button>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("preserves native disabled behavior", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    await user.click(button);
    await user.tab();
    expect(button).not.toHaveFocus();
    expect(onClick).not.toHaveBeenCalled();
  });
});
