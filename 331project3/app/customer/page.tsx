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
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
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
    
  const toggleContrast = () => {
      setIsHighContrast(!isHighContrast);
  };

  if (isLoading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isHighContrast ? 'bg-[#333333] text-white' : 'bg-gray-100 text-gray-600'}`}>
        <p className="font-medium text-lg">Loading menu...</p>
      </div>
    );
  }

  const totalAmount = bag.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const itemBeingEdited = editingItemId ? bag.find(item => item.uniqueId === editingItemId) : null;
  const mainBgClass = isHighContrast ? "bg-[#333333]" : "bg-gray-100";
  const contentBgClass = isHighContrast ? "bg-[#333333]" : "bg-transparent"; 
  const headerClass = isHighContrast 
    ? "text-white" 
    : "text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500";
  
  const headerContainerClass = isHighContrast
    ? "bg-[#333333] border border-gray-600 shadow-sm"
    : "bg-white shadow-sm border border-gray-100";

  const contrastBtnClass = isHighContrast
    ? "bg-purple-600 text-white border-2 border-purple-400 hover:bg-purple-700 font-bold"
    : "bg-white text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 font-bold border";

  const noItemsClass = isHighContrast ? "text-gray-300" : "text-gray-500";

  if (isCheckingOut) {
    return (
      <CheckoutScreen
        bag={bag}
        total={totalAmount}
        onFinalizeOrder={handleFinalizeOrder}
        onCancel={() => setIsCheckingOut(false)}
        isHighContrast={isHighContrast}
      />
    );
  }

  return (
    <div className={`flex min-h-screen items-center justify-center font-sans ${mainBgClass}`}>
      <style dangerouslySetInnerHTML={{__html: `
        .goog-te-gadget {
            color: transparent !important;
            font-size: 0 !important;
        }
        .goog-te-gadget span {
            display: none !important;
        }
        .goog-te-gadget .goog-te-combo {
            color: black !important;
            font-size: 14px !important;
            padding: 4px;
            border-radius: 4px;
        }
      `}} />

      <main className={`flex min-h-screen w-full max-w-7xl items-start justify-center gap-8 py-12 px-4 sm:px-8 ${contentBgClass} transition-none`}>
        <div className="w-full max-w-4xl mr-80"> 
          <div className={`flex justify-between items-center mb-8 p-6 rounded-2xl ${headerContainerClass}`}>
            <h1 className={`text-3xl font-extrabold ${headerClass}`}>
              Menu Items
            </h1>
            
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleContrast}
                    aria-pressed={isHighContrast}
                    className={`px-4 py-2 rounded-lg transition-colors ${contrastBtnClass}`}
                >
                    {isHighContrast ? 'Disable Contrast' : 'High Contrast'}
                </button>
                <div id="google_translate_element" ref={translateElementRef} className="translate-button"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {menuItems.map((item) => (
              <MenuItemButton
                key={item.item_id}
                item={item}
                onClick={() => handleItemClick(item)} 
                onNutritionClick={() => handleOpenNutrition(item)}
                isHighContrast={isHighContrast}
              />
            ))}
          </div>

          {menuItems.length === 0 && (
            <p className={`text-center py-10 font-medium ${noItemsClass}`}>
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
        isHighContrast={isHighContrast}
      />

      <NutritionModal
        isOpen={isNutritionOpen}
        onClose={handleCloseNutrition}
        item={nutritionItem}
        isHighContrast={isHighContrast}
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
          isHighContrast={isHighContrast}
        />
      )}
    </div>
  );
}