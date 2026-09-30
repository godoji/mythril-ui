import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeText } from "./code-text.js";

describe("CodeText", () => {
  it("preserves diff text and renders unsafe markup as text", () => {
    const code =
      "*** Update File: view.tsx\n@@\n-previous\n+<script>alert(1)</script>\n context\n";
    const { container } = render(
      <CodeText code={code} format="diff" aria-label="Patch" />,
    );
    expect(screen.getByLabelText("Patch").textContent).toBe(code);
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector('[data-line="added"]')?.textContent).toBe(
      "+<script>alert(1)</script>\n",
    );
    expect(container.querySelector('[data-line="removed"]')?.textContent).toBe(
      "-previous\n",
    );
  });

  it("forwards native attributes and refs without adding controls", () => {
    let element: HTMLPreElement | null = null;
    const { container } = render(
      <CodeText
        code="output"
        tabIndex={0}
        ref={(value) => {
          element = value;
        }}
      />,
    );
    expect(element).toBe(container.querySelector("pre"));
    expect(container.querySelector("pre")?.tabIndex).toBe(0);
    expect(container.querySelector("button")).toBeNull();
  });
});
