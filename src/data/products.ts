export interface Product {
  id: number;
  name: string;
  price: number;
  weight: string;
  karat: string;
  description: string;
}

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "سبيكة 36 جرام",
    price: 100000,
    weight: "36",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 36 جرام",
  },
  {
    id: 2,
    name: "سبيكة 8 جرام",
    price: 10000,
    weight: "8",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 8 جرام",
  },
  {
    id: 3,
    name: "سبيكة 14 جرام",
    price: 22000,
    weight: "14",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 14 جرام",
  },
  {
    id: 4,
    name: "سبيكة 4 جرام ذهب عيار 24",
    price: 12420,
    weight: "4",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 4 جرام",
  },
];

export const getProducts = (): Product[] => {
  const custom = localStorage.getItem('custom_products');
  const customProducts: Product[] = custom ? JSON.parse(custom) : [];
  return [...defaultProducts, ...customProducts];
};

export const addProduct = (product: Omit<Product, 'id'>) => {
  const custom = localStorage.getItem('custom_products');
  const customProducts: Product[] = custom ? JSON.parse(custom) : [];
  const newProduct = { ...product, id: Date.now() };
  customProducts.push(newProduct);
  localStorage.setItem('custom_products', JSON.stringify(customProducts));
  return newProduct;
};

export const deleteProduct = (id: number) => {
  const custom = localStorage.getItem('custom_products');
  const customProducts: Product[] = custom ? JSON.parse(custom) : [];
  const updated = customProducts.filter(p => p.id !== id);
  localStorage.setItem('custom_products', JSON.stringify(updated));
};
