"use client";
import React, { useState } from "react";
import Header from "./components_cashier/header";
import MenuList from "./components_cashier/menulist";
import OrderSummary from "./components_cashier/ordersummary";

export default function HomePage() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Classic Milk Tea", price: 4.5 },
    { id: 2, name: "Taro Milk Tea", price: 5.0 },
    { id: 3, name: "Brown Sugar Boba", price: 5.5 },
  ]);

  const [order, setOrder] = useState<{ id: number; qty: number }[]>([]);

  const addToOrder = (id: number) => {
    setOrder(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  return (
    <div>
      <Header />
      <main>
        <MenuList menuItems={menuItems} addToOrder={addToOrder} />
        <OrderSummary order={order} menuItems={menuItems} />
      </main>
    </div>
  );
}
