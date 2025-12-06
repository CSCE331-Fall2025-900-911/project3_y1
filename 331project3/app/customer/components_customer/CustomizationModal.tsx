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
    if (!isOpen) return;

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
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [isOpen, isEditing, initialCustomizations]);


  if (!isOpen) return null;

  const handleReset = () => {
    setSize('Medium');
    setIceLevel('Regular Ice');
    setSugarLevel('50%');
    setToppings([]);
  };

  const handleSave = () => {
    onAddToBag({ size, iceLevel, sugarLevel, toppings }, isEditing ? currentQuantity : 1); 
    onClose();
  };

  const handleToppingChange = (topping: string) => {
    setToppings((prev) => {
      if (prev.includes(topping)) {
        return prev.filter(t => t !== topping);
      } else {
        return [...prev, topping];
      }
    });
  };

  // Calculate price
  let finalPrice = Number(basePrice) || 0;
  if (size === 'Small') finalPrice -= 0.50;
  if (size === 'Large') finalPrice += 0.70;
  finalPrice += toppings.length * 0.50;

  const availableToppings = [
    'Boba', 'Crystal Boba', 'Popping Boba', 'Pudding',
    'Aloe Vera', 'Grass Jelly', 'Red Bean', 'Cheese Foam'
  ];

  const bgClass = isHighContrast ? "bg-black border-4 border-white" : "bg-white";
  const textClass = isHighContrast ? "text-white" : "text-black";
  const sectionTitleClass = `text-lg font-bold mb-3 ${textClass}`;

  const getOptionCardClass = (isSelected: boolean) => {
    const base = "cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center justify-center text-center transition-all";
    
    if (isHighContrast) {
      return isSelected 
        ? `${base} bg-white text-black border-white font-bold`
        : `${base} bg-black text-white border-white hover:bg-gray-900`;
    } else {
      return isSelected
        ? `${base} bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-sm`
        : `${base} bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50`;
    }
  };

  const buttonBase = "flex-1 py-4 px-4 rounded-lg font-bold text-lg border-2 transition-colors";
  
  const primaryBtn = isHighContrast 
    ? "bg-white text-black border-white hover:bg-gray-200"
    : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-md";
    
  const secondaryBtn = isHighContrast
    ? "bg-black text-white border-white hover:bg-white hover:text-black"
    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";

  const closeBtnClass = isHighContrast 
    ? "bg-white text-black border-2 border-black hover:bg-gray-200"
    : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${bgClass} rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative shadow-2xl overflow-hidden`}>

        <div className={`p-6 border-b ${isHighContrast ? 'border-white' : 'border-gray-100'} flex justify-between items-center bg-inherit z-10`}>
           <div>
              <h2 className={`text-2xl font-bold ${textClass}`}>
                Customize
              </h2>
              <p className={`text-lg opacity-80 ${textClass} mt-1`}>
                {isEditing ? `Editing: ${itemName}` : itemName}
              </p>
           </div>
           
           <button 
             onClick={onClose} 
             className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold transition-colors ${closeBtnClass}`}
             title="Close"
           >
             &times;
           </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-8">
            
            <div>
                <h3 className={sectionTitleClass}>Size</h3>
                <div className="grid grid-cols-3 gap-4">
                    {['Small', 'Medium', 'Large'].map((opt) => (
                        <label key={opt} className={getOptionCardClass(size === opt)}>
                            <input
                                type="radio"
                                name="size"
                                value={opt}
                                checked={size === opt}
                                onChange={(e) => setSize(e.target.value)}
                                className="sr-only" 
                            />
                            <span className="text-lg">{opt}</span>
                            <span className="text-sm opacity-80 mt-1">
                                {opt === 'Small' ? '(-$0.50)' : opt === 'Large' ? '(+$0.70)' : 'Standard'}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ice Level */}
                <div>
                    <h3 className={sectionTitleClass}>Ice Level</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['Regular Ice', 'Less Ice', 'No Ice', 'Extra Ice'].map((opt) => (
                            <label key={opt} className={getOptionCardClass(iceLevel === opt)}>
                                <input
                                    type="radio"
                                    name="iceLevel"
                                    value={opt}
                                    checked={iceLevel === opt}
                                    onChange={(e) => setIceLevel(e.target.value)}
                                    className="sr-only"
                                />
                                <span className="text-sm sm:text-base">{opt.replace(' Ice', '')}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Sugar Level */}
                <div>
                    <h3 className={sectionTitleClass}>Sugar Level</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {['0%', '25%', '50%', '75%', '100%'].map((opt) => (
                            <label key={opt} className={getOptionCardClass(sugarLevel === opt)}>
                                <input
                                    type="radio"
                                    name="sugarLevel"
                                    value={opt}
                                    checked={sugarLevel === opt}
                                    onChange={(e) => setSugarLevel(e.target.value)}
                                    className="sr-only"
                                />
                                <span className="text-sm sm:text-base">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Toppings Section */}
            <div>
                <h3 className={sectionTitleClass}>Toppings (+$0.50)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableToppings.map((topping) => {
                        const isSelected = toppings.includes(topping);
                        return (
                            <label key={topping} className={getOptionCardClass(isSelected)}>
                                <input
                                    type="checkbox"
                                    value={topping}
                                    checked={isSelected}
                                    onChange={() => handleToppingChange(topping)}
                                    className="sr-only"
                                />
                                <span className="capitalize font-medium">{topping}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

        </div>

        <div className={`p-6 border-t ${isHighContrast ? 'border-white' : 'border-gray-100'} bg-inherit`}>
            {/* Price Display */}
            <div className="mb-4 flex justify-between items-center px-2">
                <span className={`text-lg ${textClass} opacity-80`}>Total Amount:</span>
                <span className={`text-2xl font-bold ${textClass}`}>${finalPrice.toFixed(2)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-col sm:flex-row">
                <button onClick={onClose} className={`${buttonBase} ${secondaryBtn}`}>
                    Cancel
                </button>
                <button onClick={handleReset} className={`${buttonBase} ${secondaryBtn}`}>
                    Reset
                </button>
                <button onClick={handleSave} className={`${buttonBase} ${primaryBtn}`}>
                    {isEditing ? 'Save Changes' : 'Add to Order'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CustomizationModal;