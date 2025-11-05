export type ApiResponse = {
    message: string;
    databaseTime?: string;
    error?: string;
} | null;

export type SelectedView = 'trends' | 'reports' | 'employee' | 'inventory' | 'menuitems' | 'dashboard';