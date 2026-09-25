import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button/button.js";
import { TextareaComposer } from "./textarea-composer.js";

describe("TextareaComposer", () => {
  it("keeps native textarea and submit behavior inside a form", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLTextAreaElement>();
    const onSubmit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      expect(new FormData(event.currentTarget).get("note")).toBe("Review this");
    });
    render(
      <form onSubmit={onSubmit}>
        <TextareaComposer
          label="Add a note"
          name="note"
          description="Visible in history."
          ref={ref}
          actions={
            <Button type="submit" size="small">
              Add note
            </Button>
          }
        />
      </form>,
    );

    const textarea = screen.getByRole("textbox", { name: "Add a note" });
    expect(ref.current).toBe(textarea);
    expect(textarea).toHaveAccessibleDescription("Visible in history.");
    await user.type(textarea, "Review this");
    await user.click(screen.getByRole("button", { name: "Add note" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
