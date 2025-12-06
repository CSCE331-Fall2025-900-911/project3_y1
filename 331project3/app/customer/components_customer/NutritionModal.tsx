'use client';

import { MenuItem, NutritionInfo } from '@/types/menu';

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: (MenuItem & Partial<NutritionInfo>) | null;
  isHighContrast: boolean;
}

export default function NutritionModal({ isOpen, onClose, item, isHighContrast }: NutritionModalProps) {
  if (!isOpen || !item) return null;

  const containerClass = isHighContrast 
    ? "bg-black border-2 border-white text-white" 
    : "bg-white text-black";

  const buttonClass = isHighContrast
    ? "mt-6 w-full bg-white text-black border-2 border-white py-2 rounded-lg font-bold hover:bg-gray-200"
    : "mt-6 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800";

  const tableBorderClass = isHighContrast ? "border-white" : "border-gray-200";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`${containerClass} p-6 rounded-lg w-[90%] max-w-md max-h-[90vh] overflow-auto`}>
        
        <h2 className="text-2xl font-bold mb-4">{item.item_name} – Nutrition Facts</h2>

        <table className={`w-full text-left border ${tableBorderClass}`}>
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
          className={buttonClass}
        >
          Back to Ordering
        </button>
      </div>
    </div>
  );
}
