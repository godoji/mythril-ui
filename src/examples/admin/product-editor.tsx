import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { ArrowLeft, Save } from "lucide-react";
import {
  Button,
  Card,
  Combobox,
  EntityPicker,
  FileDropzone,
  FormActions,
  Grid,
  ImagePreview,
  LocalizedField,
  Notice,
  NumberField,
  PageHeader,
  Select,
  Stack,
  TextInput,
} from "../../index.js";
import type { ComboboxOption, EntityPickerOption } from "../../index.js";
import { locales } from "./data.js";
import type { DemoProduct } from "./data.js";
import previewImage from "../../components/image-preview/sample-preview.png";

const producers: ComboboxOption[] = [
  { value: "coast", label: "Coastal estate", description: "France" },
  { value: "hill", label: "Hillside growers", description: "Italy" },
  { value: "valley", label: "Valley cooperative", description: "Spain" },
];
export const ProductEditor = ({
  product,
  onCancel,
  onSave,
}: {
  product: DemoProduct;
  onCancel: () => void;
  onSave: (value: DemoProduct) => void;
}): ReactElement => {
  const [draft, setDraft] = useState(product);
  const [names, setNames] = useState<Record<string, string>>({
    en: product.name,
    nl: "",
    fr: "",
  });
  const [description, setDescription] = useState<Record<string, string>>({
    en: "A small estate selection, ready to share.",
  });
  const [selected, setSelected] = useState<EntityPickerOption[]>([
    { value: "seasonal", label: "Seasonal" },
  ]);
  const [producer, setProducer] = useState<ComboboxOption | undefined>(
    producers[0],
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(producers);
  const [resolvedQuery, setResolvedQuery] = useState("");
  const loading = query !== resolvedQuery;
  const [image, setImage] = useState<string | undefined>(previewImage);
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setResults(
        producers.filter((item) =>
          `${item.label} ${item.description ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        ),
      );
      setResolvedQuery(query);
    }, 250);
    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);
  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) URL.revokeObjectURL(image);
    };
  }, [image]);
  return (
    <Stack
      as="form"
      gap="4"
      onSubmit={(event) => {
        event.preventDefault();
        const name = names.en?.trim();
        if (
          !name ||
          !draft.price ||
          !Number.isFinite(Number(draft.price)) ||
          Number(draft.price) < 0
        ) {
          setError("Enter an English name and a non-negative price.");
          return;
        }
        onSave({ ...draft, name });
      }}
    >
      <PageHeader
        title={product.name || "New product"}
        actions={
          <Button icon={ArrowLeft} onClick={onCancel}>
            Catalog
          </Button>
        }
      />
      {error && <Notice tone="danger">{error}</Notice>}
      <Grid minColumnWidth="22rem">
        <Stack gap="4">
          <Card title="Product details">
            <Stack>
              <LocalizedField
                label="Name"
                locales={locales}
                values={names}
                onValueChange={(locale, value) => {
                  setNames((old) => ({ ...old, [locale]: value }));
                }}
              />
              <LocalizedField
                label="Description"
                locales={locales}
                values={description}
                onValueChange={(locale, value) => {
                  setDescription((old) => ({ ...old, [locale]: value }));
                }}
                multiline
              />
              <Select
                label="Category"
                value={draft.category}
                onChange={(event) => {
                  setDraft({ ...draft, category: event.currentTarget.value });
                }}
              >
                {["White", "Red", "Rosé", "Sparkling"].map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </Select>
              <Combobox
                label="Producer"
                options={results}
                value={producer?.value ?? ""}
                {...(producer && { selectedOption: producer })}
                onOptionSelect={setProducer}
                query={query}
                onQueryChange={setQuery}
                loading={loading}
                filterMode="provided"
              />
              <EntityPicker
                label="Collections"
                layout="inline"
                filterMode="prefix"
                selected={selected}
                onSelectedChange={setSelected}
                options={[
                  { value: "seasonal", label: "Seasonal" },
                  { value: "organic", label: "Organic" },
                  { value: "gifts", label: "Gifts" },
                ]}
              />
            </Stack>
          </Card>
        </Stack>
        <Stack gap="4">
          <Card title="Pricing and stock">
            <Stack>
              <NumberField
                label="Price in euros"
                prefix="€"
                value={draft.price}
                onValueChange={(price) => {
                  setDraft({ ...draft, price });
                }}
                required
              />
              <TextInput
                label="Stock"
                type="number"
                min={0}
                step={1}
                value={draft.stock}
                onChange={(event) => {
                  setDraft({
                    ...draft,
                    stock: event.currentTarget.valueAsNumber || 0,
                  });
                }}
              />
            </Stack>
          </Card>
          <Card title="Product image">
            <Stack>
              {image && (
                <ImagePreview
                  src={image}
                  alt="Product preview"
                  onRemove={() => {
                    setImage(undefined);
                  }}
                />
              )}
              <FileDropzone
                label="Product image"
                description="Preview a local image. Files stay in your browser."
                accept="image/*"
                onFiles={(files) => {
                  const chosen = files[0];
                  if (chosen?.type.startsWith("image/")) {
                    setImage(URL.createObjectURL(chosen));
                    setError("");
                  } else setError("Choose an image file.");
                }}
              />
            </Stack>
          </Card>
        </Stack>
      </Grid>
      <FormActions>
        <Button type="submit" variant="primary" icon={Save}>
          Save product
        </Button>
        <Button onClick={onCancel}>Discard</Button>
      </FormActions>
    </Stack>
  );
};
