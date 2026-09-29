import type { Meta, StoryObj } from "@storybook/react-vite";
import { Disclosure } from "./disclosure.js";

const meta = {
  title: "Components/Disclosure",
  component: Disclosure,
  tags: ["autodocs"],
  args: {
    title: "Command output · 3 lines",
    children: <pre>{"Building package…\nChecking types…\nDone."}</pre>,
  },
} satisfies Meta<typeof Disclosure>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Expanded: Story = { args: { defaultOpen: true } };
export const Disabled: Story = { args: { disabled: true } };
export const TextWithTime: Story = {
  args: {
    variant: "text",
    title: "Built the package",
    trailing: <time dateTime="2026-09-25T09:01:00Z">09:01</time>,
    defaultOpen: true,
    children: <p>Package build finished successfully.</p>,
  },
};
