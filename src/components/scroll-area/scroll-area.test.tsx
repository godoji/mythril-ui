import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollArea } from "./scroll-area.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ScrollArea", () => {
  it("follows appended output, pauses while reading, and resumes explicitly", async () => {
    const user = userEvent.setup();
    const onFollowChange = vi.fn();
    const { rerender } = render(
      <ScrollArea label="History" followLatest onFollowChange={onFollowChange}>
        First
      </ScrollArea>,
    );
    const viewport = screen.getByRole("region", { name: "History" });
    Object.defineProperties(viewport, {
      scrollHeight: { configurable: true, value: 1000 },
      clientHeight: { configurable: true, value: 200 },
    });
    rerender(
      <ScrollArea label="History" followLatest onFollowChange={onFollowChange}>
        Second
      </ScrollArea>,
    );
    expect(viewport.scrollTop).toBe(1000);
    viewport.scrollTop = 100;
    fireEvent.scroll(viewport);
    rerender(
      <ScrollArea label="History" followLatest onFollowChange={onFollowChange}>
        Third
      </ScrollArea>,
    );
    expect(viewport.scrollTop).toBe(100);
    expect(onFollowChange).toHaveBeenCalledWith(false);
    await user.click(screen.getByRole("button", { name: "Jump to latest" }));
    expect(viewport.scrollTop).toBe(1000);
    expect(onFollowChange).toHaveBeenLastCalledWith(true);
    expect(
      screen.queryByRole("button", { name: "Jump to latest" }),
    ).not.toBeInTheDocument();
  });

  it("responds to resized content and disconnects its observer", () => {
    let notify: (() => void) | undefined;
    const disconnect = vi.fn();
    class Observer {
      constructor(callback: () => void) {
        notify = callback;
      }
      observe = vi.fn();
      disconnect = disconnect;
    }
    vi.stubGlobal("ResizeObserver", Observer);
    const { unmount } = render(
      <ScrollArea label="History" followLatest>
        Output
      </ScrollArea>,
    );
    const viewport = screen.getByRole("region", { name: "History" });
    Object.defineProperties(viewport, {
      scrollHeight: { configurable: true, value: 700 },
      clientHeight: { configurable: true, value: 200 },
    });
    act(() => {
      notify?.();
    });
    expect(viewport.scrollTop).toBe(700);
    viewport.scrollTop = 0;
    fireEvent.scroll(viewport);
    act(() => {
      notify?.();
    });
    expect(viewport.scrollTop).toBe(0);
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("leaves ordinary scroll areas stationary when content changes", () => {
    const { rerender } = render(<ScrollArea label="Details">First</ScrollArea>);
    const viewport = screen.getByRole("region", { name: "Details" });
    Object.defineProperty(viewport, "scrollHeight", { value: 1000 });
    viewport.scrollTop = 80;
    rerender(<ScrollArea label="Details">Second</ScrollArea>);
    expect(viewport.scrollTop).toBe(80);
  });
});
