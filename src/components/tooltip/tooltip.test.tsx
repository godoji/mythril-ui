import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Play } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "../icon-button/icon-button.js";
import { Theme } from "../theme/theme.js";

describe("IconButton and Tooltip", () => {
  it.each(["touch", "pen"])(
    "ignores %s hover and preserves the first click",
    (pointerType) => {
      const onClick = vi.fn();
      render(<IconButton icon={Play} label="Next" onClick={onClick} />);
      const button = screen.getByRole("button", { name: "Next" });
      // jsdom lacks PointerEvent; retain pointerType on the delegated event.
      const enter = new MouseEvent("pointerover", { bubbles: true });
      Object.defineProperty(enter, "pointerType", { value: pointerType });
      fireEvent(button, enter);
      fireEvent.mouseEnter(button);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledOnce();
    },
  );

  it("shows the accessible action label on hover for an icon-only button", async () => {
    const user = userEvent.setup();
    render(<IconButton icon={Play} label="Run action" />);
    const button = screen.getByRole("button", { name: "Run action" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    await user.hover(button);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Run action");
    await user.unhover(button);
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("places navigation labels beside icon-only buttons", async () => {
    const user = userEvent.setup();
    render(
      <IconButton icon={Play} label="Workspace" tooltipPlacement="right" />,
    );
    await user.hover(screen.getByRole("button", { name: "Workspace" }));
    expect(await screen.findByRole("tooltip")).toHaveAttribute(
      "data-placement",
      "right",
    );
  });

  it("opens on focus, dismisses with Escape, and preserves the ref and click handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Theme mode="dark" tokens={{ "--mythril-radius": "8px" }}>
        <IconButton ref={ref} icon={Play} label="Run" onClick={onClick} />
      </Theme>,
    );
    await user.tab();
    expect(ref.current).toHaveFocus();
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Run");
    expect(tooltip.closest('[data-theme="dark"]')).not.toBeNull();
    expect(tooltip.closest('[data-theme="dark"]')).toHaveStyle({
      "--mythril-radius": "8px",
    });
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
    expect(ref.current).toHaveAttribute("type", "button");
  });

  it("explains a disabled action without enabling it", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon={Play} label="Run" disabled onClick={onClick} />);
    await user.tab();
    expect(
      screen.getByRole("group", { name: "Run (unavailable)" }),
    ).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Run");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Run" })).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
