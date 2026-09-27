import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Stack } from "./stack.js";

describe("Stack", () => {
  it("preserves native form submission when rendered as a form", async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    render(
      <Stack as="form" gap="4" onSubmit={submit}>
        <button type="submit">Save</button>
      </Stack>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(submit).toHaveBeenCalledTimes(1);
  });
});
