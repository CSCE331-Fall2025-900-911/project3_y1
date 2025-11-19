import React from "react";
import "../styles_cashier/ordersummary.css";

export interface CustomOrderItem {
  uniqueId: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  customizations: {
    size: string;
    iceLevel: string;
    sugarLevel: string;
    toppings: string[];
    sizeId: number;
  };
}

interface Props {
  order: CustomOrderItem[];
  onDelete?: (id: string) => void;
}

export default function OrderSummary({ order, onDelete }: Props) {
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
            <th>Price</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {order.map(item => (
            <tr key={item.uniqueId}>
              <td>
                <span className="item-name-text">{item.name}</span>
                <div className="item-customizations-text">
                  {item.customizations.size}, {item.customizations.sugarLevel}, {item.customizations.iceLevel}
                  {item.customizations.toppings?.length > 0 && (
                    <span> • +{item.customizations.toppings.length} Toppings</span>
                  )}
                </div>
              </td>
              <td>
                <span className="qty-badge">1</span>
              </td>
              <td>${item.finalPrice.toFixed(2)}</td>
              <td><strong>${item.finalPrice.toFixed(2)}</strong></td>
              <td>
                {onDelete && (
                  <button 
                    className="delete-btn" 
                    onClick={() => onDelete(item.uniqueId)}
                    title="Remove Item"
                  >
                    🗑
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}