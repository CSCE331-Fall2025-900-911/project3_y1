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

    // Fetch the sizeId from backend
    const sizeId = await fetchSizeId(selectedItem.id, customizations.size);
    // Get price for selected size
    const finalPrice = await fetchPriceForSize(selectedItem.id, sizeId);

    const newOrderItem: CustomOrderItem = {
      uniqueId: `${selectedItem.id}-${new Date().getTime()}`,
      name: selectedItem.name,
      basePrice: selectedItem.price,
      customizations: {
        ...customizations,
        sizeId,
      },
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