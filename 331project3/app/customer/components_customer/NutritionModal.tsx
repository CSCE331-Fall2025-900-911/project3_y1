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

  const overlayClass = "bg-black/60 backdrop-blur-sm";
  const containerClass = isHighContrast 
    ? "bg-[#333333] border border-gray-600 text-white shadow-xl" 
    : "bg-white text-gray-800 shadow-2xl";

  const buttonClass = isHighContrast
    ? "mt-6 w-full bg-purple-600 text-white border border-purple-500 py-3 rounded-xl font-bold hover:bg-purple-700"
    : "mt-6 w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 hover:text-purple-600 transition-colors";

  const tableBorderClass = isHighContrast ? "border-gray-600" : "border-gray-200";
  const cellHeaderClass = isHighContrast ? "text-gray-300" : "text-gray-500 uppercase text-xs font-bold";
  const cellValueClass = isHighContrast ? "text-white" : "text-gray-800 font-semibold";
  const rowBorderClass = isHighContrast ? "divide-gray-600" : "divide-gray-100";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClass}`}>
      <div className={`${containerClass} p-8 rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto`}>
        
        <h2 className="text-2xl font-extrabold mb-6 text-center">{item.item_name}</h2>

        <div className={`border rounded-xl overflow-hidden ${tableBorderClass}`}>
            <table className="w-full text-left">
            <tbody className={`divide-y ${rowBorderClass}`}>
                {[
                    { l: 'Calories', v: item.calories },
                    { l: 'Saturated Fat', v: `${item.sat_fat} g` },
                    { l: 'Sodium', v: `${item.sodium} mg` },
                    { l: 'Carbohydrates', v: `${item.carbs} g` },
                    { l: 'Sugars', v: `${item.sugar} g` },
                    { l: 'Caffeine', v: `${item.caffeine} mg` },
                ].map((row, i) => (
                    <tr key={i} className={isHighContrast ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className={`p-4 ${cellHeaderClass}`}>{row.l}</td>
                        <td className={`p-4 text-right ${cellValueClass}`}>{row.v}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>

        <button
          onClick={onClose}
          className={buttonClass}
        >
          Close
        </button>
      </div>
    </div>
  );
}