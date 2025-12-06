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

  //prefill the form if already existed
	useEffect(() => {
		if (!isOpen) {
			return;
		}

    //timeout to defer the state updates
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		if (isEditing && initialCustomizations) {
      //load existing values
			timeoutId = setTimeout(() => {
				setSize(initialCustomizations.size);
				setIceLevel(initialCustomizations.iceLevel);
				setSugarLevel(initialCustomizations.sugarLevel);
				setToppings(initialCustomizations.toppings);
			}, 0);
		} else {
			//new item load defaults
			timeoutId = setTimeout(() => {
				setSize('Medium');
				setIceLevel('Regular Ice');
				setSugarLevel('50%');
				setToppings([]);
			}, 0);
		}

		return () => {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}
		};
	}, [isOpen, isEditing, initialCustomizations]);


	if (!isOpen) {
		return null;
	}

	const handleReset = () => {
    setSize('Medium');
    setIceLevel('Regular Ice');
    setSugarLevel('50%');
    setToppings([]);
  };

  const handleSave = () => {
    // Preserved logic from 'Current' to ensure data is passed correctly
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

  // Calculate price
  let finalPrice = Number(basePrice) || 0;
  if (size === 'Small') finalPrice -= 0.50;
  if (size === 'Large') finalPrice += 0.70;
  finalPrice += toppings.length * 0.50;

  const availableToppings = [
    'boba', 'crystal boba', 'popping boba', 'pudding',
    'aloe vera', 'grass jelly', 'red bean', 'cheese foam'
  ];

  // High Contrast Styles (From 'New')
  const bgClass = isHighContrast ? "bg-black border-4 border-white" : "bg-white";
  const textClass = isHighContrast ? "text-white" : "text-black";
  const priceBgClass = isHighContrast ? "bg-black border-2 border-white" : "bg-gray-100";
  const buttonBase = "flex-1 py-3 px-4 rounded font-bold border-2";

  // Custom button styles for contrast
  const primaryBtn = isHighContrast 
    ? "bg-white text-black border-white hover:bg-gray-200"
    : "bg-blue-600 text-white border-transparent hover:bg-blue-700";
    
  const secondaryBtn = isHighContrast
    ? "bg-black text-white border-white hover:bg-white hover:text-black"
    : "bg-gray-300 text-gray-800 border-transparent hover:bg-gray-400";

    const closeBtnClass = isHighContrast 
		? "bg-white text-black border-2 border-black hover:bg-gray-200"
		: "bg-gray-300 text-gray-800 hover:bg-gray-400";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className={`${bgClass} rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto relative`}>

        <button 
					onClick={onClose} 
					className={`absolute top-2 right-2 w-8 h-8 rounded-full text-xl font-bold ${closeBtnClass}`}
					title="Close"
				>
					&times;
				</button>

        {/* Header: Uses 'New' styles but 'Current' logic for Edit vs Add title */}
        <h2 className={`text-2xl font-bold mb-4 ${textClass} border-b-2 ${isHighContrast ? 'border-white' : 'border-transparent'}`}>
            {isEditing ? `Edit ${itemName}` : itemName}
        </h2>
        
        {/* Sections: Uses 'New' compact mapping structure */}
        {[
            { title: "Size", options: ['Small', 'Medium', 'Large'], name: "size", current: size, set: setSize },
            { title: "Ice Level", options: ['Regular Ice', 'Less Ice', 'No Ice', 'Extra Ice'], name: "iceLevel", current: iceLevel, set: setIceLevel },
            { title: "Sugar Level", options: ['0%', '25%', '50%', '75%', '100%'], name: "sugarLevel", current: sugarLevel, set: setSugarLevel }
        ].map((section) => (
            <div key={section.title} className="mb-4">
                <h3 className={`font-bold mb-2 ${textClass}`}>{section.title}</h3>
                {section.options.map((opt) => (
                    <label key={opt} className={`block mb-2 font-medium ${textClass} cursor-pointer`}>
                        <input
                            type="radio"
                            name={section.name}
                            value={opt}
                            checked={section.current === opt}
                            onChange={(e) => section.set(e.target.value)}
                            className={`mr-3 transform scale-125 ${isHighContrast ? 'accent-white' : ''}`}
                        />
                        {opt} {section.name === 'size' && (opt === 'Small' ? '(-$0.50)' : opt === 'Large' ? '(+$0.70)' : '')}
                    </label>
                ))}
            </div>
        ))}

        <div className="mb-4">
          <h3 className={`font-bold mb-2 ${textClass}`}>Toppings (+$0.50 each)</h3>
          {availableToppings.map((topping) => (
            <label key={topping} className={`block mb-2 capitalize font-medium ${textClass} cursor-pointer`}>
              <input
                type="checkbox"
                value={topping}
                checked={toppings.includes(topping)}
                onChange={handleToppingChange}
                className={`mr-3 transform scale-125 ${isHighContrast ? 'accent-white' : ''}`}
              />
              {topping}
            </label>
          ))}
        </div>

        <div className={`mb-6 p-4 ${priceBgClass} rounded`}>
          <p className={`text-xl font-bold ${textClass}`}>Price: ${finalPrice.toFixed(2)}</p>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          {/* Buttons: Uses 'New' styles but 'Current' handlers/logic */}
          <button onClick={handleSave} className={`${buttonBase} ${primaryBtn}`}>
            {isEditing ? 'Save Changes' : 'Add to Bag'}
          </button>
          <button onClick={handleReset} className={`${buttonBase} ${secondaryBtn}`}>
            Reset
          </button>
          <button onClick={onClose} className={`${buttonBase} ${secondaryBtn}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;