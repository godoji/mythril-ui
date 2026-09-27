import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BookOpen,
  LayoutDashboard,
  Layers,
  Package,
  Plus,
  Settings,
} from "lucide-react";
import {
  Button,
  ButtonLink,
  Card,
  Checkbox,
  CodeBlock,
  Grid,
  IconButton,
  Inline,
  LinkCard,
  PageContainer,
  Select,
  Stack,
  StatusBadge,
  TextInput,
  Theme,
} from "../index.js";
import styles from "./explore.module.css";
const ThemeSample = ({ mode }: { mode: "light" | "dark" }): ReactElement => {
  const [enabled, setEnabled] = useState(true);
  return (
    <Theme mode={mode} className={styles.preview}>
      <Inline style={{ justifyContent: "space-between" }}>
        <strong>{mode === "light" ? "Light" : "Dark"}</strong>
        <StatusBadge tone="success">Published</StatusBadge>
      </Inline>
      <TextInput label="Collection name" defaultValue="Summer selection" />
      <Inline align="end">
        <Select label="Visibility" defaultValue="public">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </Select>
        <IconButton icon={Settings} label="Collection settings" />
      </Inline>
      <Checkbox
        label="Featured collection"
        checked={enabled}
        onChange={(event) => {
          setEnabled(event.currentTarget.checked);
        }}
      />
      <Button
        icon={Plus}
        onClick={() => {
          setEnabled(!enabled);
        }}
      >
        {enabled ? "Remove from featured" : "Add to featured"}
      </Button>
    </Theme>
  );
};
const Welcome = (): ReactElement => (
  <PageContainer width="wide">
    <div className={styles.explore}>
      <div className={styles.intro}>
        <h1>Mythril UI</h1>
        <p>
          Compact React components for editors, admin tools, and workspaces.
          Explore complete interfaces, try the controls, and inspect their
          source.
        </p>
      </div>
      <Grid minColumnWidth="16rem">
        <LinkCard
          title="Live component gallery"
          description="Try buttons, fields, selections, overlays, and feedback together."
          href="?path=/story/examples-component-gallery--overview"
          target="_top"
          icon={<Layers size={20} />}
        />
        <LinkCard
          title="Component directory"
          description="Search the full library by task or component name."
          href="?path=/story/start-here-component-directory--browse"
          target="_top"
          icon={<Layers size={20} />}
        />
        <LinkCard
          title="Admin workspace"
          description="Filter a catalog, edit a product, and switch views."
          href="?path=/story/examples-admin-workspace--catalog"
          target="_top"
          icon={<LayoutDashboard size={20} />}
        />
        <LinkCard
          title="Content studio"
          description="Edit translations and reorder reusable sections."
          href="?path=/story/examples-admin-workspace--content-studio"
          target="_top"
          icon={<BookOpen size={20} />}
        />
        <LinkCard
          title="Product editor"
          description="Compose forms, remote pickers, and image uploads."
          href="?path=/story/examples-admin-workspace--product-editor"
          target="_top"
          icon={<Package size={20} />}
        />
      </Grid>
      <section className={styles.section}>
        <h2>One library, two themes</h2>
        <Grid minColumnWidth="18rem">
          <ThemeSample mode="light" />
          <ThemeSample mode="dark" />
        </Grid>
      </section>
      <section className={styles.section}>
        <h2>Start with a few components</h2>
        <Grid minColumnWidth="20rem">
          <Card
            title="Build with composition"
            description="Use Stack and Grid for spacing, Card for grouping, and native controls for predictable forms."
          >
            <Stack>
              <p>
                All examples run locally in your browser. Use the Storybook
                toolbar to switch themes and the Docs view on each component to
                inspect props.
              </p>
              <ButtonLink
                href="?path=/story/components-page-layout--overview"
                target="_top"
              >
                Explore layouts
              </ButtonLink>
            </Stack>
          </Card>
          <CodeBlock
            language="tsx"
            code={
              'import { Theme, Stack, TextInput, Button } from "@godoji/mythril-ui";\nimport "@godoji/mythril-ui/styles.css";\n\n<Theme mode="light">\n  <Stack as="form">\n    <TextInput label="Name" name="name" required />\n    <Button type="submit" variant="primary">Save</Button>\n  </Stack>\n</Theme>'
            }
          />
        </Grid>
      </section>
    </div>
  </PageContainer>
);
const meta = {
  title: "Start here/Welcome",
  component: Welcome,
  parameters: { controls: { disable: true } },
} satisfies Meta<typeof Welcome>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
