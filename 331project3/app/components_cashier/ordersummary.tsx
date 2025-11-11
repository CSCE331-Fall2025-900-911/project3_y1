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
  };
}

interface Props {
  order: CustomOrderItem[];
}

export default function OrderSummary({ order }: Props) {
  const total = order.reduce((sum, item) => sum + (item.finalPrice || 0), 0);

  return (
    <section className="summary">
      <h2>Order Summary</h2>
      {order.length === 0 ? (
        <p>Your order is empty.</p>
      ) : (
        <ul>
          {order.map(item => (
            <li key={item.uniqueId} className="order-item-details">
              <span className="item-name">{item.name || "Unknown Item"}</span>
              <span className="item-price">
                ${(item.finalPrice || 0).toFixed(2)}
              </span>
              
              {item.customizations ? (
                <ul className="customizations-list">
                  <li>{item.customizations.size}</li>
                  <li>{item.customizations.iceLevel}</li>
                  <li>{item.customizations.sugarLevel}</li>
                  {item.customizations.toppings?.length > 0 && (
                    <li>Toppings: {item.customizations.toppings.join(', ')}</li>
                  )}
                </ul>
              ) : (
                <ul className="customizations-list"><li>No customizations</li></ul>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="summary-total">Total: ${total.toFixed(2)}</p>
    </section>
  );
}