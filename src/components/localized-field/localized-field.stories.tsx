import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocalizedField } from "./localized-field.js";
import { Stack } from "../stack/stack.js";
const locales = [
  { code: "en", label: "English" },
  { code: "nl", label: "Nederlands" },
  { code: "fr", label: "Français" },
];
const Example = (): ReactElement => {
  const [values, setValues] = useState<Record<string, string>>({
    en: "Summer collection",
    nl: "Zomercollectie",
  });
  return (
    <Stack>
      <LocalizedField
        label="Title"
        locales={locales}
        values={values}
        onValueChange={(locale, value) => {
          setValues((old) => ({ ...old, [locale]: value }));
        }}
      />
      <LocalizedField
        label="Description"
        locales={locales}
        values={{ en: "A selection for long summer evenings." }}
        onValueChange={() => {}}
        multiline
        disabled
      />
      <LocalizedField
        label="Required title"
        locales={locales}
        values={{}}
        errors={{ fr: "Add a French title before publishing." }}
        activeLocale="fr"
        onValueChange={() => {}}
      />
    </Stack>
  );
};
const meta = {
  title: "Components/LocalizedField",
  component: LocalizedField,
  tags: ["autodocs"],
} satisfies Meta<typeof LocalizedField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Title", locales, values: {}, onValueChange: () => {} },
  render: () => <Example />,
};
