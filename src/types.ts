export type DoughType = "thin" | "traditional";
export type PizzaCategory = "meat" | "vegetarian" | "grill" | "spicy" | "closed";

export interface PizzaSize {
  cm: number;
  price: number;
}

export interface Pizza {
  id: number;
  imageUrl: string;
  title: string;
  types: number[]; // dough type indexes: 0 = thin, 1 = traditional
  sizes: number[]; // cm values, e.g. [26, 30, 40]
  price: number; // base price (for the smallest size, multiplied per size below)
  category: number; // index into CATEGORY_ORDER
  rating: number;
}

// 0/1 dan DoughType'ga aylantirish uchun
export const DOUGH_BY_INDEX: DoughType[] = ["thin", "traditional"];

// API'dagi category-raqamlarning tartibi
export const CATEGORY_ORDER: PizzaCategory[] = [
  "meat",
  "vegetarian",
  "grill",
  "spicy",
  "closed",
];

// Har bir o'lcham (sm) uchun narx ko'paytiruvchisi
export const SIZE_PRICE_MULTIPLIER: Record<number, number> = {
  26: 1,
  30: 1.2,
  40: 1.6,
};

export function priceForSize(basePrice: number, sizeCm: number): number {
  const multiplier = SIZE_PRICE_MULTIPLIER[sizeCm] ?? 1;
  return Math.round(basePrice * multiplier);
}

export const CATEGORY_LABELS: Record<PizzaCategory, string> = {
  meat: "Мясные",
  vegetarian: "Вегетарианская",
  grill: "Гриль",
  spicy: "Острые",
  closed: "Закрытые",
};

export const DOUGH_LABELS: Record<DoughType, string> = {
  thin: "тонкое тесто",
  traditional: "толстое тесто",
};

// Bitta savat elementi: aniq pitsa + tanlangan testo turi + o'lcham kombinatsiyasi
export interface CartItem {
  cartId: string; // `${pizzaId}-${dough}-${cm}`
  pizzaId: number;
  title: string;
  image: string;
  dough: DoughType;
  sizeCm: number;
  unitPrice: number;
  quantity: number;
}