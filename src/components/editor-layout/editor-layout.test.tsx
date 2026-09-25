import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./editor-layout.js";

describe("Card", () => {
  it("shows a description without requiring a title or actions", () => {
    render(<Card description="Review the product details" />);
    expect(screen.getByText("Review the product details")).toBeVisible();
  });
});
