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
      ? "bg-black border-l-4 border-white text-white" 
      : "bg-white text-black shadow-lg";
  
  const textClass = isHighContrast ? "text-white" : "text-black";
  const borderClass = isHighContrast ? "border-white border-b-2" : "border-b";
  
  const buttonBaseClass = "w-8 h-8 rounded-full text-lg font-bold flex items-center justify-center";
  const incDecButtonClass = isHighContrast
      ? `border-2 border-white hover:bg-white hover:text-black ${buttonBaseClass}`
      : `hover:bg-gray-100 ${buttonBaseClass}`;

  const editBtnClass = isHighContrast
      ? "text-white border border-white hover:bg-white hover:text-black font-bold px-2 py-1 rounded"
      : "text-blue-600 p-1 hover:bg-blue-50 rounded";

  const deleteBtnClass = isHighContrast
      ? "text-white border border-white hover:bg-red-600 hover:border-red-600 font-bold px-2 py-1 rounded"
      : "text-red-600 p-1 hover:bg-red-50 rounded";

  return (
    <div className={`fixed right-0 top-0 h-full w-80 p-4 overflow-y-auto ${containerClass}`}>
      <h2 className={`text-2xl font-bold mb-4 ${textClass}`}>Your Bag</h2>

      {bag.length === 0 ? (
        <p className={textClass}>Your bag is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-4">
            {bag.map((item) => (
              <li key={item.uniqueId} className={`${borderClass} pb-4`}>
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold ${textClass}`}>{item.name}</span>
                  <span className={`font-bold ${textClass}`}>${(item.finalPrice * item.quantity).toFixed(2)}</span>
                </div>

                <div className={`text-sm mb-2 font-medium ${textClass}`}>
                  <p>{item.customizations.size}</p>
                  <p>{item.customizations.iceLevel}</p>
                  <p>{item.customizations.sugarLevel}</p>
                  {item.customizations.toppings.length > 0 && (
                    <p>Toppings: {item.customizations.toppings.join(', ')}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  {/* Quantity Controls */}
                  <div className={`flex items-center gap-2 ${isHighContrast ? '' : 'border rounded-full p-1'}`}>
                    <button
                      onClick={() => onQuantityChange(item.uniqueId, -1)}
                      className={incDecButtonClass}
                      disabled={item.quantity <= 1}
                      title="Decrease quantity"
                    >
                      −
                    </button>
                    <span className={`w-4 text-center font-bold ${textClass}`}>{item.quantity}</span>
                    <button
                      onClick={() => onQuantityChange(item.uniqueId, 1)}
                      className={incDecButtonClass}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Action Buttons (Merged Edit & Delete) */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item.uniqueId)}
                      className={editBtnClass}
                      title="Edit customizations"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.uniqueId)}
                      className={deleteBtnClass}
                      title="Delete item permanently"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className={`border-t-4 pt-4 ${isHighContrast ? 'border-white' : 'border-gray-200'}`}>
            <div className={`flex justify-between text-xl font-bold mb-4 ${textClass}`}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={onCheckout}
              className={`w-full py-4 px-4 rounded font-bold text-lg ${
                isHighContrast 
                ? 'bg-white text-black border-2 border-white hover:bg-gray-200' 
                : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}