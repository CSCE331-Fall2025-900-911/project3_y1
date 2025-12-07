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

  // Decide which image to show based on the item name
  const getItemImage = (name: string = '') => {
    // Check for specific items
    if (name === 'Mango Green Tea') {
        return '/images/Mango-Green-Tea.png';
    }
    if (name === 'Mango & Passion Fruit Tea') {
        return '/images/Mango-&-Passion-Fruit-Tea.png';
    }
    if (name === 'Tiger Passion Chess') {
        return '/images/Tiger-Passion-Chess.png';
    }
    if (name === 'Mango Boba') {
        return '/images/Mango-Boba.png';
    }
    if (name === 'Strawberry Coconut') {
        return '/images/Strawberry-Coconut.png';
    }
    if (name === 'Halo Halo') {
        return '/images/Halo-Halo.png';
    }
    if (name === 'Matcha Pearl Milk Tea') {
        return '/images/Matcha-Pearl-Milk-Tea.png';
    }
    if (name === 'Matcha Fresh Milk') {
        return '/images/Matcha-Fresh-Milk.png';
    }
    if (name === 'Mango Matcha Fresh Milk') {
        return '/images/Mango-Matcha-Fresh-Milk.png';
    }
    if (name === 'Oreo w/ Pearl') {
        return '/images/Oreo-with-Pearl.png';
    }
    if (name === 'Taro w/ Pudding') {
        return '/images/Taro-with-Pudding.png';
    }
    if (name === 'Thai Tea w/ Pearl') {
        return '/images/Thai-Pearl-Milk-Tea.png';
    }
    if (name === 'Coffee w/ Ice Cream') {
        return '/images/Coffee-with-Ice-Cream.png';
    }
    if (name === 'Strawberry Matcha Fresh Milk') {
        return '/images/Strawberry-Matcha-Fresh-Milk.png';
    }
    if (name === 'Passion Chess 2') {
        return '/images/Tiger-Passion-Chess.png';
    }
    if (name === 'New Seasonal Item') {
        return '/images/Tiger-Passion-Chess.png';
    }
    if (name === 'Seasonal Item') {
        return '/images/Tiger-Passion-Chess.png';
    }
    if (name === 'Classic Pearl Milk Tea 2') {
        return '/images/Classic-Pearl-Milk-Tea.png';
    }
    if (name === 'Honey Lemonade') {
        return '/images/Honey-Lemonade.png';
    }
    if (name === 'Coffee Creama') {
        return '/images/Coffee-Creama.png';
    }
    if (name === 'Hokkaido Pearl Milk Team') {
        return '/images/Hokkaido-Pearl-Milk-Tea.png';
    }
    if (name === 'Coffee Milk Tea w/ Coffee Jelly') {
        return '/images/Coffee-Milk-Tea-with-Coffee-Jelly.png';
    }
    if (name === 'Honey Pearl Milk Tea') {
        return '/images/Honey-Pearl-Milk-Tea.png';
    }
    
    // Default fallback for everything else
    return '/images/Thai-Pearl-Milk-Tea.png';
  };

  const imageSrc = getItemImage(item.item_name);

  return (
    <div className={`relative flex flex-col rounded-xl transition-all duration-200 cursor-pointer min-h-[140px] overflow-hidden ${containerClasses}`} onClick={onClick}>
      
      {/* Image Section */}
      <div className="w-full h-54 bg-gray-100 relative border-b border-gray-100/50">
        <img 
            src={imageSrc}
            alt={item.item_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-col items-start w-full text-left flex-1 font-sans">
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
    </div>
  );
}