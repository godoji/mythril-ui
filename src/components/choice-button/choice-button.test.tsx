import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChoiceButton } from "./choice-button.js";

describe("ChoiceButton", () => {
  it("defaults to a non-submitting native button and forwards disabled state", async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    const choose = vi.fn();
    render(
      <form onSubmit={submit}>
        <ChoiceButton label="Available" onClick={choose} />
        <ChoiceButton label="Unavailable" disabled onClick={choose} />
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Available" }));
    await user.click(screen.getByRole("button", { name: "Unavailable" }));
    expect(choose).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
  });
});
