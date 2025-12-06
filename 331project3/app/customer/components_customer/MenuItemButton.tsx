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
    ? "bg-black border-4 border-white hover:bg-gray-900" 
    : "border border-solid border-black/[.08] hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] bg-white dark:bg-black";

  const titleClass = isHighContrast ? "text-white" : "text-black dark:text-zinc-50";
  const metaClass = isHighContrast ? "text-white" : "text-zinc-600 dark:text-zinc-400";
  const priceClass = isHighContrast ? "text-white" : "text-black dark:text-zinc-50";
  const nutritionBtnClass = isHighContrast
    ? "bg-white text-black border-2 border-white hover:bg-gray-200 font-bold"
    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600";

  return (
    <div className={`relative flex flex-col rounded-lg p-4 transition-colors ${containerClasses}`}>
      
      <button
        onClick={onClick}
        className="flex flex-col items-start w-full cursor-pointer text-left after:absolute after:inset-0"
      >
        <h2 className={`text-xl font-bold mb-1 ${titleClass}`}>
          {item.item_name}
        </h2>
        
        {item.item_category && (
          <p className={`text-sm mb-1 font-medium ${metaClass}`}>
            {item.item_category}
          </p>
        )}
        
        {item.item_price && (
          <p className={`text-lg font-bold ${priceClass}`}>
             ${Number(item.item_price).toFixed(2)}
          </p>
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNutritionClick?.();
        }}
        className={`relative z-10 mt-4 py-2 px-3 rounded text-sm w-fit ${nutritionBtnClass}`}
      >
        Nutrition Facts
      </button>
    </div>
  );
}