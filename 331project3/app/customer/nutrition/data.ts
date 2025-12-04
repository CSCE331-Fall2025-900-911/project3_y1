export interface NutritionInfo {
  itemName: string;
  calories: number;
  saturatedFat: number;
  sodium: number;
  carbs: number;
  sugar: number;
  caffeine: number;
}

export const nutritionData: Record<string, NutritionInfo> = {
  "Thai Pearl Milk Tea (L)": {
    itemName: "Thai Pearl Milk Tea (L)",
    calories: 980,
    saturatedFat: 16,
    sodium: 152,
    carbs: 202,
    sugar: 85,
    caffeine: 165
  },
  "Mango Green Tea (L)": {
    itemName: "Mango Green Tea (L)",
    calories: 400,
    saturatedFat: 0,
    sodium: 1,
    carbs: 100,
    sugar: 95,
    caffeine: 150
  },
  "Mango Passion Fruit Tea (L)": {
    itemName: "Mango Passion Fruit Tea (L)",
    calories: 472,
    saturatedFat: 0,
    sodium: 0,
    carbs: 118,
    sugar: 112,
    caffeine: 150
  },

  // TODO: Add the rest of the drinks exactly like above
};
