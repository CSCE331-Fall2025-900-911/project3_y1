// Represents one menu item in the database
export interface MenuItem {
    item_id: number;
    item_name: string;
    item_category: string;
    item_price: number;
}

// Represents one item in a cashier’s order
export interface OrderItem {
    item_id: number;
    order_item_id?: number;
    order_id: number;
    size_id?: string;
    price_at_sale: number;
}

