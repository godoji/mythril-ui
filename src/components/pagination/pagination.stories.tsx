import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination.js";

const Example = (): ReactElement => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loaded, setLoaded] = useState(1);
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <Pagination
        label="Orders pages"
        page={page}
        totalPages={5}
        onPageChange={setPage}
        pageSize={pageSize}
        pageSizeOptions={[10, 25, 50]}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
      <Pagination
        label="Order history"
        mode="load-more"
        hasNextPage={loaded < 3}
        onLoadMore={() => {
          setLoaded(loaded + 1);
        }}
      />
    </div>
  );
};
const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  render: Example,
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  args: { label: "Pages", page: 1, onPageChange: () => {} },
};
