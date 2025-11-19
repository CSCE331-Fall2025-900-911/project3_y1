import React, { useState, useEffect } from 'react';
import "../styles_cashier/customizationModal.css";

interface ToppingItem {
  name: string;
  price: number;
}

// Centralized list of toppings with prices for reference
const TOPPING_OPTIONS: ToppingItem[] = [
  { name: 'Boba (Tapioca Pearls)', price: 0.50 },
  { name: 'Crystal Boba', price: 0.50 },
  { name: 'Popping Boba', price: 0.50 },
  { name: 'Pudding', price: 0.50 },
  { name: 'Aloe Vera', price: 0.50 },
  { name: 'Grass Jelly', price: 0.50 },
  { name: 'Red Bean', price: 0.50 },
  { name: 'Cheese Foam', price: 1.00 },
];

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (customizations: any) => void;
  currentItemName?: string; // Added to detect defaults
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ isOpen, onClose, onAddToOrder, currentItemName = '' }) => {
  const [size, setSize] = useState<string>('Small');
  const [iceLevel, setIceLevel] = useState<string>('Less Ice');
  const [sugarLevel, setSugarLevel] = useState<string>('50% Sugar');
  // Changed toppings to a map of Name -> Quantity
  const [toppings, setToppings] = useState<Record<string, number>>({});

  // Reset and set defaults when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      setSize('Small');
      setIceLevel('Less Ice');
      setSugarLevel('50% Sugar');
      
      // --- Determine Defaults based on Drink Name ---
      const initialToppings: Record<string, number> = {};
      
      const lowerName = currentItemName.toLowerCase();
      if (lowerName.includes('pearl')) {
        initialToppings['Boba (Tapioca Pearls)'] = 1;
      }
      if (lowerName.includes('pudding')) {
        initialToppings['Pudding'] = 1;
      }
      // Add more defaults here if needed (e.g., 'grass jelly')

      setToppings(initialToppings);
    }
  }, [isOpen, currentItemName]);

  if (!isOpen) return null;

  const handleReset = () => {
    setSize('Small');
    setIceLevel('Less Ice');
    setSugarLevel('50% Sugar');
    // Resetting clears ALL toppings, even defaults, or should it reset TO defaults? 
    // Usually "Reset" means "Back to standard", so let's re-run the default logic.
    const initialToppings: Record<string, number> = {};
    const lowerName = currentItemName.toLowerCase();
    if (lowerName.includes('pearl')) initialToppings['Boba (Tapioca Pearls)'] = 1;
    if (lowerName.includes('pudding')) initialToppings['Pudding'] = 1;
    setToppings(initialToppings); 
  };

  const handleAddToOrder = () => {
    onAddToOrder({ size, iceLevel, sugarLevel, toppings });
    onClose();
  };

  const updateToppingCount = (name: string, delta: number) => {
    setToppings(prev => {
      const currentQty = prev[name] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const newToppings = { ...prev, [name]: newQty };
      if (newQty === 0) delete newToppings[name]; // Clean up 0 entries
      return newToppings;
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-icon-btn" onClick={onClose}>×</button>
        
        <h2 className="modal-title">
          Customize <span style={{color: '#8a2be2', fontSize:'0.8em', display:'block', marginTop:'5px'}}>{currentItemName}</span>
        </h2>

        <div className="customization-scroll-area">
          {/* Size Section */}
          <div className="customization-section">
            <h3>Size</h3>
            <div className="options-grid">
              {['Small', 'Medium', 'Large'].map((opt) => (
                <label key={opt} className={`option-card ${size === opt ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="size"
                    value={opt}
                    checked={size === opt}
                    onChange={(e) => setSize(e.target.value)}
                  />
                  <span>{opt} {opt === 'Small' ? '(-$0.50)' : opt === 'Large' ? '(+$0.70)' : ''}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ice & Sugar Sections (Combined row for compactness) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
             <div className="customization-section">
              <h3>Ice Level</h3>
              <div className="options-grid compact">
                {['Regular Ice', 'Less Ice', 'No Ice', 'Extra Ice'].map((opt) => (
                  <label key={opt} className={`option-card ${iceLevel === opt ? 'selected' : ''}`}>
                    <input type="radio" name="iceLevel" value={opt} checked={iceLevel === opt} onChange={(e) => setIceLevel(e.target.value)} />
                    <span>{opt.replace(' Ice', '')}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="customization-section">
              <h3>Sugar Level</h3>
              <div className="options-grid compact">
                {['0%', '25%', '50%', '75%', '100%'].map((opt) => (
                  <label key={opt} className={`option-card ${sugarLevel === opt + ' Sugar' ? 'selected' : ''}`}>
                    <input type="radio" name="sugarLevel" value={opt + ' Sugar'} checked={sugarLevel === opt + ' Sugar'} onChange={(e) => setSugarLevel(e.target.value)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Toppings Section with Counters */}
          <div className="customization-section">
            <h3>Toppings</h3>
            <div className="toppings-list">
              {TOPPING_OPTIONS.map((topping) => {
                const qty = toppings[topping.name] || 0;
                const isSelected = qty > 0;
                
                return (
                  <div key={topping.name} className={`topping-row ${isSelected ? 'active' : ''}`}>
                    <div className="topping-info">
                      <span className="topping-name">{topping.name}</span>
                      <span className="topping-price">+${topping.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="qty-control">
                      <button 
                        className="qty-btn minus" 
                        onClick={() => updateToppingCount(topping.name, -1)}
                        disabled={qty === 0}
                      >−</button>
                      <span className="qty-display">{qty}</span>
                      <button 
                        className="qty-btn plus" 
                        onClick={() => updateToppingCount(topping.name, 1)}
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="reset-options-btn" onClick={handleReset}>Reset</button>
          <button className="add-to-order-btn" onClick={handleAddToOrder}>Add to Order</button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;