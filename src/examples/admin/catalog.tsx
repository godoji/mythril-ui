import { useState } from "react";
import type { ReactElement } from "react";
import { Plus, Pencil } from "lucide-react";
import {
  Button,
  Checkbox,
  DataTable,
  DataTableCell,
  DataTableHeadCell,
  DataTableStateRow,
  FilterBar,
  IconButton,
  PageHeader,
  Pagination,
  Select,
  Stack,
  StatusBadge,
  TextInput,
} from "../../index.js";
import { products as initialProducts } from "./data.js";
import type { DemoProduct } from "./data.js";
import { ProductEditor } from "./product-editor.js";

export const Catalog = ({
  startInEditor = false,
}: {
  startInEditor?: boolean;
}): ReactElement => {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<DemoProduct | undefined>(
    startInEditor ? initialProducts[0] : undefined,
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [ascending, setAscending] = useState(true);
  const filtered = products
    .filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) &&
        (!category || item.category === category) &&
        (!inStock || item.stock > 0),
    )
    .sort((a, b) => a.name.localeCompare(b.name) * (ascending ? 1 : -1));
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, pages);
  if (editing)
    return (
      <ProductEditor
        product={editing}
        onCancel={() => {
          setEditing(undefined);
        }}
        onSave={(product) => {
          setProducts((old) =>
            old.some((item) => item.id === product.id)
              ? old.map((item) => (item.id === product.id ? product : item))
              : [...old, product],
          );
          setEditing(undefined);
        }}
      />
    );
  return (
    <Stack gap="4">
      <PageHeader
        title="Products"
        description={`${String(products.length)} products in your catalog`}
        actions={
          <Button
            icon={Plus}
            variant="primary"
            onClick={() => {
              setEditing({
                id: crypto.randomUUID(),
                name: "",
                category: "White",
                price: "0.00",
                stock: 0,
              });
            }}
          >
            Add product
          </Button>
        }
      />
      <FilterBar label="Product filters">
        <TextInput
          label="Search"
          type="search"
          placeholder="Find a product…"
          value={query}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setPage(1);
          }}
        />
        <Select
          label="Category"
          value={category}
          onChange={(event) => {
            setCategory(event.currentTarget.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {["White", "Red", "Rosé", "Sparkling"].map((name) => (
            <option key={name}>{name}</option>
          ))}
        </Select>
        <Checkbox
          label="In stock only"
          checked={inStock}
          onChange={(event) => {
            setInStock(event.currentTarget.checked);
            setPage(1);
          }}
        />
      </FilterBar>
      <DataTable caption="Product catalog" stickyHeader>
        <thead>
          <tr>
            <DataTableHeadCell
              onSort={() => {
                setAscending(!ascending);
              }}
              sortDirection={ascending ? "ascending" : "descending"}
            >
              Product
            </DataTableHeadCell>
            <DataTableHeadCell>Category</DataTableHeadCell>
            <DataTableHeadCell align="end">Price</DataTableHeadCell>
            <DataTableHeadCell>Availability</DataTableHeadCell>
            <DataTableHeadCell>
              <span>Edit</span>
            </DataTableHeadCell>
          </tr>
        </thead>
        <tbody>
          {filtered
            .slice((current - 1) * size, current * size)
            .map((product) => (
              <tr key={product.id}>
                <DataTableCell>
                  <strong>{product.name}</strong>
                </DataTableCell>
                <DataTableCell>{product.category}</DataTableCell>
                <DataTableCell align="end">
                  €{Number(product.price).toFixed(2)}
                </DataTableCell>
                <DataTableCell>
                  <StatusBadge tone={product.stock > 0 ? "success" : "warning"}>
                    {product.stock > 0
                      ? `${String(product.stock)} in stock`
                      : "Out of stock"}
                  </StatusBadge>
                </DataTableCell>
                <DataTableCell>
                  <IconButton
                    icon={Pencil}
                    label={`Edit ${product.name}`}
                    onClick={() => {
                      setEditing(product);
                    }}
                  />
                </DataTableCell>
              </tr>
            ))}
          {filtered.length === 0 && (
            <DataTableStateRow colSpan={5}>
              No products match these filters.
            </DataTableStateRow>
          )}
        </tbody>
      </DataTable>
      <Pagination
        label="Product pages"
        page={current}
        totalPages={pages}
        onPageChange={setPage}
        pageSize={size}
        pageSizeOptions={[5, 10, 25]}
        onPageSizeChange={(next) => {
          setSize(next);
          setPage(1);
        }}
      />
    </Stack>
  );
};
