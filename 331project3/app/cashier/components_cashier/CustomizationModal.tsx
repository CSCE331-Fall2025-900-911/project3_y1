import React, { useState } from 'react';
import "../styles_cashier/customizationModal.css";

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (customizations: any) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ isOpen, onClose, onAddToOrder }) => {
  const [size, setSize] = useState<string>('Small');
  const [iceLevel, setIceLevel] = useState<string>('Less Ice');
  const [sugarLevel, setSugarLevel] = useState<string>('50% Sugar');
  const [toppings, setToppings] = useState<string[]>(['Boba']);

  if (!isOpen) {
    return null;
  }

  const handleReset = () => {
    setSize('Small');
    setIceLevel('Less Ice');
    setSugarLevel('50% Sugar');
    setToppings(['Boba']);
  };

  const handleAddToOrder = () => {
    onAddToOrder({ size, iceLevel, sugarLevel, toppings });
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">CUSTOMIZATIONS</h2>

        <div className="customization-section">
          <h3>Size</h3>
          <label>
            <input
              type="radio"
              name="size"
              value="Small"
              checked={size === 'Small'}
              onChange={(e) => setSize(e.target.value)}
            />
            Small (-$0.50)
          </label>
          <label>
            <input
              type="radio"
              name="size"
              value="Medium"
              checked={size === 'Medium'}
              onChange={(e) => setSize(e.target.value)}
            />
            Medium
          </label>
          <label>
            <input
              type="radio"
              name="size"
              value="Large"
              checked={size === 'Large'}
              onChange={(e) => setSize(e.target.value)}
            />
            Large (+$0.70)
          </label>
        </div>

        <div className="customization-section">
          <h3>Ice Level</h3>
          <label>
            <input
              type="radio"
              name="iceLevel"
              value="Regular Ice"
              checked={iceLevel === 'Regular Ice'}
              onChange={(e) => setIceLevel(e.target.value)}
            />
            Regular Ice
          </label>
          <label>
            <input
              type="radio"
              name="iceLevel"
              value="Less Ice"
              checked={iceLevel === 'Less Ice'}
              onChange={(e) => setIceLevel(e.target.value)}
            />
            Less Ice
          </label>
          <label>
            <input
              type="radio"
              name="iceLevel"
              value="No Ice"
              checked={iceLevel === 'No Ice'}
              onChange={(e) => setIceLevel(e.target.value)}
            />
            No Ice
          </label>
          <label>
            <input
              type="radio"
              name="iceLevel"
              value="Extra Ice"
              checked={iceLevel === 'Extra Ice'}
              onChange={(e) => setIceLevel(e.target.value)}
            />
            Extra Ice
          </label>
        </div>

        <div className="customization-section">
          <h3>Sugar Level</h3>
          <label>
            <input
              type="radio"
              name="sugarLevel"
              value="0% Sugar"
              checked={sugarLevel === '0% Sugar'}
              onChange={(e) => setSugarLevel(e.target.value)}
            />
            0% Sugar
          </label>
          <label>
            <input
              type="radio"
              name="sugarLevel"
              value="25% Sugar"
              checked={sugarLevel === '25% Sugar'}
              onChange={(e) => setSugarLevel(e.target.value)}
            />
            25% Sugar
          </label>
          <label>
            <input
              type="radio"
              name="sugarLevel"
              value="50% Sugar"
              checked={sugarLevel === '50% Sugar'}
              onChange={(e) => setSugarLevel(e.target.value)}
            />
            50% Sugar
          </label>
          <label>
            <input
              type="radio"
              name="sugarLevel"
              value="75% Sugar"
              checked={sugarLevel === '75% Sugar'}
              onChange={(e) => setSugarLevel(e.target.value)}
            />
            75% Sugar
          </label>
          <label>
            <input
              type="radio"
              name="sugarLevel"
              value="100% Sugar"
              checked={sugarLevel === '100% Sugar'}
              onChange={(e) => setSugarLevel(e.target.value)}
            />
            100% Sugar
          </label>
        </div>

        <div className="customization-section">
          <h3>Toppings (+$0.50 each)</h3>
          <label>
            <input
              type="checkbox"
              name="topping"
              value="Boba (Tapioca Pearls)"
              checked={toppings.includes('Boba (Tapioca Pearls)')}
              onChange={handleToppingChange}
            />
            Boba (Tapioca Pearls)
          </label>
          <label>
            <input
              type="checkbox"
              name="topping"
              value="Crystal Boba"
              checked={toppings.includes('Crystal Boba')}
              onChange={handleToppingChange}
            />
            Crystal Boba
          </label>
          <label>
            <input
              type="checkbox"
              name="topping"
              value="Popping Boba"
              checked={toppings.includes('Popping Boba')}
              onChange={handleToppingChange}
            />
            Popping Boba
          </label>
          <label>
            <input
              type="checkbox"
              name="topping"
              value="Pudding"
              checked={toppings.includes('Pudding')}
              onChange={handleToppingChange}
            />
            Pudding
          </label>
          <label>
            <input
              type="checkbox"
              name="topping"
              value="Aloe Vera"
              checked={toppings.includes('Aloe Vera')}
              onChange={handleToppingChange}
            />
            Aloe Vera
          </label>
          <label>
            <input
              type="checkbox"
              name="topping"
              value="Grass Jelly"
              checked={toppings.includes('Grass Jelly')}
              onChange={handleToppingChange}
            />
            Grass Jelly
          </label>
          <label>
            <input
              type="checkbox"
              name="topping"
              value="Red Bean"
              checked={toppings.includes('Red Bean')}
              onChange={handleToppingChange}
            />
            Red Bean
          </label>
          <label>
            <input
              type="checkbox"
              name="topping"
              value="Cheese Foam (+$1.00)"
              checked={toppings.includes('Cheese Foam (+$1.00)')}
              onChange={handleToppingChange}
            />
            Cheese Foam (+$1.00)
          </label>
        </div>

        <div className="modal-actions">
          <button className="add-to-order-btn" onClick={handleAddToOrder}>
            Add to Order
          </button>
          <button className="reset-options-btn" onClick={handleReset}>
            Reset Options
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;