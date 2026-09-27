import { useState } from "react";
import type { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LocalizedField } from "./localized-field.js";

const Example = ({
  disabled = false,
}: {
  disabled?: boolean;
}): ReactElement => {
  const [values, setValues] = useState<Record<string, string>>({
    en: "Wine",
    nl: "",
  });
  return (
    <form aria-label="Product">
      <LocalizedField
        label="Name"
        name="name"
        locales={[
          { code: "en", label: "English" },
          { code: "nl", label: "Dutch" },
        ]}
        values={values}
        onValueChange={(locale, value) => {
          setValues((old) => ({ ...old, [locale]: value }));
        }}
        disabled={disabled}
        errors={{ nl: "Required translation" }}
      />
    </form>
  );
};
describe("LocalizedField", () => {
  it("reveals required locales and presents accessible native validation feedback", async () => {
    const user = userEvent.setup();
    const RequiredExample = (): ReactElement => {
      const [values, setValues] = useState({ en: "Wine", nl: "" });
      return (
        <form>
          <LocalizedField
            label="Name"
            locales={[
              { code: "en", label: "English" },
              { code: "nl", label: "Dutch", required: true },
            ]}
            values={values}
            onValueChange={(locale, value) => {
              setValues((previous) => ({ ...previous, [locale]: value }));
            }}
          />
          <button type="submit">Save</button>
        </form>
      );
    };
    render(<RequiredExample />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    const input = screen.getByRole<HTMLInputElement>("textbox", {
      name: "Name (Dutch)",
    });
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(input.validationMessage);
    await user.type(input, "Wijn");
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
    expect(input).toHaveAccessibleDescription(input.validationMessage);
  });
  it("retains edits across languages and submits all locales", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("tab", { name: "Dutch · Error" }));
    const input = screen.getByRole("textbox", { name: "Name (Dutch)" });
    expect(input).toHaveAccessibleDescription("Required translation");
    await user.type(input, "Wijn");
    await user.click(screen.getByRole("tab", { name: "English · Complete" }));
    expect(screen.getByRole("textbox")).toHaveValue("Wine");
    const data = new FormData(screen.getByRole("form"));
    expect(data.get("name[nl]")).toBe("Wijn");
    expect(data.get("name[en]")).toBe("Wine");
  });
  it("omits disabled locales from native submission", () => {
    render(<Example disabled />);
    expect(Array.from(new FormData(screen.getByRole("form")))).toEqual([]);
  });
});
