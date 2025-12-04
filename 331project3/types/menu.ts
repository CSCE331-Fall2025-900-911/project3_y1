export interface MenuItem {
    item_id: number;
    item_name: string;
    item_category?: string;
    item_price?: number;
  }

export interface NutritionInfo {
  calories: number;
  sat_fat: number;
  sodium: number;
  carbs: number;
  sugar: number;
  caffeine: number;
}

export const NUTRITION_DATA: Record<number, NutritionInfo> = {
  1: { calories: 980, sat_fat: 16, sodium: 152, carbs: 202, sugar: 85, caffeine: 165 }, // Thai Pearl Milk Tea (L)
  2: { calories: 400, sat_fat: 0, sodium: 1, carbs: 100, sugar: 95, caffeine: 150 },     // Mango Green Tea (L)
  3: { calories: 472, sat_fat: 0, sodium: 0, carbs: 118, sugar: 112, caffeine: 150 },    // Mango Passion Fruit Tea (L)
  4: { calories: 620, sat_fat: 3, sodium: 80, carbs: 130, sugar: 100, caffeine: 150 },   // Mango Boba (L)
  5: { calories: 660, sat_fat: 5, sodium: 110, carbs: 140, sugar: 85, caffeine: 120 },   // Tiger Passion Chess
  6: { calories: 568, sat_fat: 17, sodium: 122, carbs: 98, sugar: 73, caffeine: 0 },     // Strawberry Coconut (L)
  7: { calories: 768, sat_fat: 12, sodium: 130, carbs: 158, sugar: 86, caffeine: 0 },    // Halo-Halo (L)
  8: { calories: 822, sat_fat: 13, sodium: 136, carbs: 167, sugar: 58, caffeine: 120 },  // Matcha Pearl Milk Tea (L)
  9: { calories: 402, sat_fat: 4, sodium: 76, carbs: 79, sugar: 70, caffeine: 120 },     // Matcha w/ Fresh Milk (L)
 10: { calories: 557, sat_fat: 4, sodium: 80, carbs: 117, sugar: 106, caffeine: 130 },   // Mango Matcha w/ Fresh Milk (L)
 11: { calories: 990, sat_fat: 21, sodium: 309, carbs: 186, sugar: 68, caffeine: 20 },   // Oreo w/ Pearl (L)
 12: { calories: 654, sat_fat: 18, sodium: 114, carbs: 115, sugar: 68, caffeine: 0 },    // Taro w/ Pudding (L)
 13: { calories: 803, sat_fat: 10, sodium: 117, carbs: 173, sugar: 68, caffeine: 70 },   // Thai Tea w/ Pearl (L)
 14: { calories: 635, sat_fat: 19, sodium: 144, carbs: 102, sugar: 68, caffeine: 295 },  // Coffee w/ Ice Cream (L)
 15: { calories: 532, sat_fat: 4, sodium: 126, carbs: 111, sugar: 100, caffeine: 130 },  // Strawberry Matcha w/ Fresh Milk (L)
 16: { calories: 543, sat_fat: 0, sodium: 36, carbs: 135, sugar: 89, caffeine: 125 },    // Passion Chess (L)
 17: { calories: 807, sat_fat: 18, sodium: 166, carbs: 153, sugar: 42, caffeine: 120 },  // Classic Pearl Black Milk Tea (L)
 18: { calories: 770, sat_fat: 17, sodium: 150, carbs: 148, sugar: 48, caffeine: 120 },  // Classic Pearl Milk Tea
 19: { calories: 282, sat_fat: 0, sodium: 1, carbs: 72, sugar: 63, caffeine: 0 },        // Honey Lemonade (L)
 20: { calories: 768, sat_fat: 32, sodium: 471, carbs: 99, sugar: 52, caffeine: 350 },    // Coffee Creama (L)
 21: { calories: 758, sat_fat: 15, sodium: 314, carbs: 150, sugar: 46, caffeine: 230 },  // Hokkaido Pearl Milk Tea (L)
 22: { calories: 584, sat_fat: 20, sodium: 145, carbs: 92, sugar: 59, caffeine: 330 },   // Coffee Milk Tea w/ Coffee Jelly (L)
};