import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Theme } from "./theme.js";

const meta = {
  title: "Components/Theme",
  component: Theme,
  tags: ["autodocs"],
} satisfies Meta<typeof Theme>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: { children: null },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {(["dark", "light"] as const).map((mode) => (
        <Theme
          key={mode}
          mode={mode}
          style={{ padding: "1rem", width: "16rem", borderRadius: "0.75rem" }}
        >
          <strong>{mode === "dark" ? "Dark" : "Light"}</strong>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
            <Button variant="ghost">Unselected</Button>
            <Button variant="ghost" aria-current="page">
              Selected
            </Button>
            <Button variant="primary">Primary</Button>
          </div>
        </Theme>
      ))}
    </div>
  ),
};
