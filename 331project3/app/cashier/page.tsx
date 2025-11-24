"use client";

import React, { useState, useEffect } from "react";
import Header from "./components_cashier/header";
import MenuList, { MenuItem } from "./components_cashier/menulist";
import OrderSummary, { CustomOrderItem } from "./components_cashier/ordersummary";
import CustomizationModal from "./components_cashier/CustomizationModal";
import "./styles_cashier/menulist.css";
import "./styles_cashier/ordersummary.css";
import "./styles_cashier/customizationModal.css";

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<CustomOrderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoadingMenu(true);
        const res = await fetch("/api/cashier");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        
        type BackendMenuItem = {
          item_id: number | string;
          item_name: string;
          item_price: number | string;
        };

        const data = await res.json() as BackendMenuItem[];
        
        const mappedMenu: MenuItem[] = data.map((item: BackendMenuItem) => ({
          id: Number(item.item_id),
          name: String(item.item_name),
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

  type customizations = {
    size: string;
    iceLevel: string;
    sugarLevel: string;
    toppings: Record<string, number>; 
    sizeId?: number;
  };

  // Fetch sizeId from backend
  async function fetchSizeId(menuItemId: number, sizeName: string): Promise<number> {
    const res = await fetch(
      `/api/cashier/getSizeId?menuItemId=${menuItemId}&sizeName=${sizeName}`
    );
    if (!res.ok) throw new Error("Failed to fetch sizeId");
    const data = await res.json();
    return Number(data.sizeId);
  }

  // Fetch price for selected size
  async function fetchPriceForSize(menuItemId: number, sizeId: number): Promise<number> {
    const res = await fetch(
      `/api/cashier/getPrice?menuItemId=${menuItemId}&sizeId=${sizeId}`
    );
    if (!res.ok) throw new Error("Failed to fetch price");
    const data = await res.json();
    return Number(data.price);
  }

  const handleAddToOrder = async (customizations: customizations) => {
    if (!selectedItem) return;

    // get size id from backend
    const sizeId = await fetchSizeId(selectedItem.id, customizations.size);
    customizations.sizeId = sizeId;
    const currentBasePrice = await fetchPriceForSize(selectedItem.id, sizeId);
    if (isNaN(currentBasePrice)) {
      console.error(`Price fetch failed for item ${selectedItem.id}, sizeId ${sizeId}`);
      alert("Failed to fetch item price. Please try again.");
      return;
    }

    /*
    // Get Base Price
    let currentBasePrice = selectedItem.price; 
    if (customizations.size === 'Small') currentBasePrice -= 0.50;
    if (customizations.size === 'Large') currentBasePrice += 0.70;
    */

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
      item_id: selectedItem.id,
      name: selectedItem.name,
      basePrice: currentBasePrice,
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

const handleCheckout = async () => {
  try {
    // Transform the order into the format backend expects
    const itemsToSend = order.map(item => ({
      //item_id: item.item_id,                     // database column item_id
      sizeId: item.customizations.sizeId || 1,   // make sure sizeId exists
      finalPrice: item.finalPrice,
      //quantity: item.quantity
    }));

    const res = await fetch("/api/cashier/submitOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: itemsToSend })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Checkout failed:", data);
      alert("Checkout failed");
      return;
    }

    alert(`Order complete! Order ID: ${data.orderId}`);
    setOrder([]);
  } catch (err) {
    console.error(err);
    alert("Checkout failed");
  }
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
          {loadingMenu ? (
            <div className="loading-message">Loading menu...</div>
          ) : (
            <MenuList menuItems={menuItems} onSelectItem={handleSelectItem} />
          )}
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
        <button className="checkout-btn" onClick={handleCheckout}>Proceed to Payment</button>
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