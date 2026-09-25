import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ResizablePanels } from "./resizable-panels.js";

describe("ResizablePanels", () => {
  it("resizes by keyboard and restores a collapsed pane", async () => {
    const user = userEvent.setup();
    const onSizeChange = vi.fn();
    render(
      <ResizablePanels
        primaryLabel="Sidebar"
        primary="Tasks"
        secondary="History"
        defaultSize={220}
        minSize={120}
        collapsible
        onSizeChange={onSizeChange}
      />,
    );
    const separator = screen.getByRole("separator", { name: "Sidebar" });
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
    expect(separator).toHaveAttribute("aria-valuetext", "220 pixels");
    separator.focus();
    await user.keyboard("{ArrowRight}");
    expect(separator).toHaveAttribute("aria-valuetext", "230 pixels");
    await user.keyboard("{Enter}");
    expect(separator).toHaveAttribute("aria-valuetext", "0 pixels");
    await user.keyboard("{Enter}");
    expect(separator).toHaveAttribute("aria-valuetext", "230 pixels");
    expect(onSizeChange).toHaveBeenCalledWith(230);
  });

  it("resizes by dragging while respecting the secondary minimum", () => {
    const bounds = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: 500,
        bottom: 300,
        width: 500,
        height: 300,
        toJSON: () => ({}),
      });
    try {
      render(
        <ResizablePanels
          primaryLabel="Sidebar"
          primary="Tasks"
          secondary="History"
          defaultSize={200}
          minSecondarySize={150}
        />,
      );
      const separator = screen.getByRole("separator", { name: "Sidebar" });
      fireEvent.pointerDown(separator, {
        pointerId: 1,
        button: 0,
        clientX: 200,
      });
      fireEvent.pointerMove(separator, { pointerId: 1, clientX: 400 });
      expect(separator).toHaveAttribute("aria-valuetext", "346 pixels");
      fireEvent.pointerUp(separator, { pointerId: 1 });
    } finally {
      bounds.mockRestore();
    }
  });
});
