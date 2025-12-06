'use client';

import { useState, useEffect, useRef } from 'react';
import { MenuItem, NUTRITION_DATA, NutritionInfo } from '@/types/menu';
import CustomizationModal from './components_customer/CustomizationModal';
import OrderBag, { BagItem } from './components_customer/OrderBag';
import MenuItemButton from './components_customer/MenuItemButton';
import CheckoutScreen from './components_customer/CheckoutScreen';
import NutritionModal from './components_customer/NutritionModal';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any; 
    googleTranslateElementInit: () => void;
  }
}

export default function CustomerPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const translateElementRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [nutritionItem, setNutritionItem] = useState<MenuItem & NutritionInfo | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    // Wait for the DOM element to be available
    const initGoogleTranslate = () => {
      const element = document.getElementById('google_translate_element');
      if (!element) {
        setTimeout(initGoogleTranslate, 100);
        return;
      }

      window.googleTranslateElementInit = () => {
        const translateElement = document.getElementById('google_translate_element');
        if (window.google && window.google.translate && translateElement) {
          try {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
              },
              'google_translate_element'
            );
          } catch (error) {
            console.error('Error initializing Google Translate:', error);
          }
        }
      };

      if (document.getElementById('google-translate-script')) {
        if (window.google && window.google.translate) {
          setTimeout(() => {
            window.googleTranslateElementInit();
          }, 100);
        }
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;

      script.onerror = () => {
        console.error('Failed to load Google Translate script');
      };

      document.body.appendChild(script);
    };

    initGoogleTranslate();

    return () => {
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/customer/menu-items');
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
    setIsEditing(false);
    setEditingItemId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setIsEditing(false);
    setEditingItemId(null);
  };

  const handleOpenNutrition = (item: MenuItem) => {
    const nutrition = NUTRITION_DATA[item.item_name || ''];
    if (nutrition) {
      setNutritionItem({ ...item, ...nutrition });
      setIsNutritionOpen(true);
    } else {
      console.warn('No nutrition data found for item:', item.item_name);
    }
  };

  const handleCloseNutrition = () => {
    setIsNutritionOpen(false);
    setNutritionItem(null);
  };

  const getCustomizationKey = (customizations: {
    size: string;
    iceLevel: string;
    sugarLevel: string;
    toppings: string[];
  }) => {
      const toppingsString = [...customizations.toppings].sort().join(',');
      return `${customizations.size}-${customizations.iceLevel}-${customizations.sugarLevel}-${toppingsString}`;
  };

  const handleAddToBag = (customizations: {
    size: string;
    iceLevel: string;
    sugarLevel: string;
    toppings: string[];
  },
    originalQuantity?: number
  ) => {
    if (!selectedItem) return;

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
        quantity: originalQuantity !== undefined ? originalQuantity : 1,
    };

    if (isEditing && editingItemId) {
      setBag((prevBag) =>
        prevBag.map((item) =>
          item.uniqueId === editingItemId ? { ...newBagItem, uniqueId: editingItemId } : item
        )
      );
    } else {
      const customKey = getCustomizationKey(customizations);
      const existingItemIndex = bag.findIndex(item => 
          item.itemId === selectedItem.item_id && 
          getCustomizationKey(item.customizations) === customKey
      );

      if (existingItemIndex !== -1) {
          setBag(prevBag => prevBag.map((item, index) => 
              index === existingItemIndex
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
          ));
      } else {
        setBag((prevBag) => [...prevBag, newBagItem]);
      }
    }
    handleCloseModal();
  };

  const handleEditItem = (uniqueId: string) => {
    const itemToEdit = bag.find(item => item.uniqueId === uniqueId);
    const menuItem = menuItems.find(item => item.item_id === itemToEdit?.itemId);

    if (itemToEdit && menuItem) {
        setSelectedItem(menuItem);
        setIsEditing(true);
        setEditingItemId(uniqueId);
        setIsModalOpen(true);
    }
  };
    
  const handleQuantityChange = (uniqueId: string, delta: number) => {
      setBag(prevBag => {
          const itemIndex = prevBag.findIndex(item => item.uniqueId === uniqueId);
          if (itemIndex === -1) return prevBag;

          const newQuantity = prevBag[itemIndex].quantity + delta;

          if (newQuantity <= 0) {
              return prevBag.filter(item => item.uniqueId !== uniqueId);
          }

          return prevBag.map((item, index) => 
              index === itemIndex ? { ...item, quantity: newQuantity } : item
          );
      });
  };

  const handleDelete = (uniqueId: string) => {
      setBag((prevBag) => prevBag.filter((item) => item.uniqueId !== uniqueId));
  };

  const handleCheckout = () => {
    if (bag.length > 0) {
      setIsCheckingOut(true);
    }
  };

  const handleFinalizeOrder = async (customerEmail: string | null) => {
    if (bag.length === 0) return;

    const flattenedItems = bag.flatMap(groupedItem => 
        Array(groupedItem.quantity).fill({
            itemId: groupedItem.itemId,
            finalPrice: groupedItem.finalPrice,
            customizations: groupedItem.customizations
        })
    );
        
    const totalAmount = bag.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);

    try {
      const response = await fetch('/api/customer/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: flattenedItems,
          totalAmount: totalAmount,
          customerEmail: customerEmail,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Order placed successfully! Order ID: ${result.orderId}\n${customerEmail ? `A notification email will be sent to ${customerEmail} when your order is ready.` : ''}`);
        setBag([]); // Clear the bag
      } else {
        const error = await response.json();
        alert(`Failed to place order: ${error.message}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading menu...</p>
      </div>
    );
  }

  const totalAmount = bag.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const itemBeingEdited = editingItemId ? bag.find(item => item.uniqueId === editingItemId) : null;

  if (isCheckingOut) {
    return (
      <CheckoutScreen
        bag={bag}
        total={totalAmount}
        onFinalizeOrder={handleFinalizeOrder}
        onCancel={() => setIsCheckingOut(false)}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              Menu Items
            </h1>
            <div id="google_translate_element" ref={translateElementRef} className="translate-button"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {menuItems.map((item) => (
              <MenuItemButton
                key={item.item_id}
                item={item}
                onClick={() => handleItemClick(item)} 
                onNutritionClick={() => handleOpenNutrition(item)}
              />
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
        onQuantityChange={handleQuantityChange}
        onDelete={handleDelete}
        onCheckout={handleCheckout}
        onEdit={handleEditItem}
        editingItemId={editingItemId}
      />

      <NutritionModal
        isOpen={isNutritionOpen}
        onClose={handleCloseNutrition}
        item={nutritionItem}
      />

      {selectedItem && (
        <CustomizationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToBag={handleAddToBag}
          itemName={selectedItem.item_name || 'Unknown Item'}
          basePrice={Number(selectedItem.item_price) || 0}
          initialCustomizations={itemBeingEdited ? itemBeingEdited.customizations : undefined}
          isEditing={isEditing}
          currentQuantity={itemBeingEdited ? itemBeingEdited.quantity : undefined}
        />
      )}
    </div>
  );
}