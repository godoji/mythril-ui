import { useRef, useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Dialog } from "./dialog.js";
const Example = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [wideOpen, setWideOpen] = useState(false);
  const cancel = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button
        variant="danger"
        onClick={() => {
          setOpen(true);
        }}
      >
        Delete saved output
      </Button>
      <Button
        onClick={() => {
          setWideOpen(true);
        }}
      >
        Edit wide panel
      </Button>
      {deleted && <p role="status">Output deleted in this example.</p>}
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        title="Delete saved output?"
        description="This removes the saved copy. This action cannot be undone."
        initialFocus={cancel}
        footer={
          <>
            <Button
              ref={cancel}
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setDeleted(true);
                setOpen(false);
              }}
            >
              Delete output
            </Button>
          </>
        }
      />
      <Dialog
        open={wideOpen}
        onOpenChange={setWideOpen}
        size="large"
        title="Edit homepage tile"
        footer={
          <Button
            onClick={() => {
              setWideOpen(false);
            }}
          >
            Done
          </Button>
        }
      >
        <p>Large dialog width for an editor form.</p>
      </Dialog>
    </>
  );
};
const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  render: Example,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj;
export const Overview: Story = {};
