'use client';

import { useState, useEffect, useRef } from 'react';
import { MenuItem } from '@/types/menu';
import CustomizationModal from './components_customer/CustomizationModal';
import OrderBag, { BagItem } from './components_customer/OrderBag';
import MenuItemButton from './components_customer/MenuItemButton';

declare global {
  interface Window {
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
  const translateElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    // Wait for the DOM element to be available
    const initGoogleTranslate = () => {
      const element = document.getElementById('google_translate_element');
      if (!element) {
        // Retry after a short delay if element doesn't exist yet
        setTimeout(initGoogleTranslate, 100);
        return;
      }

      // Define the callback function globally before loading the script
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

      // Check if script already exists
      if (document.getElementById('google-translate-script')) {
        // Script already loaded, just initialize if Google Translate is available
        if (window.google && window.google.translate) {
          setTimeout(() => {
            window.googleTranslateElementInit();
          }, 100);
        }
        return;
      }

      // Add script tag
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      
      // Handle script load errors
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
      };
      
      document.body.appendChild(script);
    };

    // Start initialization
    initGoogleTranslate();

    // Cleanup function
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
      const response = await fetch('/api/customer/orders', {
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              Menu Items
            </h1>
            <div id="google_translate_element" ref={translateElementRef} className="translate-button"></div>
          </div>
          
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