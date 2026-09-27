import { useState } from "react";
import type { ReactElement } from "react";
import { Save } from "lucide-react";
import {
  Button,
  Checkbox,
  CollectionEditor,
  LocalizedField,
  Notice,
  PageHeader,
  Stack,
  TextInput,
} from "../../index.js";
import { locales } from "./data.js";
interface Section {
  id: string;
  title: Record<string, string>;
  url: string;
  enabled: boolean;
}
export const ContentStudio = (): ReactElement => {
  const [items, setItems] = useState<Section[]>([
    {
      id: "seasonal",
      title: { en: "Seasonal selection", nl: "Seizoensselectie" },
      url: "/collections/seasonal",
      enabled: true,
    },
    {
      id: "makers",
      title: { en: "Meet the makers" },
      url: "/stories",
      enabled: true,
    },
  ]);
  const [saved, setSaved] = useState(false);
  const update = (id: string, changes: Partial<Section>): void => {
    setSaved(false);
    setItems((old) =>
      old.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  };
  return (
    <Stack gap="4">
      <PageHeader
        title="Homepage sections"
        actions={
          <Button
            icon={Save}
            variant="primary"
            onClick={() => {
              setSaved(true);
            }}
          >
            Save changes
          </Button>
        }
      />
      {saved && <Notice tone="success">Changes saved in this preview.</Notice>}
      <CollectionEditor
        label="Homepage sections"
        items={items.map((item) => ({
          id: item.id,
          label: item.title.en || "Untitled section",
          content: (
            <Stack>
              <LocalizedField
                label="Title"
                locales={locales}
                values={item.title}
                onValueChange={(locale, value) => {
                  update(item.id, {
                    title: { ...item.title, [locale]: value },
                  });
                }}
              />
              <TextInput
                label="Destination"
                value={item.url}
                onChange={(event) => {
                  update(item.id, { url: event.currentTarget.value });
                }}
              />
              <Checkbox
                label="Visible on homepage"
                checked={item.enabled}
                onChange={(event) => {
                  update(item.id, { enabled: event.currentTarget.checked });
                }}
              />
            </Stack>
          ),
        }))}
        onMove={(id, to) => {
          const item = items.find((entry) => entry.id === id);
          if (!item) return;
          const next = items.filter((entry) => entry.id !== id);
          next.splice(to, 0, item);
          setItems(next);
          setSaved(false);
        }}
        onRemove={(id) => {
          setItems(items.filter((item) => item.id !== id));
          setSaved(false);
        }}
        onAdd={() => {
          setItems([
            ...items,
            {
              id: crypto.randomUUID(),
              title: { en: "New section" },
              url: "",
              enabled: false,
            },
          ]);
          setSaved(false);
        }}
        addLabel="Add section"
      />
    </Stack>
  );
};
