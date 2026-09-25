import { act } from "react";
import type { ReactElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button/button.js";
import { ToastProvider, useToast } from "./toast.js";

const Trigger = (): ReactElement => {
  const { show } = useToast();
  return (
    <Button onClick={() => show({ message: "Saved", tone: "success" })}>
      Save
    </Button>
  );
};

describe("ToastProvider", () => {
  it("announces and dismisses transient status", () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider duration={1000}>
          <Trigger />
        </ToastProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Save" }));
      expect(screen.getByRole("status")).toHaveTextContent("Saved");
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("preserves the remaining dismissal time while hovered", () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider duration={1000}>
          <Trigger />
        </ToastProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Save" }));
      const status = screen.getByRole("status");
      act(() => {
        vi.advanceTimersByTime(400);
      });
      fireEvent.mouseEnter(status);
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(status).toBeInTheDocument();
      fireEvent.mouseLeave(status);
      act(() => {
        vi.advanceTimersByTime(599);
      });
      expect(status).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
