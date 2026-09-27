export interface DemoProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
}
export const products: DemoProduct[] = [
  {
    id: "p1",
    name: "Coastal white",
    category: "White",
    price: "18.50",
    stock: 48,
  },
  {
    id: "p2",
    name: "Hillside reserve",
    category: "Red",
    price: "26.00",
    stock: 12,
  },
  { id: "p3", name: "Summer rosé", category: "Rosé", price: "14.75", stock: 0 },
  {
    id: "p4",
    name: "Estate sparkling",
    category: "Sparkling",
    price: "32.00",
    stock: 24,
  },
  {
    id: "p5",
    name: "Orchard white",
    category: "White",
    price: "16.00",
    stock: 36,
  },
  {
    id: "p6",
    name: "Cellar selection",
    category: "Red",
    price: "42.00",
    stock: 8,
  },
];
export const locales = [
  { code: "en", label: "English" },
  { code: "nl", label: "Nederlands" },
  { code: "fr", label: "Français" },
];
