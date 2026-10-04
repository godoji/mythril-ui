import { useRef, useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Combobox } from "../combobox/combobox.js";
import { EntityPicker } from "../entity-picker/entity-picker.js";
import type { EntityPickerOption } from "../entity-picker/entity-picker.js";
import { Stack } from "../stack/stack.js";
import { TextInput } from "../text-input/text-input.js";
import { Dialog } from "./dialog.js";
const Example = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [wideOpen, setWideOpen] = useState(false);
  const [selected, setSelected] = useState<EntityPickerOption[]>([]);
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
        <Stack>
          <TextInput label="Title" defaultValue="Homepage" />
          <Combobox
            label="Destination"
            options={[
              { value: "products", label: "Products" },
              { value: "collections", label: "Collections" },
            ]}
          />
          <EntityPicker
            label="Labels"
            selected={selected}
            onSelectedChange={setSelected}
            options={[
              { value: "featured", label: "Featured" },
              { value: "seasonal", label: "Seasonal" },
            ]}
          />
        </Stack>
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
