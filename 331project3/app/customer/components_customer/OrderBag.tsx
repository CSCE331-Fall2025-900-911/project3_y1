'use client';

import React from 'react';

export interface BagItem {
  uniqueId: string;
  itemId: number;  // This is needed for the API
  name: string;
  basePrice: number;
  finalPrice: number;
  customizations: {
    size: string;  // This will be used to look up size_id
    iceLevel: string;
    sugarLevel: string;
    toppings: string[];
  };
}

interface OrderBagProps {
  bag: BagItem[];
  onRemoveItem: (uniqueId: string) => void;
  onCheckout: () => void;
}

export default function OrderBag({ bag, onRemoveItem, onCheckout }: OrderBagProps) {
  const total = bag.reduce((sum, item) => sum + (item.finalPrice || 0), 0);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">Your Bag</h2>
      
      {bag.length === 0 ? (
        <p className="text-black">Your bag is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-4">
            {bag.map((item) => (
              <li key={item.uniqueId} className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-black">{item.name}</span>
                  <span className="font-semibold text-black">${item.finalPrice.toFixed(2)}</span>
                </div>
                
                <div className="text-sm text-black mb-2">
                  <p>{item.customizations.size}</p>
                  <p>{item.customizations.iceLevel}</p>
                  <p>{item.customizations.sugarLevel}</p>
                  {item.customizations.toppings.length > 0 && (
                    <p>Toppings: {item.customizations.toppings.join(', ')}</p>
                  )}
                </div>
                
                <button
                  onClick={() => onRemoveItem(item.uniqueId)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          
          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold mb-4 text-black">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button
              onClick={onCheckout}
              className="w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 font-semibold"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}