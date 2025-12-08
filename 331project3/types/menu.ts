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

export const NUTRITION_DATA: Record<string, NutritionInfo> = {
  'Thai Pearl Milk Tea': { calories: 980, sat_fat: 16, sodium: 152, carbs: 202, sugar: 85, caffeine: 165 },
  'Mango Green Tea': { calories: 400, sat_fat: 0, sodium: 1, carbs: 100, sugar: 95, caffeine: 150 },
  'Mango & Passion Fruit Tea': { calories: 472, sat_fat: 0, sodium: 0, carbs: 118, sugar: 112, caffeine: 150 },
  'Mango Boba': { calories: 620, sat_fat: 3, sodium: 80, carbs: 130, sugar: 100, caffeine: 0 },
  'Tiger Passion Chess': { calories: 660, sat_fat: 5, sodium: 110, carbs: 140, sugar: 85, caffeine: 0 },
  'Strawberry Coconut': { calories: 568, sat_fat: 17, sodium: 122, carbs: 98, sugar: 73, caffeine: 0 },
  'Halo Halo': { calories: 768, sat_fat: 12, sodium: 130, carbs: 158, sugar: 86, caffeine: 0 },
  'Matcha Pearl Milk Tea': { calories: 822, sat_fat: 13, sodium: 136, carbs: 167, sugar: 58, caffeine: 120 },
  'Matcha Fresh Milk': { calories: 402, sat_fat: 4, sodium: 76, carbs: 79, sugar: 70, caffeine: 120 },
  'Mango Matcha Fresh Milk': { calories: 557, sat_fat: 4, sodium: 80, carbs: 117, sugar: 106, caffeine: 130 },
  'Oreo w/ Pearl': { calories: 990, sat_fat: 21, sodium: 309, carbs: 186, sugar: 68, caffeine: 20 },
  'Taro w/ Pudding': { calories: 654, sat_fat: 18, sodium: 114, carbs: 115, sugar: 68, caffeine: 0 },
  'Thai Tea w/ Pearl': { calories: 803, sat_fat: 10, sodium: 117, carbs: 173, sugar: 68, caffeine: 70 },
  'Coffee w/ Ice Cream': { calories: 635, sat_fat: 19, sodium: 144, carbs: 102, sugar: 68, caffeine: 295 },
  'Strawberry Matcha Fresh Milk': { calories: 532, sat_fat: 4, sodium: 126, carbs: 111, sugar: 100, caffeine: 130 },
  'Passion Chess 2': { calories: 543, sat_fat: 0, sodium: 36, carbs: 135, sugar: 89, caffeine: 125 },
  'Classic Pearl Milk Tea 2': { calories: 807, sat_fat: 18, sodium: 166, carbs: 153, sugar: 42, caffeine: 120 },
  'Classic Pearl Milk Tea': { calories: 770, sat_fat: 17, sodium: 150, carbs: 148, sugar: 48, caffeine: 120 },
  'Honey Lemonade': { calories: 282, sat_fat: 0, sodium: 1, carbs: 72, sugar: 63, caffeine: 0 },
  'Coffee Creama': { calories: 768, sat_fat: 32, sodium: 471, carbs: 99, sugar: 52, caffeine: 350 },
  'Hokkaido Pearl Milk Tea': { calories: 758, sat_fat: 15, sodium: 314, carbs: 150, sugar: 46, caffeine: 230 },
  'Coffee Milk Tea w/ Coffee Jelly': { calories: 584, sat_fat: 20, sodium: 145, carbs: 92, sugar: 59, caffeine: 330 },
  'Honey Pearl Milk Tea': { calories: 892, sat_fat: 18, sodium: 164, carbs: 175, sugar: 64, caffeine: 135, },
};