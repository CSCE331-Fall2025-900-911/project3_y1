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

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddToOrder = (customizations: any) => {
    if (!selectedItem) return;

    let finalPrice = selectedItem.price;
    if (customizations.size === "Small") finalPrice -= 0.50;
    if (customizations.size === "Large") finalPrice += 0.70;
    finalPrice += customizations.toppings.length * 0.50;

    const newOrderItem: CustomOrderItem = {
      uniqueId: `${selectedItem.id}-${new Date().getTime()}`,
      name: selectedItem.name,
      basePrice: selectedItem.price,
      customizations: customizations,
      finalPrice: finalPrice,
    };

    setOrder((prevOrder) => [...prevOrder, newOrderItem]);
    handleCloseModal();
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <MenuList
        menuItems={menuItems}
        onSelectItem={handleSelectItem}
      />
      
      <OrderSummary order={order} />

      <CustomizationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToOrder={handleAddToOrder}
      />
    </div>
  );
}



/*
"use client"; // Add this directive for Next.js App Router

import React, { useState } from "react";
import MenuList, { MenuItem } from "./components_cashier/menulist";
import OrderSummary, { CustomOrderItem } from "./components_cashier/ordersummary";
import CustomizationModal from "./components_cashier/CustomizationModal";
// Make sure to import the CSS files
import "./styles_cashier/menulist.css";
import "./styles_cashier/ordersummary.css";
import "./styles_cashier/customizationModal.css";

// Mock data for the menu
const mockMenuItems: MenuItem[] = [
  { id: 1, name: "Classic Milk Tea", price: 5.50 },
  { id: 2, name: "Taro Milk Tea", price: 6.00 },
  { id: 3, name: "Matcha Latte", price: 6.25 },
];

// This is your new HomePage component
export default function HomePage() {
  // State for the list of customized items in the order
  const [order, setOrder] = useState<CustomOrderItem[]>([]);
  
  // State to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State to remember which item is being customized
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // This is passed to MenuList. It runs when "Add" is clicked.
  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // This is passed to the Modal. It runs when the modal closes.
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // This is passed to the Modal. It runs when "Add to Order" is clicked in the modal.
  const handleAddToOrder = (customizations: any) => {
    if (!selectedItem) return; // Should never happen if modal is open

    // --- Price Calculation Logic ---
    let finalPrice = selectedItem.price;
    if (customizations.size === "Small") finalPrice -= 0.50;
    if (customizations.size === "Large") finalPrice += 0.70;
    finalPrice += customizations.toppings.length * 0.50;
    // TODO: Handle extra charge for items like "Cheese Foam (+$1.00)"

    // Create a new, unique order item
    const newOrderItem: CustomOrderItem = {
      uniqueId: `${selectedItem.id}-${new Date().getTime()}`, // Unique ID for React key
      name: selectedItem.name,
      basePrice: selectedItem.price,
      customizations: customizations,
      finalPrice: finalPrice, // This is where finalPrice is set!
    };

    // Add the new item to the order state
    setOrder((prevOrder) => [...prevOrder, newOrderItem]);

    // Close the modal
    handleCloseModal();
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <MenuList
        menuItems={mockMenuItems}
        onSelectItem={handleSelectItem}
      />
      
      <OrderSummary order={order} />

      <CustomizationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToOrder={handleAddToOrder}
      />
    </div>
  );
}
  */