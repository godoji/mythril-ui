import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft, Download } from "lucide-react";
import { ButtonLink, buttonLinkProps } from "./button-link.js";

const meta = {
  title: "Components/ButtonLink",
  component: ButtonLink,
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonLink>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { href: "#orders", children: "Back to orders" },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
      <ButtonLink href="#orders" icon={ArrowLeft}>
        Back to orders
      </ButtonLink>
      <ButtonLink href="#download" variant="primary" icon={Download}>
        Download PDF
      </ButtonLink>
      <a
        href="#route"
        {...buttonLinkProps({ variant: "ghost", size: "small" })}
      >
        Router Link style
      </a>
    </div>
  ),
};
