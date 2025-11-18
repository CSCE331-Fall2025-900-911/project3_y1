import { getDbPool } from '@/lib/db';
import { MenuItem } from '@/types/menu';
import MenuItemButton from './components/MenuItemButton';

async function getMenuItems(): Promise<MenuItem[]> {
  const client = await getDbPool().connect();
  try {
    const result = await client.query('SELECT * FROM menuitems ORDER BY item_id');
    return result.rows;
  } finally {
    client.release();
  }
}

export default async function Home() {
  const menuItems = await getMenuItems();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-8 text-black dark:text-zinc-50">
            Menu Items
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {menuItems.map((item) => (
              <MenuItemButton key={item.item_id} item={item} />
            ))}
          </div>
          
          {menuItems.length === 0 && (
            <p className="text-zinc-600 dark:text-zinc-400">
              No menu items found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}