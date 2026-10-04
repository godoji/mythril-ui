import type { ReactElement } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Textarea } from "./textarea.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Textarea autoResize", () => {
  it("keeps input semantics and updates height from content", async () => {
    const user = userEvent.setup();
    Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
      configurable: true,
      get: () => 92,
    });
    try {
      render(
        <Textarea
          label="Translation"
          autoResize
          rows={1}
          style={{ border: "1px solid", boxSizing: "border-box" }}
        />,
      );
      const input = screen.getByRole("textbox", { name: "Translation" });
      await user.type(input, "A translated phrase");
      expect(input).toHaveStyle({ height: "94px" });
      expect(input).toHaveValue("A translated phrase");
    } finally {
      Reflect.deleteProperty(HTMLTextAreaElement.prototype, "scrollHeight");
    }
  });
  it("clears inline sizing when auto-resize is turned off", () => {
    Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
      configurable: true,
      get: () => 92,
    });
    try {
      const { rerender } = render(
        <Textarea
          label="Translation"
          autoResize
          style={{ border: "1px solid", boxSizing: "border-box" }}
        />,
      );
      const input = screen.getByRole("textbox", { name: "Translation" });
      expect(input).toHaveStyle({ height: "94px", overflowY: "hidden" });
      rerender(<Textarea label="Translation" autoResize={false} />);
      expect(input.style.height).toBe("");
      expect(input.style.overflowY).toBe("");
    } finally {
      Reflect.deleteProperty(HTMLTextAreaElement.prototype, "scrollHeight");
    }
  });

  it("resizes when a hidden field is revealed or its container width changes", () => {
    let notify: (() => void) | undefined;
    let resizeFrame: FrameRequestCallback | undefined;
    let nextFrame = 0;
    const requestFrame = vi.fn((callback: FrameRequestCallback) => {
      resizeFrame = callback;
      return ++nextFrame;
    });
    const cancelFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", requestFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelFrame);
    const disconnect = vi.fn();
    class Observer implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notify = () => {
          callback([], this);
        };
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = disconnect;
    }
    vi.stubGlobal("ResizeObserver", Observer);
    const field = (hidden: boolean): ReactElement => (
      <div hidden={hidden}>
        <Textarea
          label="Translation"
          autoResize
          value={"Line\n".repeat(15)}
          readOnly
          style={{ border: "1px solid", boxSizing: "border-box" }}
        />
      </div>
    );
    const { rerender, unmount } = render(field(true));
    const input = screen.getByLabelText<HTMLTextAreaElement>("Translation");
    let contentHeight = 320;
    Object.defineProperty(input, "scrollHeight", {
      configurable: true,
      get: () => contentHeight,
    });
    const measure = vi.spyOn(input, "getBoundingClientRect");
    measure.mockReturnValue(new DOMRect(0, 0, 0, 0));
    act(() => notify?.());
    expect(input.style.height).toBe("");
    rerender(field(false));
    measure.mockReturnValue(new DOMRect(0, 0, 300, 80));
    act(() => notify?.());
    expect(input.style.height).toBe("");
    act(() => resizeFrame?.(0));
    expect(input).toHaveStyle({ height: "322px", overflowY: "hidden" });
    contentHeight = 520;
    measure.mockReturnValue(new DOMRect(0, 0, 150, 322));
    act(() => notify?.());
    act(() => resizeFrame?.(0));
    expect(input).toHaveStyle({ height: "522px" });
    measure.mockReturnValue(new DOMRect(0, 0, 150, 522));
    act(() => notify?.());
    expect(requestFrame).toHaveBeenCalledTimes(2);
    measure.mockReturnValue(new DOMRect(0, 0, 100, 522));
    act(() => notify?.());
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(cancelFrame).toHaveBeenCalledWith(3);
  });

  it("caps rows including padding and borders, and allows scrolling past the cap", () => {
    Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
      configurable: true,
      get: () => 92,
    });
    try {
      render(
        <Textarea
          label="Translation"
          autoResize
          maxRows={2}
          style={{
            lineHeight: "20px",
            padding: 4,
            border: "1px solid",
            boxSizing: "border-box",
          }}
        />,
      );
      expect(screen.getByRole("textbox")).toHaveStyle({
        height: "50px",
        overflowY: "auto",
      });
    } finally {
      Reflect.deleteProperty(HTMLTextAreaElement.prototype, "scrollHeight");
    }
  });
});
