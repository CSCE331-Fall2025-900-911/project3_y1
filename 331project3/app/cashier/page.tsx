"use client";

import React, { useState, useEffect } from "react";
import Header from "./components_cashier/header";
import MenuList, { MenuItem } from "./components_cashier/menulist";
import OrderSummary, { CustomOrderItem } from "./components_cashier/ordersummary";
import CustomizationModal from "./components_cashier/CustomizationModal";
import "./styles_cashier/menulist.css";
import "./styles_cashier/ordersummary.css";
import "./styles_cashier/customizationModal.css";

const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Classic Pearl Milk Tea 2", price: 5.80 },
  { id: 2, name: "Honey Pearl Milk Tea", price: 6.00 },
  { id: 3, name: "Coffee Creama", price: 6.00 },
  { id: 4, name: "Coffee Milk Tea w/ Coffee Jelly", price: 6.25 },
  { id: 5, name: "Hokkaido Pearl Milk Tea", price: 6.25 },
  { id: 6, name: "Thai Pearl Milk Tea", price: 6.25 },
  { id: 7, name: "Mango Green Tea", price: 5.80 },
  { id: 9, name: "Honey Lemonade", price: 5.20 },
  { id: 10, name: "Mango & Passion Fruit Tea", price: 6.25 },
  { id: 11, name: "Tiger Passion Cheese", price: 6.25 },
  { id: 12, name: "Mango Boba", price: 6.50 },
  { id: 13, name: "Strawberry Coconut", price: 6.50 },
  { id: 14, name: "Halo Halo", price: 6.95 },
  { id: 15, name: "Matcha Pearl Milk Tea", price: 6.50 },
  { id: 16, name: "Strawberry Matcha Fresh Milk", price: 6.45 },
  { id: 17, name: "Matcha Fresh Milk", price: 6.25 },
  { id: 18, name: "Mango Matcha Fresh Milk", price: 6.50 },
  { id: 19, name: "Oreo w/ Pearl", price: 6.75 },
  { id: 20, name: "Taro w/ Pudding", price: 6.75 },
  { id: 21, name: "Thai Tea w/ Pearl", price: 6.75 },
  { id: 22, name: "Coffee w/ Ice Cream", price: 6.75 },
];

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [order, setOrder] = useState<CustomOrderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/cashier");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        
        const data = await res.json();
        
        // Map backend data to your MenuItem interface if needed
        const mappedMenu: MenuItem[] = data.map((item: any) => ({
          id: item.item_id,
          name: item.item_name,
          price: Number(item.item_price),
        }));


        console.log("Fetched Menu Items:", mappedMenu);

        setMenuItems(mappedMenu);
      } catch (err) {
        console.error(err);
        alert("Error fetching menu items.");
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenuItems();
  }, []);

  const subtotal = order.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const total = subtotal;

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddToOrder = async (customizations: any) => {
    if (!selectedItem) return;

    // Get Base Price
    let currentBasePrice = selectedItem.price; 
    if (customizations.size === 'Small') currentBasePrice -= 0.50;
    if (customizations.size === 'Large') currentBasePrice += 0.70;

    // Calculate Toppings Cost with Defaults Logic
    let toppingsCost = 0;
    const toppingsMap = customizations.toppings as Record<string, number>;
    const drinkNameLower = selectedItem.name.toLowerCase();

    // Define Defaults based on drink name
    const defaults = {
      hasBoba: drinkNameLower.includes('pearl') || drinkNameLower.includes('boba'),
      hasPudding: drinkNameLower.includes('pudding'),
      hasCheese: drinkNameLower.includes('cheese'),
      hasCoffeeJelly: drinkNameLower.includes('coffee jelly'),
    };

    for (const [name, qty] of Object.entries(toppingsMap)) {
      let freeQty = 0;
      
      // Check Boba
      if (defaults.hasBoba && name === 'Boba (Tapioca Pearls)') {
        freeQty = 1;
      }
      // Check Pudding
      if (defaults.hasPudding && name === 'Pudding') {
        freeQty = 1;
      }
      // Check Cheese Foam (For Tiger Passion Cheese)
      if (defaults.hasCheese && name === 'Cheese Foam') {
        freeQty = 1;
      }
      // Check Coffee Jelly
      if (defaults.hasCoffeeJelly && name === 'Coffee Jelly') {
        freeQty = 1;
      }

      // Calculate how many we charge for
      const paidQty = Math.max(0, qty - freeQty);
      
      const pricePerUnit = name.includes('Cheese Foam') ? 1.00 : 0.50;
      toppingsCost += paidQty * pricePerUnit;
    }

    const finalPrice = currentBasePrice + toppingsCost;

    const newOrderItem: CustomOrderItem = {
      uniqueId: `${selectedItem.id}-${new Date().getTime()}`,
      name: selectedItem.name,
      basePrice: selectedItem.price,
      quantity: 1,
      customizations: {
        ...customizations,
        toppings: toppingsMap 
      },
      finalPrice: finalPrice,
    };

    setOrder((prevOrder) => [...prevOrder, newOrderItem]);
    handleCloseModal();
  };

  const handleDeleteItem = (uniqueId: string) => {
    setOrder(prev => prev.filter(item => item.uniqueId !== uniqueId));
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setOrder(prev => prev.map(item => {
      if (item.uniqueId === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  return (
    <div className="pos-container">
      <div style={{ gridColumn: "1 / -1" }}>
        <Header />
      </div>

      <div className="pos-main-content">
        <section className="pos-section">
          <MenuList menuItems={menuItems} onSelectItem={handleSelectItem} />
        </section>

        <section className="pos-section">
           <div className="section-header">
            <h3>Purchase List</h3>
            <span className="item-count-badge">
              {order.reduce((acc, item) => acc + item.quantity, 0)} item(s)
            </span>
          </div>
          <OrderSummary 
            order={order} 
            onDelete={handleDeleteItem}
            onQuantityChange={handleQuantityChange} 
          />
        </section>
      </div>

      <div className="pos-sidebar">

        <div className="sidebar-card total-card">
          <div className="total-row"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="total-row"><span>Tax:</span><span>$0.00</span></div>
          <div className="total-row final-total"><span>Total:</span><span>${total.toFixed(2)}</span></div>
        </div>
        <button className="checkout-btn">Proceed to Payment</button>
      </div>

      <CustomizationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToOrder={handleAddToOrder}
        currentItemName={selectedItem?.name} 
      />
    </div>
  );
}