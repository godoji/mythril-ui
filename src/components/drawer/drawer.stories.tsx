import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Drawer } from "./drawer.js";

const Example = (): ReactElement => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open navigation
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Navigation"
        description="Move between editor sections."
        footer={
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Done
          </Button>
        }
      >
        <nav aria-label="Sections">
          <a
            href="#products"
            onClick={() => {
              setOpen(false);
            }}
          >
            Products
          </a>
        </nav>
      </Drawer>
    </>
  );
};
const meta = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  render: Example,
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    title: "Navigation",
    children: null,
  },
};
