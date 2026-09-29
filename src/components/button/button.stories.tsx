import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Check,
  MoreHorizontal,
  Plus,
  Settings2,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { IconButton } from "../icon-button/icon-button.js";
import { Button } from "./button.js";
import type { ButtonProps } from "./button.js";
import styles from "./button.stories.module.css";

const variants = [
  { variant: "primary", label: "Save", icon: Check },
  { variant: "secondary", label: "Add", icon: Plus },
  { variant: "ghost", label: "Options", icon: MoreHorizontal },
  { variant: "success", label: "Accept", icon: Check },
  { variant: "warning", label: "Review", icon: TriangleAlert },
  { variant: "danger", label: "Delete", icon: Trash2 },
] as const satisfies readonly {
  variant: NonNullable<ButtonProps["variant"]>;
  label: string;
  icon: NonNullable<ButtonProps["icon"]>;
}[];

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
  argTypes: {
    variant: {
      options: variants.map(({ variant }) => variant),
      control: "inline-radio",
    },
    size: { options: ["small", "medium"], control: "inline-radio" },
    icon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className={styles.overview}>
      <h2>Editor buttons</h2>
      <p>Quiet color for semantic actions. Icon-only buttons show a tooltip.</p>
      <div className={styles.matrix}>
        <div
          className={[styles.matrixRow, styles.matrixHeader]
            .filter(Boolean)
            .join(" ")}
        >
          <strong>Variant</strong>
          <strong>Standard</strong>
          <strong>Compact</strong>
          <strong>With icon</strong>
          <strong>Icon only</strong>
        </div>
        {variants.map(({ variant, label, icon }) => (
          <div className={styles.matrixRow} key={variant}>
            <span className={styles.variant}>{variant}</span>
            <Button variant={variant}>{label}</Button>
            <Button variant={variant} size="small">
              {label}
            </Button>
            <Button variant={variant} icon={icon}>
              {label}
            </Button>
            <IconButton
              variant={variant}
              icon={icon}
              label={`${label} action`}
            />
          </div>
        ))}
      </div>
      <div className={styles.disabled}>
        <strong>Selected navigation</strong>
        <IconButton
          icon={Settings2}
          label="Selected settings"
          variant="ghost"
          aria-current="page"
        />
      </div>
      <div className={styles.disabled}>
        <strong>Disabled</strong>
        <Button disabled>Unavailable</Button>
        <IconButton icon={Settings2} label="Settings unavailable" disabled />
      </div>
    </div>
  ),
};
