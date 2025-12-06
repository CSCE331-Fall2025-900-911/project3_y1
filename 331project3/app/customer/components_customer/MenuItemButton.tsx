'use client';

import { MenuItem } from '@/types/menu';

interface MenuItemButtonProps {
  item: MenuItem;
  onClick?: () => void;           // for customization modal
  onNutritionClick?: () => void;  // for nutrition modal
  isHighContrast: boolean;        // Added from Contrast branch
}

export default function MenuItemButton({ item, onClick, onNutritionClick, isHighContrast }: MenuItemButtonProps) {
  
  // 1. Container Styles
  // High Contrast: Black background, Thick White Border
  // Standard: Transparent/White background, Subtle border, Dark mode support
  const containerClasses = isHighContrast 
    ? "bg-black border-4 border-white hover:bg-gray-900" 
    : "border border-solid border-black/[.08] hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] bg-white dark:bg-black";

  // 2. Text Styles
  const titleClass = isHighContrast ? "text-white" : "text-black dark:text-zinc-50";
  const metaClass = isHighContrast ? "text-white" : "text-zinc-600 dark:text-zinc-400";
  const priceClass = isHighContrast ? "text-white" : "text-black dark:text-zinc-50";

  // 3. Nutrition Button Styles
  // High Contrast: White button (to pop against black bg), Black text
  const nutritionBtnClass = isHighContrast
    ? "bg-white text-black border-2 border-white hover:bg-gray-200 font-bold"
    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600";

  return (
    <div className={`flex flex-col rounded-lg p-4 transition-colors ${containerClasses}`}>
      
      {/* Main Item Click (Customization) */}
      <button
        onClick={onClick}
        className="flex flex-col items-start w-full cursor-pointer text-left"
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

      {/* Secondary Click (Nutrition) */}
      <button
        onClick={(e) => {
          e.stopPropagation();  // prevent triggering onClick above
          onNutritionClick?.();
        }}
        className={`mt-4 py-2 px-3 rounded text-sm w-fit ${nutritionBtnClass}`}
      >
        Nutrition Facts
      </button>
    </div>
  );
}