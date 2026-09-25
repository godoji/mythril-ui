import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UsageMeter } from "./usage-meter.js";

describe("UsageMeter", () => {
  it("distinguishes unknown usage from a reported zero", () => {
    const { rerender } = render(
      <UsageMeter label="Context" value={null} max={100} />,
    );
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    rerender(<UsageMeter label="Context" value={0} max={100} />);
    expect(screen.getByRole("meter", { name: "Context" })).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    expect(screen.getByText("0 / 100")).toBeInTheDocument();
  });
  it("bounds the meter while exposing actual over-limit usage", () => {
    const { rerender } = render(
      <UsageMeter label="Context" value={120} max={100} unit="tokens" />,
    );
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByRole("meter")).toHaveAttribute(
      "aria-valuetext",
      "120 / 100 tokens",
    );
    rerender(<UsageMeter label="Context" value={1} max={0} />);
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });
});
