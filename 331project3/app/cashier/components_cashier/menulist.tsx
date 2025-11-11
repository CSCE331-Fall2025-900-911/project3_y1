import React from "react";
import "../styles_cashier/menulist.css";

export interface MenuItem {
  id: number;
  name: string;
  price: number;
}

interface Props {
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export default function MenuList({ menuItems, onSelectItem }: Props) {
  return (
    <section className="menu">
      <h2>Menu</h2>
      <ul>
        {menuItems.map(item => (
          <li key={item.id}>
            {item.name} — ${item.price.toFixed(2)}
            <button onClick={() => onSelectItem(item)}>Add</button>
          </li>
        ))}
      </ul>
    </section>
  );
}