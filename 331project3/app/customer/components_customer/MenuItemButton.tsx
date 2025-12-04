'use client';

import { MenuItem } from '@/types/menu';

interface MenuItemButtonProps {
  item: MenuItem;
  onClick?: () => void;            // for customization modal
  onNutritionClick?: () => void;   // for nutrition modal
}

export default function MenuItemButton({ item, onClick, onNutritionClick }: MenuItemButtonProps) {
  return (
    <div className="flex flex-col border border-solid border-black/[.08] rounded-lg p-4 hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] transition-colors">
      
      <button
        onClick={onClick}
        className="flex flex-col items-start w-full cursor-pointer text-left"
      >
        <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-1">
          {item.item_name}
        </h2>
        {item.item_category && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">{item.item_category}</p>
        )}
        {item.item_price && (
          <p className="text-lg font-medium text-black dark:text-zinc-50">
            ${Number(item.item_price).toFixed(2)}
          </p>
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();  // prevent triggering onClick above
          onNutritionClick?.();
        }}
        className="mt-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm py-1 px-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Nutrition Facts
      </button>
    </div>
  );
}
