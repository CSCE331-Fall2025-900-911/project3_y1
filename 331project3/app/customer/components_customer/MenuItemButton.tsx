'use client';

import { MenuItem } from '@/types/menu';

interface MenuItemButtonProps {
  item: MenuItem;
  onClick?: () => void;
  onNutritionClick?: () => void;
  isHighContrast: boolean;
}

export default function MenuItemButton({ item, onClick, onNutritionClick, isHighContrast }: MenuItemButtonProps) {
  const containerClasses = isHighContrast 
    ? "bg-[#333333] border border-gray-600 shadow-sm hover:border-purple-400 hover:shadow-lg hover:-translate-y-0.5" 
    : "bg-white border border-gray-200 shadow-sm hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5";

 
  const titleClass = isHighContrast ? "text-white" : "text-gray-700";
    const metaClass = isHighContrast ? "text-gray-400" : "text-gray-400 uppercase tracking-wider text-xs";
    const priceClass = isHighContrast ? "text-purple-400" : "text-purple-600";
    const nutritionBtnClass = isHighContrast
    ? "bg-[#333333] text-gray-300 border border-gray-500 hover:bg-gray-700 hover:border-purple-400 hover:text-white"
    : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200";

  return (
    <div className={`relative flex flex-col rounded-xl p-5 transition-all duration-200 cursor-pointer min-h-[140px] ${containerClasses}`} onClick={onClick}>
      
      <div className="flex flex-col items-start w-full text-left h-full font-sans">
        {item.item_category && (
            <p className={`mb-2 font-bold ${metaClass}`}>
              {item.item_category}
            </p>
          )}

        <h2 className={`text-lg font-bold mb-1 leading-snug ${titleClass}`}>
          {item.item_name}
        </h2>
        
        {item.item_price && (
          <p className={`text-xl font-bold mt-2 ${priceClass}`}>
             ${Number(item.item_price).toFixed(2)}
          </p>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNutritionClick?.();
        }}
        className={`relative z-10 mt-4 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors w-fit ${nutritionBtnClass}`}
      >
        Nutrition Facts
      </button>
    </div>
  );
}