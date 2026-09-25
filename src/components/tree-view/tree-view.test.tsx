import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TreeView } from "./tree-view.js";

describe("TreeView", () => {
  it("expands, navigates, and selects independently of focus", async () => {
    const user = userEvent.setup();
    const onSelectedIdChange = vi.fn();
    render(
      <TreeView
        label="Files"
        nodes={[
          {
            id: "src",
            label: "Source",
            children: [{ id: "app", label: "App.tsx" }],
          },
          { id: "docs", label: "Docs" },
          { id: "disabled", label: "Disabled", disabled: true },
        ]}
        onSelectedIdChange={onSelectedIdChange}
      />,
    );
    const source = screen.getByRole("treeitem", { name: "Source" });
    source.focus();
    await user.keyboard("{ArrowRight}");
    expect(source).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowRight}");
    const app = screen.getByRole("treeitem", { name: "App.tsx" });
    expect(app).toHaveFocus();
    expect(app).toHaveAttribute("aria-selected", "false");
    await user.keyboard("{Enter}");
    expect(app).toHaveAttribute("aria-selected", "true");
    expect(onSelectedIdChange).toHaveBeenCalledWith("app");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("treeitem", { name: "Docs" })).toHaveFocus();
    expect(screen.getByRole("treeitem", { name: "Disabled" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("skips disabled ancestors when navigating left", async () => {
    const user = userEvent.setup();
    render(
      <TreeView
        label="Outline"
        defaultExpandedIds={["root", "disabled"]}
        nodes={[
          {
            id: "root",
            label: "Root",
            children: [
              {
                id: "disabled",
                label: "Disabled section",
                disabled: true,
                children: [{ id: "leaf", label: "Leaf" }],
              },
            ],
          },
        ]}
      />,
    );
    const leaf = screen.getByRole("treeitem", { name: "Leaf" });
    leaf.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("treeitem", { name: "Root" })).toHaveFocus();
  });
});
