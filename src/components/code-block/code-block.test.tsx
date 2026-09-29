import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./code-block.js";

describe("CodeBlock", () => {
  it("bounds the preview but copies the complete original output", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    const code = "first line\nsecond line\n<script>not HTML</script>";
    render(<CodeBlock code={code} previewLimit={10} />);
    const output = screen.getByRole("region", { name: "Output text" });
    expect(output).toHaveAttribute("data-wrap", "true");
    expect(output.textContent).toBe(code.slice(0, 10));
    await user.click(screen.getByRole("button", { name: "Copy full output" }));
    expect(writeText).toHaveBeenCalledWith(code);
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
    await user.click(screen.getByRole("button", { name: "Show full output" }));
    expect(output.textContent).toBe(code);
    expect(output.querySelector("script")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Show preview" }));
    expect(output.textContent).toBe(code.slice(0, 10));
  });
  it("reports clipboard failures without losing output", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("Permission denied"),
    );
    render(<CodeBlock code="Preserve this text" />);
    await user.click(screen.getByRole("button", { name: "Copy full output" }));
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Copy failed");
    });
    expect(
      screen.getByRole("region", { name: "Output text" }),
    ).toHaveTextContent("Preserve this text");
  });
});
