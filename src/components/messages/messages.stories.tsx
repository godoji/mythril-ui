import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessagesProvider } from "./messages.js";
import { Pagination } from "../pagination/pagination.js";
import { FileDropzone } from "../file-dropzone/file-dropzone.js";
import { Stack } from "../stack/stack.js";
const meta = {
  title: "Components/Messages",
  component: MessagesProvider,
  tags: ["autodocs"],
} satisfies Meta<typeof MessagesProvider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: {
    messages: {
      previous: "Vorige",
      next: "Volgende",
      chooseFile: "Bestand kiezen",
      pagePosition: (page) => `Pagina ${String(page)}`,
    },
    children: (
      <Stack>
        <Pagination
          label="Resultaten"
          page={1}
          hasNextPage
          onPageChange={() => {}}
        />
        <FileDropzone label="Afbeelding" onFiles={() => {}} />
      </Stack>
    ),
  },
};
