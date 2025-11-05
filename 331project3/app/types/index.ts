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