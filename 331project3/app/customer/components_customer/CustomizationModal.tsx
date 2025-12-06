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
  const [toppingQuantities, setToppingQuantities] = useState<Record<string, number>>({});

  const availableToppings = [
    'boba', 'crystal boba', 'popping boba', 'pudding',
    'aloe vera', 'grass jelly', 'red bean', 'cheese foam'
  ];

  const getDefaultToppingsList = (name: string): string[] => {
    const defaults: string[] = [];
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('pearl') || lowerName.includes('boba')) defaults.push('boba');
    if (lowerName.includes('pudding')) defaults.push('pudding');
    if (lowerName.includes('cheese')) defaults.push('cheese foam');
    if (lowerName.includes('grass jelly')) defaults.push('grass jelly');
    
    return defaults;
  };

   useEffect(() => {
    if (!isOpen) return;

    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
      if (isEditing && initialCustomizations) {
        setSize(initialCustomizations.size);
        setIceLevel(initialCustomizations.iceLevel);
        setSugarLevel(initialCustomizations.sugarLevel);
        
        const qtyMap: Record<string, number> = {};
        initialCustomizations.toppings.forEach(t => {
          qtyMap[t] = (qtyMap[t] || 0) + 1;
        });
        setToppingQuantities(qtyMap);

      } else {
        // Defaults
        setSize('Medium');
        setIceLevel('Regular Ice');
        setSugarLevel('50%');

        const defaults = getDefaultToppingsList(itemName);
        const qtyMap: Record<string, number> = {};
        defaults.forEach(t => {
          qtyMap[t] = 1;
        });
        setToppingQuantities(qtyMap);
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOpen, isEditing, initialCustomizations, itemName]);


  if (!isOpen) return null;

  const handleReset = () => {
    setSize('Medium');
    setIceLevel('Regular Ice');
    setSugarLevel('50%');
    
    const defaults = getDefaultToppingsList(itemName);
    const qtyMap: Record<string, number> = {};
    defaults.forEach(t => {
      qtyMap[t] = 1;
    });
    setToppingQuantities(qtyMap);
  };

  const handleSave = () => {
    const flatToppings: string[] = [];
    Object.entries(toppingQuantities).forEach(([name, count]) => {
      for (let i = 0; i < count; i++) {
        flatToppings.push(name);
      }
    });

    onAddToBag({ size, iceLevel, sugarLevel, toppings: flatToppings }, isEditing ? currentQuantity : 1); 
    onClose();
  };

  const updateToppingCount = (name: string, delta: number) => {
    setToppingQuantities(prev => {
      const current = prev[name] || 0;
      const next = Math.max(0, current + delta);
      
      const newMap = { ...prev };
      if (next === 0) {
        delete newMap[name];
      } else {
        newMap[name] = next;
      }
      return newMap;
    });
  };

  // Price Calculation Logic
  let finalPrice = Number(basePrice) || 0;
  if (size === 'Small') finalPrice -= 0.50;
  if (size === 'Large') finalPrice += 0.70;

  // Calculate topping cost
  const defaultToppings = getDefaultToppingsList(itemName);
  let toppingCost = 0;
  
  Object.entries(toppingQuantities).forEach(([name, count]) => {
    let chargeableCount = count;
    // If this topping is a default one, the first one is free
    if (defaultToppings.includes(name)) {
      chargeableCount = Math.max(0, count - 1);
    }
    toppingCost += chargeableCount * 0.50;
  });

  finalPrice += toppingCost;


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
  
  // Close Button Style
  const closeBtnClass = isHighContrast 
    ? "text-gray-300 hover:text-white hover:bg-gray-700"
    : "text-gray-400 hover:text-gray-800 hover:bg-gray-100";

  // Qty Control Styles
  const qtyBtnBase = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg leading-none transition-colors";
  const qtyBtnMinus = isHighContrast 
    ? "text-red-400 hover:bg-red-900/30 disabled:opacity-30 disabled:hover:bg-transparent"
    : "text-red-500 hover:bg-red-50 disabled:text-gray-300 disabled:hover:bg-transparent";
  const qtyBtnPlus = isHighContrast
    ? "bg-purple-600 text-white hover:bg-purple-500"
    : "bg-purple-100 text-purple-700 hover:bg-purple-200";

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${overlayClass}`}>
      <div className={`${bgClass} rounded-2xl p-0 max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col`}>
        
        <div className="p-6 pb-2 flex items-center justify-between">
            {/* Invisible spacer to keep title centered */}
            <div className="w-8"></div>
            
            <h2 className={`text-2xl font-extrabold ${textClass} text-center`}>
                {isEditing ? `Edit ${itemName}` : itemName}
            </h2>

            {/* Close Button */}
            <button 
                onClick={onClose}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${closeBtnClass}`}
                title="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
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
              <div className="grid grid-cols-1 gap-2">
                  {availableToppings.map((topping) => {
                      const qty = toppingQuantities[topping] || 0;
                      const isActive = qty > 0;
                      
                      // Check if this specific topping is a "free default"
                      const isDefault = getDefaultToppingsList(itemName).includes(topping);
                      const priceDisplay = qty > 0
                        ? (isDefault && qty <= 1 ? '(Included)' : `(+$${((isDefault ? qty-1 : qty) * 0.50).toFixed(2)})`)
                        : '';

                      return (
                          <div key={topping} className={`flex justify-between items-center ${optionBase} ${isActive ? optionSelected : optionDefault}`}>
                            <span className="capitalize font-semibold">{topping}</span>
                            
                            <div className="flex items-center gap-3">
                              <span className={`text-xs mr-2 font-normal ${isActive ? (isHighContrast ? 'text-purple-200' : 'text-purple-600') : 'text-gray-400'}`}>
                                {priceDisplay}
                              </span>

                              <div className={`flex items-center gap-2 rounded-full px-1 py-1 ${isHighContrast ? 'bg-black/20' : 'bg-gray-100'}`} onClick={(e) => e.preventDefault()}>
                                <button 
                                  className={`${qtyBtnBase} ${qtyBtnMinus}`}
                                  onClick={() => updateToppingCount(topping, -1)}
                                  disabled={qty === 0}
                                >−</button>
                                <span className="w-4 text-center font-bold">{qty}</span>
                                <button 
                                  className={`${qtyBtnBase} ${qtyBtnPlus}`}
                                  onClick={() => updateToppingCount(topping, 1)}
                                >+</button>
                              </div>
                            </div>
                          </div>
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