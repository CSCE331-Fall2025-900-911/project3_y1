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
    item_name: string;
    total_quantity: string;
    total_revenue: string;
};

export type UsageData = {
    ingredient_name: string;
    unit: string;
    total_used_quantity: string;
};

// Reports types

export type XReportData = {
    hour: number;
    sales_totals: number;
};

export type ZReportData = {
    status: 'SUCCESS' | 'ALREADY_RUN' | 'ERROR';
    totalSales?: number;
    totalItemsSold?: number;
    salesByCategory?: { [key: string]: number };
    ingredientUsage?: { [key: string]: number };
    message?: string;
    error?: string;
};

// orders

export type OrderStatus = 'PLACED' | 'READY';

export type Order = {
    order_id: number;
    total_amount: number;
    order_timestamp: string;
    customer_email: string;
    order_status: OrderStatus;
};