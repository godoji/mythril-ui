import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { ScrollArea } from "./scroll-area.js";
const Example = (): ReactElement => {
  const [count, setCount] = useState(30);
  return (
    <div style={{ width: "min(32rem, 80vw)" }}>
      <Button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Append entry
      </Button>
      <p>Scroll up, append an entry, then jump back to latest.</p>
      <ScrollArea followLatest label="Example output">
        {Array.from({ length: count }, (_, index) => (
          <p key={index}>Entry {index + 1}: verification completed.</p>
        ))}
      </ScrollArea>
    </div>
  );
};
const meta = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  render: Example,
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj;
export const FollowLatest: Story = {};
