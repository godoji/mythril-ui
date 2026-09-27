import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FilterBar,
  PageContainer,
  PageHeader,
  Select,
  Stack,
  TextInput,
} from "../index.js";
import { componentCatalog } from "./component-catalog.js";
import styles from "./explore.module.css";
const Directory = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const entries = componentCatalog.filter(
    (item) =>
      `${item.name} ${item.category} ${item.components.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!category || item.category === category),
  );
  return (
    <PageContainer width="wide">
      <Stack gap="6">
        <PageHeader
          title="Component directory"
          description="Choose a component to see its states, controls, and API documentation."
        />
        <FilterBar label="Find components">
          <TextInput
            label="Search components"
            type="search"
            placeholder="Forms, navigation, picker…"
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
          />
          <Select
            label="Category"
            value={category}
            onChange={(event) => {
              setCategory(event.currentTarget.value);
            }}
          >
            <option value="">All components</option>
            {Array.from(new Set(componentCatalog.map((item) => item.category)))
              .sort()
              .map((name) => (
                <option key={name}>{name}</option>
              ))}
          </Select>
        </FilterBar>
        <div className={styles.count} role="status">
          {String(entries.length)} component groups
        </div>
        <div className={styles.catalog}>
          {entries.map((item) => (
            <a href={item.href} key={item.name} target="_top">
              <strong>{item.name}</strong>
              <small>{item.category}</small>
              {item.components.length > 1 && (
                <small>{item.components.join(", ")}</small>
              )}
            </a>
          ))}
        </div>
        {entries.length === 0 && (
          <p>No matching components. Try another name or category.</p>
        )}
      </Stack>
    </PageContainer>
  );
};
const meta = {
  title: "Start here/Component directory",
  component: Directory,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Directory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Browse: Story = {};
