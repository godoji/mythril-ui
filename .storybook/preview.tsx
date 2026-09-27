import type { Preview } from "@storybook/react-vite";
import { Theme } from "../src/components/theme/theme.js";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Component color theme",
      toolbar: {
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => (
      <Theme
        mode={context.globals.theme === "light" ? "light" : "dark"}
        style={{
          padding: "1.25rem",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <Story />
      </Theme>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    a11y: { test: "error" },
    options: {
      storySort: {
        order: [
          "Start here",
          ["Welcome", "Component directory"],
          "Examples",
          "Components",
        ],
      },
    },
  },
};

export default preview;
