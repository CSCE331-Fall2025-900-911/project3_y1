'use client';

import { MenuItem } from '@/types/menu';

interface MenuItemButtonProps {
  item: MenuItem;
  onClick?: () => void;
  onNutritionClick?: () => void;
  isHighContrast: boolean;
  isDrinkOfTheDay?: boolean;
}

export default function MenuItemButton({ item, onClick, onNutritionClick, isHighContrast, isDrinkOfTheDay = false }: MenuItemButtonProps) {
  const containerClasses = isDrinkOfTheDay
    ? isHighContrast
      ? "bg-[#333333] border-2 border-yellow-500 shadow-xl hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-1"
      : "bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 shadow-xl hover:border-yellow-500 hover:shadow-2xl hover:-translate-y-1"
    : isHighContrast
      ? "bg-[#333333] border border-gray-600 shadow-sm hover:border-purple-400 hover:shadow-lg hover:-translate-y-0.5"
      : "bg-white border border-gray-200 shadow-sm hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5";

  const titleClass = isHighContrast ? "text-white" : "text-gray-700";
  const metaClass = isHighContrast ? "text-gray-400" : "text-gray-400 uppercase tracking-wider text-xs";
  const priceClass = isHighContrast ? "text-purple-400" : "text-purple-600";
  const nutritionBtnClass = isHighContrast
    ? "bg-[#333333] text-gray-300 border border-gray-500 hover:bg-gray-700 hover:border-purple-400 hover:text-white"
    : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200";

  const minHeight = isDrinkOfTheDay ? "min-h-[200px]" : "min-h-[140px]";
  const titleSize = isDrinkOfTheDay ? "text-2xl" : "text-lg";
  const priceSize = isDrinkOfTheDay ? "text-2xl" : "text-xl";
  const padding = isDrinkOfTheDay ? "p-6" : "p-5";

  return (
    <div className={`relative flex flex-col rounded-xl ${padding} transition-all duration-200 cursor-pointer ${minHeight} ${containerClasses}`} onClick={onClick}>
      
      <div className="flex flex-col items-start w-full text-left h-full font-sans">
        {isDrinkOfTheDay && (
          <p className={`mb-2 font-bold text-yellow-600 ${isHighContrast ? 'text-yellow-400' : ''} uppercase tracking-wider text-xs`}>
            ⭐ Drink of the Day
          </p>
        )}
        {!isDrinkOfTheDay && item.item_category && (
          <p className={`mb-2 font-bold ${metaClass}`}>
            {item.item_category}
          </p>
        )}

        <h2 className={`${titleSize} font-bold mb-1 leading-snug ${titleClass}`}>
          {item.item_name}
        </h2>
        
        {item.item_price && (
          <p className={`${priceSize} font-bold mt-2 ${priceClass}`}>
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