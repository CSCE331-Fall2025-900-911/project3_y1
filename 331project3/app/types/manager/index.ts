export type ApiResponse = {
    message: string;
    databaseTime?: string;
    error?: string;
} | null;

export type SelectedView = 'trends' | 'reports' | 'employee' | 'inventory' | 'menuitems' | 'dashboard';

export type MenuItem = {
    item_id: number;
    item_name: string;
    item_category: string;
    item_price: number;
};

export type NewMenuItem = {
    item_name: string;
    item_category: string;
    item_price: number;
};

export type Employee = {
    employee_id: number;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
}

export type NewEmployee = {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
};

export type InventoryItem = {
    ingredient_id: number;
    ingredient_name: string;
    unit: string;
    current_quantity: number;
}

export type NewInventoryItem = {
    ingredient_name: string;
    unit: string;
    current_quantity: number;
}

// Trends types

export type SalesData = {
    sale_date: string; // YYYY-MM-DD
    total_sales: number;
};

export type UsageData = {
    ingredient_name: string;
    total_used_quantity: number;
};