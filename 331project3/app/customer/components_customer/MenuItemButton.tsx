'use client';

import { MenuItem } from '@/types/menu';

interface MenuItemButtonProps {
  item: MenuItem;
  isHighContrast: boolean;
}

export default function MenuItemButton({ item, isHighContrast }: MenuItemButtonProps) {
  // High Contrast Styles: Pure Black BG, Pure White Text, Thick White Border
  const contrastClasses = "bg-black border-2 border-white text-white hover:bg-white hover:text-black";
  
  // Standard Styles: White BG, Black Text, Subtle Border
  const standardClasses = "bg-white border border-black/[.08] text-black hover:bg-black/[.04] hover:border-transparent";

  return (
    <button
      className={`flex flex-col items-start justify-between p-6 rounded-lg border-solid transition-colors text-left w-full cursor-pointer
        ${isHighContrast ? contrastClasses : standardClasses}`}
    >
      <div className="w-full">
        <h2 className={`text-xl font-bold mb-2 ${isHighContrast ? 'text-inherit' : 'text-black'}`}>
          {item.item_name}
        </h2>
        {item.item_category && (
          <p className={`text-sm mb-2 font-medium ${isHighContrast ? 'text-inherit' : 'text-zinc-600'}`}>
            {item.item_category}
          </p>
        )}
        {item.item_price && (
          <p className={`text-lg font-bold ${isHighContrast ? 'text-inherit' : 'text-black'}`}>
            ${Number(item.item_price).toFixed(2)}
          </p>
        )}
      </div>
    </button>
  );
}