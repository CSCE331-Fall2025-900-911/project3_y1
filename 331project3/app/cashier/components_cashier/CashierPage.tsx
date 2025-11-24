import React, { useState } from "react";
import MenuList, { MenuItem } from "./menulist";
import OrderSummary, { CustomOrderItem } from "./ordersummary";
import CustomizationModal from "./CustomizationModal";
import "../styles_cashier/customizationModal.css";

const mockMenuItems: MenuItem[] = [
  { id: 1, name: "Classic Milk Tea", price: 5.50 },
  { id: 2, name: "Taro Milk Tea", price: 6.00 },
  { id: 3, name: "Matcha Latte", price: 6.25 },
];

export default function CashierPage() {
  const [order, setOrder] = useState<CustomOrderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  type Customizations = {
    size: string;
    iceLevel: string;
    sugarLevel: string;
    toppings: Record<string, number>;
    sizeId?: number;
  };

  const handleAddToOrder = (customizations: Customizations) => {
    if (!selectedItem) return; // Should never happen if modal is open


    let finalPrice = selectedItem.price;
    if (customizations.size === "Small") finalPrice -= 0.50;
    if (customizations.size === "Large") finalPrice += 0.70;
    // Add price for each topping
    finalPrice += customizations.toppings.length * 0.50;

    // Create a new, unique order item
    const newOrderItem: CustomOrderItem = {
      uniqueId: `${selectedItem.id}-${new Date().getTime()}`, 
      name: selectedItem.name,
      basePrice: selectedItem.price,
      customizations: customizations,
      finalPrice: finalPrice,
      quantity: 1,
      item_id: selectedItem.id
    };

    // Add the new item to the order state
    setOrder((prevOrder) => [...prevOrder, newOrderItem]);

    // Close the modal
    handleCloseModal();
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
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



