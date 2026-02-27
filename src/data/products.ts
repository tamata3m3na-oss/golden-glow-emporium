export interface Product {
  id: number;
  name: string;
  price: number;
  weight: string;
  karat: string;
  description: string;
  imageUrl?: string | null;
  images?: string | null;
  order?: number;
  isDefault?: boolean;
}

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "سبيكة ذهب عيار 24",
    price: 8280,
    weight: "1",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط",
    imageUrl: "https://i.ibb.co/tpBc0ZXp/Whats-App-Image-2026-02-26-at-12-36-12-AM.jpg",
    isDefault: true,
    order: 0,
  },
  {
    id: 2,
    name: "سبيكة 4 جرام ذهب عيار 24",
    price: 31050,
    weight: "4",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 4 جرام",
    imageUrl: "https://i.ibb.co/tpBc0ZXp/Whats-App-Image-2026-02-26-at-12-36-12-AM.jpg",
    isDefault: true,
    order: 1,
  },
  {
    id: 3,
    name: "سبيكة 15 جرام",
    price: 24000,
    weight: "15",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 15 جرام",
    imageUrl: "https://i.ibb.co/tpBc0ZXp/Whats-App-Image-2026-02-26-at-12-36-12-AM.jpg",
    isDefault: true,
    order: 2,
  },
  {
    id: 4,
    name: "سبيكة 8 جرام ذهب عيار 24",
    price: 50000,
    weight: "8",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 8 جرام",
    imageUrl: "https://i.ibb.co/tpBc0ZXp/Whats-App-Image-2026-02-26-at-12-36-12-AM.jpg",
    isDefault: true,
    order: 3,
  },
  {
    id: 5,
    name: "سبيكة 36 جرام",
    price: 100000,
    weight: "36",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 36 جرام",
    imageUrl: "https://i.ibb.co/tpBc0ZXp/Whats-App-Image-2026-02-26-at-12-36-12-AM.jpg",
    isDefault: true,
    order: 4,
  },
  {
    id: 6,
    name: "سبيكة 8 جرام",
    price: 10000,
    weight: "8",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 8 جرام",
    imageUrl: "https://i.ibb.co/tpBc0ZXp/Whats-App-Image-2026-02-26-at-12-36-12-AM.jpg",
    isDefault: true,
    order: 5,
  },
  {
    id: 7,
    name: "سبيكة 14 جرام",
    price: 22000,
    weight: "14",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 14 جرام",
    imageUrl: "https://i.ibb.co/tpBc0ZXp/Whats-App-Image-2026-02-26-at-12-36-12-AM.jpg",
    isDefault: true,
    order: 6,
  },
  {
    id: 8,
    name: "سبيكة 4 جرام ذهب عيار 24",
    price: 12420,
    weight: "4",
    karat: "24",
    description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 4 جرام",
    imageUrl: "https://i.ibb.co/tpBc0ZXp/Whats-App-Image-2026-02-26-at-12-36-12-AM.jpg",
    isDefault: true,
    order: 7,
  },
];

export const getProducts = (): Product[] => {
  try {
    const custom = localStorage.getItem('custom_products');
    const customProducts: Product[] = custom ? JSON.parse(custom) : [];
    const all = [...defaultProducts, ...customProducts];
    return all.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch {
    return [...defaultProducts];
  }
};

export const getProductById = (id: number): Product | undefined => {
  return getProducts().find(p => p.id === id);
};

export const addProduct = (product: Omit<Product, 'id'>) => {
  const custom = localStorage.getItem('custom_products');
  const customProducts: Product[] = custom ? JSON.parse(custom) : [];
  const maxOrder = getProducts().reduce((max, p) => Math.max(max, p.order ?? 0), 0);
  const newProduct: Product = { ...product, id: Date.now(), order: maxOrder + 1, isDefault: false };
  customProducts.push(newProduct);
  localStorage.setItem('custom_products', JSON.stringify(customProducts));
  return newProduct;
};

export const updateProduct = (id: number, updates: Partial<Product>) => {
  const custom = localStorage.getItem('custom_products');
  const customProducts: Product[] = custom ? JSON.parse(custom) : [];
  const idx = customProducts.findIndex(p => p.id === id);
  if (idx !== -1) {
    customProducts[idx] = { ...customProducts[idx], ...updates };
    localStorage.setItem('custom_products', JSON.stringify(customProducts));
    return customProducts[idx];
  }
  return null;
};

export const deleteProduct = (id: number) => {
  const custom = localStorage.getItem('custom_products');
  const customProducts: Product[] = custom ? JSON.parse(custom) : [];
  const updated = customProducts.filter(p => p.id !== id);
  localStorage.setItem('custom_products', JSON.stringify(updated));
};

export const reorderProduct = (id: number, direction: 'up' | 'down') => {
  const all = getProducts();
  const custom = localStorage.getItem('custom_products');
  const customProducts: Product[] = custom ? JSON.parse(custom) : [];

  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return;

  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return;

  const aOrder = all[idx].order ?? idx;
  const bOrder = all[swapIdx].order ?? swapIdx;

  const updateCustom = (pid: number, newOrder: number) => {
    const ci = customProducts.findIndex(p => p.id === pid);
    if (ci !== -1) customProducts[ci].order = newOrder;
  };
  const updateDefault = (pid: number, newOrder: number) => {
    const di = defaultProducts.findIndex(p => p.id === pid);
    if (di !== -1) defaultProducts[di].order = newOrder;
  };

  [all[idx], all[swapIdx]].forEach((p, i) => {
    const newOrder = i === 0 ? bOrder : aOrder;
    if (p.isDefault) updateDefault(p.id, newOrder);
    else updateCustom(p.id, newOrder);
  });

  localStorage.setItem('custom_products', JSON.stringify(customProducts));
};
