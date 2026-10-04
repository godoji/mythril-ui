import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress.js";

describe("Progress", () => {
  it("distinguishes indeterminate progress from a known zero and preserves the ref", () => {
    const ref = createRef<HTMLProgressElement>();
    const { rerender } = render(<Progress ref={ref} label="Import" />);
    const progress = screen.getByRole("progressbar", { name: "Import" });
    expect(progress).not.toHaveAttribute("value");
    expect(ref.current).toBe(progress);
    rerender(<Progress ref={ref} label="Import" value={0} />);
    expect(progress).toHaveAttribute("value", "0");
    expect(ref.current?.position).toBe(0);
    rerender(<Progress label="Import" />);
    expect(progress).not.toHaveAttribute("value");
  });

  it("bounds progress and handles invalid values without reporting completion", () => {
    const { rerender } = render(
      <Progress label="Import" value={120} max={100} />,
    );
    const progress = screen.getByRole("progressbar", { name: "Import" });
    expect(progress).toHaveAttribute("value", "100");
    expect(progress).toHaveAttribute("max", "100");
    rerender(<Progress label="Import" value={-2} max={0} />);
    expect(progress).toHaveAttribute("value", "0");
    expect(progress).toHaveAttribute("max", "1");
    rerender(<Progress label="Import" value={NaN} />);
    expect(progress).not.toHaveAttribute("value");
  });
});
