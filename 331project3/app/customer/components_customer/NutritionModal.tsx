'use client';

import { MenuItem, NutritionInfo } from '@/types/menu';

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: (MenuItem & Partial<NutritionInfo>) | null;
}

export default function NutritionModal({ isOpen, onClose, item }: NutritionModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md max-h-[90vh] overflow-auto">
        
        <h2 className="text-2xl font-bold mb-4">{item.item_name} – Nutrition Facts</h2>

        <table className="w-full text-left border">
          <tbody>
            <tr><td className="font-semibold">Calories</td><td>{item.calories}</td></tr>
            <tr><td className="font-semibold">Saturated Fat</td><td>{item.sat_fat} g</td></tr>
            <tr><td className="font-semibold">Sodium</td><td>{item.sodium} mg</td></tr>
            <tr><td className="font-semibold">Carbs</td><td>{item.carbs} g</td></tr>
            <tr><td className="font-semibold">Sugar</td><td>{item.sugar} g</td></tr>
            <tr><td className="font-semibold">Caffeine</td><td>{item.caffeine} mg</td></tr>
          </tbody>
        </table>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-black text-white py-2 rounded-lg"
        >
          Back to Ordering
        </button>
      </div>
    </div>
  );
}
