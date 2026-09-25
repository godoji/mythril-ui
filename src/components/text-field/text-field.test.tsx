import { createRef, useState } from "react";
import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextField } from "./text-field.js";

describe("TextField", () => {
  it("links its label, help, error, and caller descriptions", () => {
    render(
      <>
        <p id="external">Names must be unique.</p>
        <TextField
          label="Project"
          description="Choose a short name."
          error="This name is already used."
          aria-describedby="external"
        />
      </>,
    );

    const input = screen.getByRole("textbox", { name: "Project" });
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription(
      "Names must be unique. Choose a short name. This name is already used.",
    );
  });

  it("uses unique generated IDs and accepts an explicit ID and ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <TextField label="First" />
        <TextField label="Second" />
        <TextField label="Third" id="custom-id" ref={ref} />
      </>,
    );

    expect(screen.getByLabelText("First").id).not.toBe(
      screen.getByLabelText("Second").id,
    );
    expect(ref.current).toBe(screen.getByLabelText("Third"));
    expect(ref.current).toHaveAttribute("id", "custom-id");
  });

  it("supports a controlled value and native form submission data", async () => {
    const user = userEvent.setup();
    const ControlledField = (): ReactElement => {
      const [value, setValue] = useState("");
      return (
        <form aria-label="Project details">
          <TextField
            label="Project"
            name="project"
            value={value}
            onChange={(event) => {
              setValue(event.currentTarget.value);
            }}
          />
        </form>
      );
    };
    render(<ControlledField />);
    await user.type(screen.getByRole("textbox", { name: "Project" }), "Anvil");

    expect(
      screen.getByRole("form", { name: "Project details" }),
    ).toHaveFormValues({ project: "Anvil" });
  });

  it("removes stale error descriptions when validation clears", () => {
    const { rerender } = render(<TextField label="Project" error="Required" />);
    rerender(<TextField label="Project" />);

    const input = screen.getByRole("textbox", { name: "Project" });
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByText("Required")).not.toBeInTheDocument();
  });
});
