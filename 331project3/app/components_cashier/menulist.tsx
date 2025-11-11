import React from "react";
import "../styles_cashier/menulist.css";

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

interface Props {
  menuItems: MenuItem[];
  addToOrder: (id: number) => void;
}

export default function MenuList({ menuItems, addToOrder }: Props) {
  return (
    <section className="menu">
      <h2>Menu</h2>
      <ul>
        {menuItems.map(item => (
          <li key={item.id}>
            {item.name} — ${item.price.toFixed(2)}
            <button onClick={() => addToOrder(item.id)}>Add</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
