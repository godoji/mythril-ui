import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Bold, Copy, Italic } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Toolbar } from "./toolbar.js";
import { ToggleButton } from "./toggle-button.js";

describe("editor commands", () => {
  it("navigates toolbar actions with arrows and skips disabled items", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Toolbar
        label="Formatting"
        items={[
          { id: "bold", label: "Bold", icon: Bold, onPress },
          { id: "copy", label: "Copy", icon: Copy, disabled: true, onPress },
          { id: "italic", label: "Italic", icon: Italic, onPress },
        ]}
      />,
    );
    const bold = screen.getByRole("button", { name: "Bold" });
    const italic = screen.getByRole("button", { name: "Italic" });
    bold.focus();
    await user.keyboard("{ArrowRight}");
    expect(italic).toHaveFocus();
    expect(italic).toHaveAttribute("tabindex", "0");
    await user.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("exposes and changes a toggle button's pressed state", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleButton onPressedChange={onPressedChange}>Preview</ToggleButton>,
    );
    const toggle = screen.getByRole("button", { name: "Preview" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});
