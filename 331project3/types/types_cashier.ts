// Represents one menu item in the database
export interface MenuItemData {
  item_id: number;
  item_name: string;
  item_category?: string;
  item_price: number;
}

// Represents one item in a cashier’s order
export interface OrderItem {
  menuItemId: number; // corresponds to item_id
  sizeId: number;
  sizeName?: string;
  priceAtSale: number;
  quantity: number;
}
