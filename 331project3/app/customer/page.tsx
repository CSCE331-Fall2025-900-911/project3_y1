'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/types/menu';
import CustomizationModal from './components_customer/CustomizationModal';
import OrderBag, { BagItem } from './components_customer/OrderBag';
import MenuItemButton from './components/MenuItemButton';

export default function CustomerPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu-items');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleAddToBag = (customizations: {
    size: string;
    iceLevel: string;
    sugarLevel: string;
    toppings: string[];
  }) => {
    if (!selectedItem) return;

    // Calculate final price - ensure basePrice is a number
    let finalPrice = Number(selectedItem.item_price) || 0;
    if (customizations.size === 'Small') finalPrice -= 0.50;
    if (customizations.size === 'Large') finalPrice += 0.70;
    finalPrice += customizations.toppings.length * 0.50;

    const newBagItem: BagItem = {
      uniqueId: `${selectedItem.item_id}-${Date.now()}`,
      itemId: selectedItem.item_id,
      name: selectedItem.item_name || 'Unknown Item',
      basePrice: Number(selectedItem.item_price) || 0,
      finalPrice: finalPrice,
      customizations: customizations,
    };

    setBag((prevBag) => [...prevBag, newBagItem]);
  };

  const handleRemoveItem = (uniqueId: string) => {
    setBag((prevBag) => prevBag.filter((item) => item.uniqueId !== uniqueId));
  };

  const handleCheckout = async () => {
    if (bag.length === 0) return;

    const totalAmount = bag.reduce((sum, item) => sum + item.finalPrice, 0);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: bag,
          totalAmount: totalAmount,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Order placed successfully! Order ID: ${result.orderId}`);
        setBag([]); // Clear the bag
      } else {
        const error = await response.json();
        alert(`Failed to place order: ${error.message}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-8 text-black dark:text-zinc-50">
            Menu Items
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {menuItems.map((item) => (
              <div key={item.item_id} onClick={() => handleItemClick(item)}>
                <MenuItemButton item={item} />
              </div>
            ))}
          </div>
          
          {menuItems.length === 0 && (
            <p className="text-zinc-600 dark:text-zinc-400">
              No menu items found.
            </p>
          )}
        </div>
      </main>

      <OrderBag 
        bag={bag} 
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {selectedItem && (
        <CustomizationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToBag={handleAddToBag}
          itemName={selectedItem.item_name || 'Unknown Item'}
          basePrice={Number(selectedItem.item_price) || 0}
        />
      )}
    </div>
  );
}