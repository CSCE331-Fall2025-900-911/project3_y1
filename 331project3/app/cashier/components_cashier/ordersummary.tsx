import React from "react";
import "../styles_cashier/ordersummary.css";

export interface CustomOrderItem {
  uniqueId: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  quantity: number; 
  customizations: {
    size: string;
    iceLevel: string;
    sugarLevel: string;
    toppings: Record<string, number>; 
    sizeId?: number;
  };
}

interface Props {
  order: CustomOrderItem[];
  onDelete?: (id: string) => void;
  onQuantityChange?: (id: string, delta: number) => void; 
}

export default function OrderSummary({ order, onDelete, onQuantityChange }: Props) {
  if (order.length === 0) {
    return (
      <div className="summary-table-card" style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
        <p>No items in current order.</p>
      </div>
    );
  }

  return (
    <div className="summary-table-card">
      <table className="order-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {order.map(item => {
            const toppingEntries = Object.entries(item.customizations.toppings || {});
            const toppingString = toppingEntries.map(([name, qty]) => {
               return qty > 1 ? `${name} x${qty}` : name;
            }).join(", ");

            return (
              <tr key={item.uniqueId}>
                <td>
                  <span className="item-name-text">{item.name}</span>
                  <div className="item-customizations-text">
                    {item.customizations.size}, {item.customizations.sugarLevel}, {item.customizations.iceLevel}
                    {toppingString && (
                      <span> • {toppingString}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="qty-controls-row">
                    {onQuantityChange && (
                      <button 
                        className="qty-mini-btn"
                        onClick={() => onQuantityChange(item.uniqueId, -1)}
                        disabled={item.quantity <= 1}
                      >−</button>
                    )}
                    <span className="qty-badge">{item.quantity}</span>
                    {onQuantityChange && (
                      <button 
                        className="qty-mini-btn"
                        onClick={() => onQuantityChange(item.uniqueId, 1)}
                      >+</button>
                    )}
                  </div>
                </td>
                <td><strong>${(item.finalPrice * item.quantity).toFixed(2)}</strong></td>
                <td>
                  {onDelete && (
                    <button className="delete-btn" onClick={() => onDelete(item.uniqueId)}>🗑</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}