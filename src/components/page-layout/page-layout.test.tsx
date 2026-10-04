import { createRef } from "react";
import type { MouseEvent } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LinkCard } from "./page-layout.js";

describe("LinkCard", () => {
  it("preserves one native anchor, its ref, and router events with horizontal media", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLAnchorElement>();
    const onClick = vi.fn((event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
    });
    render(
      <LinkCard
        ref={ref}
        href="#passage"
        title="Passage"
        description="Observed at noon"
        orientation="horizontal"
        media={<img src="/sample.png" alt="Vehicle" />}
        onClick={onClick}
        renderLink={(props) => (
          <a {...props} data-router="true">
            {props.children}
          </a>
        )}
      >
        <span>Reviewed</span>
      </LinkCard>,
    );
    const link = screen.getByRole("link");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute("href", "#passage");
    expect(link).toHaveAttribute("data-router", "true");
    expect(link).toContainElement(screen.getByRole("img", { name: "Vehicle" }));
    expect(link).toContainElement(screen.getByText("Reviewed"));
    await user.keyboard("{Control>}");
    await user.click(link);
    await user.keyboard("{/Control}");
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0]?.[0].ctrlKey).toBe(true);
  });
});
