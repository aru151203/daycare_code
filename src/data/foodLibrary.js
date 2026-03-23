// ─── Food library (per serving nutrient values in grams) ─────────────────────
export const FOOD_LIBRARY = [
  { id: "poha",      name: "Vegetable Poha",   protein: 3,  carbs: 28, fat: 2, fiber: 2 },
  { id: "banana",    name: "Banana Slices",    protein: 1,  carbs: 23, fat: 0, fiber: 3 },
  { id: "milk",      name: "Warm Milk",        protein: 4,  carbs: 12, fat: 3, fiber: 0 },
  { id: "khichdi",   name: "Dal Khichdi",      protein: 8,  carbs: 32, fat: 4, fiber: 3 },
  { id: "chapati",   name: "Chapati",          protein: 3,  carbs: 18, fat: 1, fiber: 2 },
  { id: "cucumber",  name: "Cucumber Salad",   protein: 1,  carbs: 4,  fat: 0, fiber: 1 },
  { id: "idli",      name: "Mini Idli",        protein: 2,  carbs: 12, fat: 0, fiber: 1 },
  { id: "makhana",   name: "Roasted Makhana",  protein: 4,  carbs: 20, fat: 1, fiber: 1 },
  { id: "apple",     name: "Apple Slices",     protein: 0,  carbs: 14, fat: 0, fiber: 2 },
  { id: "rice",      name: "Steamed Rice",     protein: 3,  carbs: 45, fat: 0, fiber: 1 },
  { id: "dal",       name: "Dal",              protein: 9,  carbs: 20, fat: 1, fiber: 4 },
  { id: "sabzi",     name: "Mixed Sabzi",      protein: 2,  carbs: 10, fat: 2, fiber: 3 },
  { id: "curd",      name: "Curd / Yogurt",    protein: 5,  carbs: 6,  fat: 2, fiber: 0 },
  { id: "roti",      name: "Roti",             protein: 3,  carbs: 20, fat: 1, fiber: 2 },
  { id: "upma",      name: "Upma",             protein: 3,  carbs: 25, fat: 3, fiber: 2 },
  { id: "egg",       name: "Boiled Egg",       protein: 6,  carbs: 1,  fat: 5, fiber: 0 },
  { id: "orange",    name: "Orange Slices",    protein: 1,  carbs: 12, fat: 0, fiber: 2 },
  { id: "sandwich",  name: "Veg Sandwich",     protein: 5,  carbs: 30, fat: 4, fiber: 3 },
  { id: "suji",      name: "Suji Halwa",       protein: 3,  carbs: 35, fat: 6, fiber: 1 },
  { id: "poori",     name: "Poori",            protein: 2,  carbs: 22, fat: 5, fiber: 1 },
];

// Returns total nutrients for a list of food IDs, scaled by age multiplier
export function foodNutrients(ids, multiplier = 1) {
  const base = ids.reduce((acc, id) => {
    const f = FOOD_LIBRARY.find((x) => x.id === id);
    if (f) Object.keys(acc).forEach((k) => { acc[k] += f[k]; });
    return acc;
  }, { protein: 0, carbs: 0, fat: 0, fiber: 0 });
  return Object.fromEntries(
    Object.entries(base).map(([k, v]) => [k, Math.round(v * multiplier)])
  );
}