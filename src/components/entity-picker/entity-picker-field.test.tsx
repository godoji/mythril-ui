import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EntityPicker } from "./entity-picker.js";
import { MessagesProvider } from "../messages/messages.js";

describe("EntityPicker field contract", () => {
  it("forwards refs and connects errors, descriptions and translated removal labels", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    render(
      <MessagesProvider messages={{ remove: (label) => `Verwijder ${label}` }}>
        <EntityPicker
          id="categories"
          label="Categories"
          ref={ref}
          description="Choose up to three"
          error="Select a category"
          selected={[{ value: "one", label: "One" }]}
          options={[]}
          onSelectedChange={() => {}}
        />
      </MessagesProvider>,
    );
    const input = screen.getByRole("combobox");
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("id", "categories");
    expect(input).toHaveAccessibleDescription(
      "Choose up to three Select a category",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("button", { name: "Verwijder One" })).toBeEnabled();
    await user.click(screen.getByText("Categories", { selector: "label" }));
    expect(input).toHaveFocus();
  });
});
