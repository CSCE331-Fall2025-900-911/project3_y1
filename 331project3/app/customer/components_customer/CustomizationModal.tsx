'use client';

import React, { useState } from 'react';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToBag: (customizations: {
    size: string;
    iceLevel: string;
    sugarLevel: string;
    toppings: string[];
  }, originalQuantity?: number) => void;
  itemName: string;
  basePrice: number;
  initialCustomizations?: {
    size: string;
    iceLevel: string;
    sugarLevel: string;
    toppings: string[];
  };
  currentQuantity?: number;
  isEditing?: boolean;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddToBag,
  itemName,
  basePrice 
}) => {
  const [size, setSize] = useState<string>('Medium');
  const [iceLevel, setIceLevel] = useState<string>('Regular Ice');
  const [sugarLevel, setSugarLevel] = useState<string>('50%');
  const [toppings, setToppings] = useState<string[]>([]);

  if (!isOpen) {
    return null;
  }

  const handleReset = () => {
    setSize('Medium');
    setIceLevel('Regular Ice');
    setSugarLevel('50%');
    setToppings([]);
  };

  const handleAddToBag = () => {
    onAddToBag({ size, iceLevel, sugarLevel, toppings });
    handleReset();
    onClose();
  };

  const handleToppingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setToppings((prevToppings) => [...prevToppings, value]);
    } else {
      setToppings((prevToppings) => prevToppings.filter((topping) => topping !== value));
    }
  };

  // Calculate price
  let finalPrice = Number(basePrice) || 0;
  if (size === 'Small') finalPrice -= 0.50;
  if (size === 'Large') finalPrice += 0.70;
  finalPrice += toppings.length * 0.50;

  const availableToppings = [
    'boba',
    'crystal boba',
    'popping boba',
    'pudding',
    'aloe vera',
    'grass jelly',
    'red bean',
    'cheese foam'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">{itemName}</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-black">Size</h3>
          <label className="block mb-2 text-black">
            <input
              type="radio"
              name="size"
              value="Small"
              checked={size === 'Small'}
              onChange={(e) => setSize(e.target.value)}
              className="mr-2"
            />
            Small (-$0.50)
          </label>
          <label className="block mb-2 text-black">
            <input
              type="radio"
              name="size"
              value="Medium"
              checked={size === 'Medium'}
              onChange={(e) => setSize(e.target.value)}
              className="mr-2"
            />
            Medium
          </label>
          <label className="block mb-2 text-black">
            <input
              type="radio"
              name="size"
              value="Large"
              checked={size === 'Large'}
              onChange={(e) => setSize(e.target.value)}
              className="mr-2"
            />
            Large (+$0.70)
          </label>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-black">Ice Level</h3>
          <label className="block mb-2 text-black">
            <input
              type="radio"
              name="iceLevel"
              value="Regular Ice"
              checked={iceLevel === 'Regular Ice'}
              onChange={(e) => setIceLevel(e.target.value)}
              className="mr-2"
            />
            Regular Ice
          </label>
          <label className="block mb-2 text-black">
            <input
              type="radio"
              name="iceLevel"
              value="Less Ice"
              checked={iceLevel === 'Less Ice'}
              onChange={(e) => setIceLevel(e.target.value)}
              className="mr-2"
            />
            Less Ice
          </label>
          <label className="block mb-2 text-black">
            <input
              type="radio"
              name="iceLevel"
              value="No Ice"
              checked={iceLevel === 'No Ice'}
              onChange={(e) => setIceLevel(e.target.value)}
              className="mr-2"
            />
            No Ice
          </label>
          <label className="block mb-2 text-black">
            <input
              type="radio"
              name="iceLevel"
              value="Extra Ice"
              checked={iceLevel === 'Extra Ice'}
              onChange={(e) => setIceLevel(e.target.value)}
              className="mr-2"
            />
            Extra Ice
          </label>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-black">Sugar Level</h3>
          {['0%', '25%', '50%', '75%', '100%'].map((level) => (
            <label key={level} className="block mb-2 text-black">
              <input
                type="radio"
                name="sugarLevel"
                value={level}
                checked={sugarLevel === level}
                onChange={(e) => setSugarLevel(e.target.value)}
                className="mr-2"
              />
              {level}
            </label>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-black">Toppings (+$0.50 each)</h3>
          {availableToppings.map((topping) => (
            <label key={topping} className="block mb-2 capitalize text-black">
              <input
                type="checkbox"
                value={topping}
                checked={toppings.includes(topping)}
                onChange={handleToppingChange}
                className="mr-2"
              />
              {topping}
            </label>
          ))}
        </div>

        <div className="mb-4 p-3 bg-gray-100 rounded">
          <p className="font-semibold text-black">Price: ${finalPrice.toFixed(2)}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToBag}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add to Bag
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;