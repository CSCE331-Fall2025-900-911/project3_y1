'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Hard-coded nutrition data (can later move to DB)
const NUTRITION_DATA = [
  {
    name: "Thai Pearl Milk Tea (L)",
    calories: 980, satFat: 16, sodium: 152, carbs: 202, sugar: 85, caffeine: 165
  },
  { name: "Mango Green Tea (L)", calories: 400, satFat: 0, sodium: 1, carbs: 100, sugar: 95, caffeine: 150 },
  { name: "Mango Passion Fruit Tea (L)", calories: 472, satFat: 0, sodium: 0, carbs: 118, sugar: 112, caffeine: 150 },
  { name: "mango boba (L)", calories: 620, satFat: 3, sodium: 80, carbs: 130, sugar: 100, caffeine: 150 },
  { name: "tiger passion chess", calories: 660, satFat: 5, sodium: 110, carbs: 140, sugar: 85, caffeine: 120 },
  { name: "Strawberry Coconut (L)", calories: 568, satFat: 17, sodium: 122, carbs: 98, sugar: 73, caffeine: 0 },
  { name: "Halo-Halo (L)", calories: 768, satFat: 12, sodium: 130, carbs: 158, sugar: 86, caffeine: 0 },
  { name: "Matcha Pearl Milk Tea (L)", calories: 822, satFat: 13, sodium: 136, carbs: 167, sugar: 58, caffeine: 120 },
  { name: "Matcha w/ Fresh Milk (L)", calories: 402, satFat: 4, sodium: 76, carbs: 79, sugar: 70, caffeine: 120 },
  { name: "Mango Matcha w/ Fresh Milk (L)", calories: 557, satFat: 4, sodium: 80, carbs: 117, sugar: 106, caffeine: 130 },
  { name: "Oreo w/ Pearl (L)", calories: 990, satFat: 21, sodium: 309, carbs: 186, sugar: 68, caffeine: 20 },
  { name: "Taro w/ Pudding (L)", calories: 654, satFat: 18, sodium: 114, carbs: 115, sugar: 68, caffeine: 0 },
  { name: "Thai Tea w/ Pearl (L)", calories: 803, satFat: 10, sodium: 117, carbs: 173, sugar: 68, caffeine: 70 },
  { name: "Coffee w/ Ice Cream (L)", calories: 635, satFat: 19, sodium: 144, carbs: 102, sugar: 68, caffeine: 295 },
  { name: "Strawberry Matcha w/ Fresh Milk (L)", calories: 532, satFat: 4, sodium: 126, carbs: 111, sugar: 100, caffeine: 130 },
  { name: "Passion Chess (L)", calories: 543, satFat: 0, sodium: 36, carbs: 135, sugar: 89, caffeine: 125 },
  { name: "Classic Pearl Black Milk Tea (L)", calories: 807, satFat: 18, sodium: 166, carbs: 153, sugar: 42, caffeine: 120 },
  { name: "classic pearl milk tea", calories: 770, satFat: 17, sodium: 150, carbs: 148, sugar: 48, caffeine: 120 },
  { name: "Honey Lemonade (L)", calories: 282, satFat: 0, sodium: 1, carbs: 72, sugar: 63, caffeine: 0 },
  { name: "Coffee Creama (L)", calories: 768, satFat: 32, sodium: 471, carbs: 99, sugar: 52, caffeine: 350 },
  { name: "Hokkaido Pearl Milk Tea (L)", calories: 758, satFat: 15, sodium: 314, carbs: 150, sugar: 46, caffeine: 230 },
  { name: "Coffee Milk Tea w/ Coffee Jelly (L)", calories: 584, satFat: 20, sodium: 145, carbs: 92, sugar: 59, caffeine: 330 },
];

export default function NutritionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const itemName = searchParams.get("item");

  const rowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (!itemName || !rowRef.current) return;

    // Scroll into view
    rowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });

    // Add highlight class
    rowRef.current.classList.add("bg-yellow-200");

    // Remove highlight after 3 seconds
    const timer = setTimeout(() => {
      rowRef.current?.classList.remove("bg-yellow-200");
    }, 3000);

    return () => clearTimeout(timer);
  }, [itemName]);

  return (
    <div className="p-10">
        {/* 🔙 Back Button */}
      <button
        onClick={() => router.push('/customer')}
        className="mb-6 px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 
                   hover:bg-zinc-300 dark:hover:bg-zinc-600 
                   transition-colors shadow-sm"
      >
        ← Back to Ordering
      </button>

      <h1 className="text-3xl font-bold mb-6">Nutrition Facts</h1>

      <table className="w-full border-collapse border border-gray-400">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Item</th>
            <th className="border p-2">Calories</th>
            <th className="border p-2">Sat. Fat (g)</th>
            <th className="border p-2">Sodium (mg)</th>
            <th className="border p-2">Carbs (g)</th>
            <th className="border p-2">Sugar (g)</th>
            <th className="border p-2">Caffeine (mg)</th>
          </tr>
        </thead>

        <tbody>
          {NUTRITION_DATA.map((row) => {
            const isTarget = row.name === itemName;

            return (
              <tr
                key={row.name}
                ref={isTarget ? rowRef : null}
                className="border"
              >
                <td className="border p-2">{row.name}</td>
                <td className="border p-2">{row.calories}</td>
                <td className="border p-2">{row.satFat}</td>
                <td className="border p-2">{row.sodium}</td>
                <td className="border p-2">{row.carbs}</td>
                <td className="border p-2">{row.sugar}</td>
                <td className="border p-2">{row.caffeine}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
