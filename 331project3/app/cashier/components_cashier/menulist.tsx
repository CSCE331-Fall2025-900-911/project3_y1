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
    <ul className="menu-grid">
      {menuItems.map(item => (
        <li key={item.id} className="menu-card" onClick={() => onSelectItem(item)}>
          {/* Mock Category Tag for visuals */}
          <span className="card-tag">DRINK • {item.id}</span>
          <span className="card-name">{item.name}</span>
          <span className="card-price">${item.price.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
}