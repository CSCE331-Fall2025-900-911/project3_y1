import React from "react";
import "../styles_cashier/ordersummary.css";

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  qty: number;
}

interface Props {
  order: OrderItem[];
  menuItems: MenuItem[];
}

export default function OrderSummary({ order, menuItems }: Props) {
  const total = order.reduce((sum, o) => {
    const item = menuItems.find(i => i.id === o.id);
    return item ? sum + item.price * o.qty : sum;
  }, 0);

  return (
    <section className="summary">
      <h2>Order Summary</h2>
      <ul>
        {order.map(o => {
          const item = menuItems.find(i => i.id === o.id);
          if (!item) return null;
          return (
            <li key={o.id}>
              {item.name} x{o.qty} = ${(item.price * o.qty).toFixed(2)}
            </li>
          );
        })}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
    </section>
  );
}
