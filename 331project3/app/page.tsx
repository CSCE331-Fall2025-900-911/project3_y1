'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cashier')
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error('Error fetching menu items:', err));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>
      <ul>
        {menuItems.map(item => (
          <li key={item.item_id}>
            {item.item_name} — ${parseFloat(item.item_price).toFixed(2)}
          </li>
        ))}
      </ul>
    </main>
  );
}
