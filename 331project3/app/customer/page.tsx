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
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const accessibilityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (accessibilityRef.current && !accessibilityRef.current.contains(event.target as Node)) {
            setIsAccessibilityOpen(false);
        }
    };

    if (isAccessibilityOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccessibilityOpen]);

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
    setIsAccessibilityOpen(false);
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
      setIsAccessibilityOpen(false);
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

  const getDefaultToppingsList = (name: string): string[] => {
    const defaults: string[] = [];
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('pearl') || lowerName.includes('boba')) defaults.push('boba');
    if (lowerName.includes('pudding')) defaults.push('pudding');
    if (lowerName.includes('cheese')) defaults.push('cheese foam');
    if (lowerName.includes('grass jelly')) defaults.push('grass jelly');
    
    return defaults;
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

    const defaults = getDefaultToppingsList(selectedItem.item_name || '');
    const toppingCounts: Record<string, number> = {};
    
    customizations.toppings.forEach(t => {
      toppingCounts[t] = (toppingCounts[t] || 0) + 1;
    });

    let toppingsCost = 0;
    Object.entries(toppingCounts).forEach(([name, count]) => {
      let chargeableCount = count;
      if (defaults.includes(name)) {
        chargeableCount = Math.max(0, count - 1);
      }
      toppingsCost += chargeableCount * 0.50;
    });

    finalPrice += toppingsCost;

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

  const noItemsClass = isHighContrast ? "text-gray-300" : "text-gray-500";
  
  const accButtonClass = isHighContrast
    ? "bg-purple-600 text-white border-purple-400 hover:bg-purple-700"
    : "bg-white text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200";

  const accDropdownClass = isHighContrast 
      ? "bg-[#333333] border-gray-600 shadow-xl" 
      : "bg-white border-gray-100 shadow-xl";

  return (
    <div className={`flex min-h-screen items-center justify-center font-sans ${mainBgClass}`}>
      <style dangerouslySetInnerHTML={{__html: `
        .goog-te-gadget {
            color: transparent !important;
            font-size: 0px !important;
        }
        .goog-te-gadget span {
            display: none !important;
        }
        
        .goog-te-gadget .goog-te-combo {
            padding: 8px 12px !important; 
            border-radius: 0.5rem !important; /* rounded-lg */
            font-weight: 700 !important; /* font-bold */
            font-size: 0.875rem !important; /* text-sm */
            cursor: pointer !important;
            outline: none !important;
            font-family: inherit !important;
            margin: 0 !important;
            transition: all 0.2s ease-in-out !important;
            width: 100% !important; /* Full width for dropdown */
        }

        /* Dynamic Colors based on isHighContrast */
        .goog-te-gadget .goog-te-combo {
            background-color: ${isHighContrast ? '#4b5563' : 'white'} !important;
            color: ${isHighContrast ? 'white' : '#4b5563'} !important;
            border: ${isHighContrast ? '1px solid #6b7280' : '1px solid #e5e7eb'} !important;
        }

        /* Hover States */
        .goog-te-gadget .goog-te-combo:hover {
            background-color: ${isHighContrast ? '#374151' : '#faf5ff'} !important;
            color: ${isHighContrast ? 'white' : '#9333ea'} !important;
            border-color: ${isHighContrast ? '#9333ea' : '#e9d5ff'} !important;
        }
      `}} />

      <main className={`flex min-h-screen w-full max-w-7xl items-start justify-center gap-8 py-12 px-4 sm:px-8 ${contentBgClass} transition-none`}>
        <div className="w-full max-w-4xl mr-80"> 
          <div className={`flex justify-between items-center mb-8 p-6 rounded-2xl ${headerContainerClass}`}>
            <h1 className={`text-3xl font-extrabold ${headerClass}`}>
              Menu Items
            </h1>
            
            {/* Accessibility Button & Menu */}
            <div className="relative z-30" ref={accessibilityRef}>
                <button
                    onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                    className={`px-4 py-2 rounded-lg transition-colors font-bold border-2 flex items-center gap-2 ${accButtonClass}`}
                    aria-expanded={isAccessibilityOpen}
                    aria-label="Accessibility Options"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 7.5a1.5 1.5 0 0 1 1.5-1.5h.09c.86.06 1.66.4 2.24 1.03l3.66 3.66a1 1 0 0 1-1.42 1.42l-2.57-2.57V21a1 1 0 0 1-2 0v-4h-3v4a1 1 0 0 1-2 0v-9.46l-2.57 2.57a1 1 0 0 1-1.42-1.42l3.66-3.66A3.01 3.01 0 0 1 12 9.5Z" />
                    </svg>
                    <span>Accessibility</span>
                </button>

                {/* Dropdown Container */}
                <div className={`absolute right-0 top-full mt-3 w-64 p-4 rounded-xl border flex flex-col gap-4 transition-all ${accDropdownClass} ${isAccessibilityOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    
                    {/* Contrast Option */}
                    <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isHighContrast ? 'text-gray-400' : 'text-gray-500'}`}>Display</p>
                        <button
                            onClick={toggleContrast}
                            className={`w-full py-2 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-between ${
                                isHighContrast 
                                ? "bg-purple-600 text-white shadow-lg" 
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                           <span>High Contrast</span>
                           <div className={`w-8 h-4 rounded-full relative transition-colors ${isHighContrast ? 'bg-white/30' : 'bg-gray-300'}`}>
                                <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${isHighContrast ? 'translate-x-4' : ''}`}></div>
                           </div>
                        </button>
                    </div>

                    <div className={isHighContrast ? "border-t border-gray-600" : "border-t border-gray-100"}></div>

                    {/* Language Option */}
                    <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isHighContrast ? 'text-gray-400' : 'text-gray-500'}`}>Language</p>
                        <div className="w-full">
                            <div id="google_translate_element" ref={translateElementRef} className="w-full"></div>
                        </div>
                    </div>
                </div>
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

      {isCheckingOut && (
        <CheckoutScreen
          bag={bag}
          total={totalAmount}
          onFinalizeOrder={handleFinalizeOrder}
          onCancel={() => setIsCheckingOut(false)}
          isHighContrast={isHighContrast}
        />
      )}

    </div>
  );
}