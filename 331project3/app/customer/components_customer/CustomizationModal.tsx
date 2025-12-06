'use client';

import React, { useState, useEffect } from 'react';

interface Customizations {
	size: string;
	iceLevel: string;
	sugarLevel: string;
	toppings: string[];
}

interface CustomizationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAddToBag: (
        customizations: Customizations, 
        originalQuantity?: number
    ) => void; 
	itemName: string;
	basePrice: number;
  initialCustomizations?: Customizations; 
  isEditing: boolean;
  currentQuantity?: number;
  isHighContrast: boolean;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ 
	isOpen, 
	onClose, 
	onAddToBag,
	itemName,
	basePrice,
  initialCustomizations,
  isEditing,            
  currentQuantity,     
  isHighContrast,
}) => {
	const [size, setSize] = useState<string>('Medium');
	const [iceLevel, setIceLevel] = useState<string>('Regular Ice');
	const [sugarLevel, setSugarLevel] = useState<string>('50%');
	const [toppings, setToppings] = useState<string[]>([]);

  // Helper to determine default toppings based on drink name
  const getDefaultToppings = (name: string): string[] => {
    const defaults: string[] = [];
    const lowerName = name.toLowerCase();
    
    // Check for Boba/Pearl
    if (lowerName.includes('pearl') || lowerName.includes('boba')) {
      defaults.push('boba');
    }
    // Check for Pudding
    if (lowerName.includes('pudding')) {
      defaults.push('pudding');
    }
    // Check for Cheese
    if (lowerName.includes('cheese')) {
      defaults.push('cheese foam');
    }
    
    return defaults;
  };

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		if (isEditing && initialCustomizations) {
			timeoutId = setTimeout(() => {
				setSize(initialCustomizations.size);
				setIceLevel(initialCustomizations.iceLevel);
				setSugarLevel(initialCustomizations.sugarLevel);
				setToppings(initialCustomizations.toppings);
			}, 0);
		} else {
			timeoutId = setTimeout(() => {
				setSize('Medium');
				setIceLevel('Regular Ice');
				setSugarLevel('50%');
        // Use the helper to set defaults instead of empty array
				setToppings(getDefaultToppings(itemName));
			}, 0);
		}

		return () => {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}
		};
	}, [isOpen, isEditing, initialCustomizations, itemName]);


	if (!isOpen) {
		return null;
	}

	const handleReset = () => {
    setSize('Medium');
    setIceLevel('Regular Ice');
    setSugarLevel('50%');
    // Reset to defaults based on item name
    setToppings(getDefaultToppings(itemName));
  };

  const handleSave = () => {
    onAddToBag({ size, iceLevel, sugarLevel, toppings }, isEditing ? currentQuantity : 1); 
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

  let finalPrice = Number(basePrice) || 0;
  if (size === 'Small') finalPrice -= 0.50;
  if (size === 'Large') finalPrice += 0.70;
  finalPrice += toppings.length * 0.50;

  const availableToppings = [
    'boba', 'crystal boba', 'popping boba', 'pudding',
    'aloe vera', 'grass jelly', 'red bean', 'cheese foam'
  ];

  // STYLES
  const overlayClass = "bg-black/60 backdrop-blur-sm";
  const bgClass = isHighContrast 
    ? "bg-[#333333] border border-gray-600 shadow-2xl" 
    : "bg-white shadow-2xl";
  const textClass = isHighContrast ? "text-white" : "text-gray-800";
  const sectionTitleClass = isHighContrast 
    ? "text-gray-300 uppercase text-xs font-bold tracking-wider border-b border-gray-600 pb-2" 
    : "text-gray-500 uppercase text-xs font-bold tracking-wider border-b border-gray-200 pb-2";
  const optionBase = "cursor-pointer px-4 py-3 border rounded-lg text-sm font-medium flex items-center transition-all select-none";
  
  const optionDefault = isHighContrast 
      ? "bg-[#333333] border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500" 
      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300";
      
  const optionSelected = isHighContrast
      ? "bg-purple-600 text-white border-purple-500 font-bold shadow-sm"
      : "bg-purple-50 border-purple-500 text-purple-700 font-semibold shadow-sm";

  // BUTTONS
  const buttonBase = "flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-transform active:scale-95";
  const primaryBtn = isHighContrast 
    ? "bg-purple-600 text-white shadow-lg shadow-gray-900 hover:bg-purple-700 hover:shadow-xl hover:-translate-y-0.5"
    : "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5";
    
  const secondaryBtn = isHighContrast
    ? "bg-[#333333] text-white border border-gray-500 hover:bg-gray-700 hover:text-purple-400"
    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-purple-300 hover:text-purple-600";

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${overlayClass}`}>
      <div className={`${bgClass} rounded-2xl p-0 max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col`}>
        
        <div className="p-6 pb-2">
            <h2 className={`text-2xl font-extrabold ${textClass} text-center`}>
                {isEditing ? `Edit ${itemName}` : itemName}
            </h2>
        </div>
        
        <div className="overflow-y-auto px-8 py-4 flex-1">
            {[
                { title: "Size", options: ['Small', 'Medium', 'Large'], name: "size", current: size, set: setSize },
                { title: "Ice Level", options: ['Regular Ice', 'Less Ice', 'No Ice', 'Extra Ice'], name: "iceLevel", current: iceLevel, set: setIceLevel },
                { title: "Sugar Level", options: ['0%', '25%', '50%', '75%', '100%'], name: "sugarLevel", current: sugarLevel, set: setSugarLevel }
            ].map((section) => (
                <div key={section.title} className="mb-6">
                    <h3 className={`mb-3 ${sectionTitleClass}`}>{section.title}</h3>
                    <div className="flex flex-wrap gap-2">
                        {section.options.map((opt) => (
                            <label key={opt} className={`${optionBase} ${section.current === opt ? optionSelected : optionDefault}`}>
                                <input
                                    type="radio"
                                    name={section.name}
                                    value={opt}
                                    checked={section.current === opt}
                                    onChange={(e) => section.set(e.target.value)}
                                    className="hidden"
                                />
                                {opt} {section.name === 'size' && (opt === 'Small' ? '(-$0.50)' : opt === 'Large' ? '(+$0.70)' : '')}
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <div className="mb-6">
            <h3 className={`mb-3 ${sectionTitleClass}`}>Toppings (+$0.50 each)</h3>
            <div className="grid grid-cols-2 gap-2">
                {availableToppings.map((topping) => {
                    const isActive = toppings.includes(topping);
                    return (
                        <label key={topping} className={`flex justify-between items-center ${optionBase} ${isActive ? optionSelected : optionDefault}`}>
                        <span className="capitalize">{topping}</span>
                        <input
                            type="checkbox"
                            value={topping}
                            checked={isActive}
                            onChange={handleToppingChange}
                            className="hidden"
                        />
                        {isActive && <span className={isHighContrast ? "text-white font-bold" : "text-purple-600 font-bold"}>✓</span>}
                        </label>
                    );
                })}
            </div>
            </div>
        </div>

        <div className={`p-6 border-t ${isHighContrast ? 'border-gray-600 bg-[#333333]' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex justify-between items-center mb-4">
                 <span className={`text-lg font-bold ${textClass}`}>Total</span>
                 <span className={`text-2xl font-extrabold ${isHighContrast ? 'text-purple-400' : 'text-purple-600'}`}>${finalPrice.toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
                <button onClick={onClose} className={`${buttonBase} ${secondaryBtn}`}>
                    Cancel
                </button>
                <button onClick={handleReset} className={`${buttonBase} ${secondaryBtn}`}>
                    Reset
                </button>
                <button onClick={handleSave} className={`${buttonBase} ${primaryBtn} flex-grow-[2]`}>
                    {isEditing ? 'Save Changes' : 'Add to Bag'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;