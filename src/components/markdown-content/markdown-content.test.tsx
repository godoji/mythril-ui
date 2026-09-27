import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "./markdown-content.js";

describe("MarkdownContent", () => {
  it("renders GFM without raw HTML and protects external links", () => {
    const { container } = render(
      <MarkdownContent
        content={
          "| Name |\n| --- |\n| Example |\n\n[External](https://example.com) [Local](#section)\n\n<script>alert(1)</script>"
        }
      />,
    );
    expect(screen.getByRole("table")).toHaveTextContent("Example");
    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByRole("link", { name: "External" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByRole("link", { name: "Local" })).not.toHaveAttribute(
      "target",
    );
  });
});
