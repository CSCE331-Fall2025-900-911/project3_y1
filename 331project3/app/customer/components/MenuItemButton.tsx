'use client';

import { MenuItem } from '@/types/menu';

interface MenuItemButtonProps {
  item: MenuItem;
}

export default function MenuItemButton({ item }: MenuItemButtonProps) {
  const handleClick = () => {
    // Add your button click handler here
    console.log('Selected:', item.item_name);
  };

  return (
    <button
      className="flex flex-col items-start justify-between p-6 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] hover:border-transparent hover:bg-black/[.04] dark:hover:bg-[#1a1a1a] transition-colors text-left"
      onClick={handleClick}
    >
      <div className="w-full">
        <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
          {item.item_name}
        </h2>
        {item.item_category && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            {item.item_category}
          </p>
        )}
        {item.item_price && (
          <p className="text-lg font-medium text-black dark:text-zinc-50">
            ${Number(item.item_price).toFixed(2)}
          </p>
        )}
      </div>
    </button>
  );
}

