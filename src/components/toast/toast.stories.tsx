import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { ToastProvider, useToast } from "./toast.js";
import type { ToastTone } from "./toast.js";

const Trigger = (): ReactElement => {
  const { show } = useToast();
  const tones: ToastTone[] = ["info", "success", "warning", "danger"];
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {tones.map((tone) => (
        <Button
          key={tone}
          variant={tone === "info" ? "secondary" : tone}
          onClick={() =>
            show({ tone, message: `${tone} message from the editor.` })
          }
        >
          Show {tone}
        </Button>
      ))}
    </div>
  );
};
const meta = {
  title: "Components/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof ToastProvider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <Trigger />
    </ToastProvider>
  ),
};
