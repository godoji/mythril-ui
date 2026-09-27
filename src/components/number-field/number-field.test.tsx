import { useState } from "react";
import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NumberField } from "./number-field.js";

const Example = (): ReactElement => {
  const [value, setValue] = useState("");
  return (
    <NumberField
      label="Price in euros"
      value={value}
      onValueChange={setValue}
      decimalSeparator=","
      prefix="€"
    />
  );
};
describe("NumberField", () => {
  it("preserves intermediate decimal text without coercing empty to zero", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const input = screen.getByRole("textbox");
    await user.type(input, "-12,");
    expect(input).toHaveValue("-12,");
    await user.type(input, "50");
    expect(input).toHaveValue("-12,50");
    expect(input).toBeValid();
    await user.clear(input);
    expect(input).toHaveValue("");
  });
});
