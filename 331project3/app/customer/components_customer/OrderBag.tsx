'use client';

import React from 'react';

export interface BagItem {
  uniqueId: string;
  itemId: number;
  name: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  customizations: {
    size: string;
    iceLevel: string;
    sugarLevel: string;
    toppings: string[];
  };
}

interface OrderBagProps {
  bag: BagItem[];
  onQuantityChange: (uniqueId: string, delta: number) => void;
  onDelete: (uniqueId: string) => void;
  onEdit: (uniqueId: string) => void;
  onCheckout: () => void;
  editingItemId: string | null;
  isHighContrast: boolean;
}

export default function OrderBag({ 
  bag, 
  onQuantityChange, 
  onDelete, 
  onEdit, 
  onCheckout, 
  editingItemId, 
  isHighContrast 
}: OrderBagProps) {
  
  const total = bag.reduce((sum, item) => sum + (item.finalPrice * item.quantity || 0), 0);
    
  const containerClass = isHighContrast 
      ? "bg-[#333333] border border-gray-600 text-white shadow-2xl rounded-2xl overflow-hidden" 
      : "bg-white text-gray-800 shadow-2xl border border-gray-200 rounded-2xl overflow-hidden";
  
  const textClass = isHighContrast ? "text-white" : "text-gray-800";
  const subTextClass = isHighContrast ? "text-gray-400" : "text-gray-500";
  const borderClass = isHighContrast ? "border-gray-600 border-b" : "border-gray-100 border-b";
  
  const buttonBaseClass = "w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center transition-all";
  
  const incDecButtonClass = isHighContrast
      ? `border border-gray-500 text-white hover:border-purple-400 hover:text-purple-400 ${buttonBaseClass}`
      : `bg-white border border-gray-200 text-gray-600 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600 ${buttonBaseClass}`;

  const editBtnClass = isHighContrast
      ? "text-purple-400 hover:text-purple-300 text-sm font-medium hover:underline"
      : "text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline";

  const deleteBtnClass = isHighContrast
      ? "text-red-400 hover:text-red-300 text-sm font-medium hover:underline"
      : "text-red-500 hover:text-red-700 text-sm font-medium hover:underline";

  return (
    <div className={`fixed right-4 top-4 bottom-4 w-80 flex flex-col z-40 ${containerClass}`}>
      <div className={`p-6 border-b ${isHighContrast ? 'border-gray-600' : 'border-gray-200'}`}>
        <h2 className={`text-xl font-bold ${textClass}`}>Your Bag</h2>
        <p className={`text-sm mt-1 ${subTextClass}`}>{bag.length} items</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {bag.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
                <p className={textClass}>Your bag is empty.</p>
            </div>
        ) : (
          <ul className="space-y-4">
            {bag.map((item) => {
              const isEditing = item.uniqueId === editingItemId;

              const activeClass = isEditing 
                ? (isHighContrast ? "bg-gray-700/50 rounded-lg p-3 border border-purple-500" : "bg-purple-50 rounded-lg p-3 border border-purple-200")
                : "";
              
              // Logic to group toppings: "boba, boba" -> "Boba x2"
              const toppingCounts: Record<string, number> = {};
              item.customizations.toppings.forEach(t => {
                toppingCounts[t] = (toppingCounts[t] || 0) + 1;
              });

              const formattedToppings = Object.entries(toppingCounts).map(([name, count]) => {
                // Capitalize first letter of each word
                const displayName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                return count > 1 ? `${displayName} x${count}` : displayName;
              }).join(', ');

              return (
                <li key={item.uniqueId} className={`${borderClass} pb-4 last:border-0 ${activeClass}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-sm ${textClass} leading-tight`}>
                        {item.name} 
                        {isEditing && <span className="text-xs ml-2 uppercase text-purple-400 font-bold">(Editing)</span>}
                    </span>
                    <span className={`font-bold text-sm ${isHighContrast ? 'text-purple-400' : 'text-gray-800'}`}>${(item.finalPrice * item.quantity).toFixed(2)}</span>
                  </div>

                  <div className={`text-xs mb-3 font-medium ${subTextClass}`}>
                    <p>{item.customizations.size} • {item.customizations.iceLevel} • {item.customizations.sugarLevel}</p>
                    {formattedToppings && (
                      <p className="mt-1">+ {formattedToppings}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className={`flex items-center gap-2 px-2 py-1 ${isHighContrast ? 'bg-gray-800 rounded-full border border-gray-600' : 'bg-gray-50 rounded-full'}`}>
                      <button
                        onClick={() => onQuantityChange(item.uniqueId, -1)}
                        className={incDecButtonClass}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className={`w-4 text-center font-bold text-sm ${textClass}`}>{item.quantity}</span>
                      <button
                        onClick={() => onQuantityChange(item.uniqueId, 1)}
                        className={incDecButtonClass}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => onEdit(item.uniqueId)}
                        disabled={isEditing}
                        className={`${editBtnClass} ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item.uniqueId)}
                        className={deleteBtnClass}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {bag.length > 0 && (
          <div className={`p-6 border-t ${isHighContrast ? 'bg-[#333333] border-gray-600' : 'bg-white border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]'}`}>
            <div className={`flex justify-between text-xl font-extrabold mb-4 ${textClass}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={onCheckout}
              className={`w-full py-4 px-4 rounded-xl font-bold text-lg transition-transform active:scale-95 ${
                isHighContrast 
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg' 
                : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5'
              }`}
            >
              Checkout
            </button>
          </div>
      )}
    </div>
  );
}