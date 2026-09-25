import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea.js";

describe("Textarea autoResize", () => {
  it("keeps input semantics and updates height from content", async () => {
    const user = userEvent.setup();
    Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
      configurable: true,
      get: () => 92,
    });
    try {
      render(<Textarea label="Translation" autoResize rows={1} />);
      const input = screen.getByRole("textbox", { name: "Translation" });
      await user.type(input, "A translated phrase");
      expect(input).toHaveStyle({ height: "92px" });
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
      const { rerender } = render(<Textarea label="Translation" autoResize />);
      const input = screen.getByRole("textbox", { name: "Translation" });
      expect(input).toHaveStyle({ height: "92px", overflowY: "hidden" });
      rerender(<Textarea label="Translation" autoResize={false} />);
      expect(input.style.height).toBe("");
      expect(input.style.overflowY).toBe("");
    } finally {
      Reflect.deleteProperty(HTMLTextAreaElement.prototype, "scrollHeight");
    }
  });
});
