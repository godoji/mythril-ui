import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Paperclip, Send } from "lucide-react";
import { Button } from "../button/button.js";
import { IconButton } from "../icon-button/icon-button.js";
import { TextareaComposer } from "./textarea-composer.js";

const Example = (): ReactElement => {
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState("");
  return (
    <form
      style={{ maxWidth: "36rem" }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(note.trim());
        setNote("");
      }}
    >
      <TextareaComposer
        label="Add a note"
        placeholder="Write a note about this run…"
        rows={3}
        value={note}
        onChange={(event) => {
          setNote(event.currentTarget.value);
        }}
        actions={
          <>
            <IconButton icon={Paperclip} label="Attach file" size="small" />
            <Button
              type="submit"
              variant="primary"
              size="small"
              icon={Send}
              disabled={!note.trim()}
            >
              Add note
            </Button>
          </>
        }
      />
      {submitted && <p>Saved locally: {submitted}</p>}
    </form>
  );
};

const meta = {
  title: "Components/TextareaComposer",
  component: TextareaComposer,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof TextareaComposer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Add a note", actions: null },
  render: () => <Example />,
};
