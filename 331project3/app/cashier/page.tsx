// app/cashierpage.tsx
"use client";

import React, { useState, useEffect } from "react";
import MenuList, { MenuItem } from "./components_cashier/menulist";
import OrderSummary, { CustomOrderItem } from "./components_cashier/ordersummary";
import CustomizationModal from "./components_cashier/CustomizationModal";
import "./styles_cashier/menulist.css";
import "./styles_cashier/ordersummary.css";
import "./styles_cashier/customizationModal.css";

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // <-- replace mockMenuItems
  const [order, setOrder] = useState<CustomOrderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loadingMenu, setLoadingMenu] = useState(true);
// Calculate Totals
  const subtotal = order.reduce((sum, item) => sum + (item.finalPrice || 0), 0);
  const total = subtotal; // Add tax logic here if needed later
  // Fetch menu items from the backend when the page loads
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

  // --- Fetch sizeId from backend ---
  const fetchSizeId = async (menuItemId: number, sizeName: string): Promise<number> => {
    try {
      const res = await fetch(
        `/api/cashier/getSizeId?menuItemId=${menuItemId}&sizeName=${encodeURIComponent(sizeName)}`
      );
      if (!res.ok) throw new Error("Failed to fetch size ID");
      const data = await res.json();
      return data.sizeId;
    } catch (err) {
      console.error(err);
      return -1;
    }
  };

  // --- Fetch price for certain size ---
  const fetchPriceForSize = async (menuItemId: number, sizeId: number): Promise<number> => {
    try {
      const res = await fetch(
        `/api/cashier/getPrice?menuItemId=${menuItemId}&sizeId=${sizeId}`
      );
      if (!res.ok) throw new Error("Failed to fetch price");
      const data = await res.json();
      return data.price;
    } catch (err) {
      console.error(err);
      return -1;
    }
  };

  // --- Modal handlers ---
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

    // 1. Fetch the sizeId from backend
    const sizeId = await fetchSizeId(selectedItem.id, customizations.size);
    
    // 2. Get base price for the selected size
    let fetchedPrice = await fetchPriceForSize(selectedItem.id, sizeId);

    // Fallback to base price if fetch fails or returns invalid price
    if (fetchedPrice <= 0) {
      fetchedPrice = selectedItem.price;
    }

    // 3. Calculate Toppings Cost
    // According to your Modal: Standard toppings are +$0.50, Cheese Foam is +$1.00
    const toppingsCost = customizations.toppings.reduce((sum: number, topping: string) => {
      if (topping.includes("Cheese Foam")) {
        return sum + 1.00;
      }
      return sum + 0.50;
    }, 0);

    // 4. Calculate Final Price
    const finalPrice = fetchedPrice + toppingsCost;
    const newOrderItem: CustomOrderItem = {
      uniqueId: `${selectedItem.id}-${new Date().getTime()}`,
      name: selectedItem.name,
      basePrice: selectedItem.price,
      customizations: {
        ...customizations,
        sizeId,
      },
      finalPrice: finalPrice, // <--- Updated to include toppings
    };

    setOrder((prevOrder) => [...prevOrder, newOrderItem]);
    handleCloseModal();
  };
  const handleDeleteItem = (uniqueId: string) => {
    setOrder(prev => prev.filter(item => item.uniqueId !== uniqueId));
  };

 return (
    <div className="pos-container">
      {/* --- Left Column: Menu & Order List --- */}
      <div className="pos-main-content">
        
        {/* Quick Add Section */}
        <section className="pos-section">
          <div className="section-header">
            <h3>Quick Add Drinks</h3>
            <span className="section-subtitle">All Drinks</span>
          </div>
          <MenuList 
            menuItems={menuItems} 
            onSelectItem={handleSelectItem} 
          />
        </section>

        {/* Purchase List Section */}
        <section className="pos-section">
           <div className="section-header">
            <h3>Purchase List</h3>
            <span className="item-count-badge">{order.length} item(s)</span>
          </div>
          <OrderSummary order={order} onDelete={handleDeleteItem} />
        </section>
      </div>

      {/* --- Right Column: Sidebar --- */}
      <div className="pos-sidebar">
        {/* Loyalty Card */}
        <div className="sidebar-card">
          <button className="loyalty-btn">
            🏷️ Apply Loyalty Discount
          </button>
        </div>

        {/* Total Card */}
        <div className="sidebar-card total-card">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Tax:</span>
            <span>$0.00</span>
          </div>
          <div className="total-row final-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button className="checkout-btn">
          Proceed to Payment
        </button>
      </div>

      <CustomizationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToOrder={handleAddToOrder}
      />
    </div>
  );
}