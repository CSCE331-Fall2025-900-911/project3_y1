import React from 'react';
import { SelectedView } from '../types';

type SidebarProps = {
    selectedView: SelectedView;
    setSelectedView: (view: SelectedView) => void;
};

export default function Sidebar({ 
    selectedView, 
    setSelectedView 
}: SidebarProps) {
    
    return (
        <nav style={{
            display: 'flex',
            flexDirection: 'column',
            width: '200px',
            borderRight: '1px solid #ccc',
            padding: '1rem'
        }}>
            <button
                onClick={() => setSelectedView('dashboard')}
                style={{ fontWeight: selectedView === 'dashboard' ? 'bold' : 'normal' }}
            >
                Dashboard
            </button>
            <button
                onClick={() => setSelectedView('trends')}
                style={{ fontWeight: selectedView === 'trends' ? 'bold' : 'normal' }}
            >
                Trends
            </button>
            <button
                onClick={() => setSelectedView('reports')}
                style={{ fontWeight: selectedView === 'reports' ? 'bold' : 'normal' }}
            >
                Reports
            </button>
            <button
                onClick={() => setSelectedView('employee')}
                style={{ fontWeight: selectedView === 'employee' ? 'bold' : 'normal' }}
            >
                Employee
            </button>
            <button
                onClick={() => setSelectedView('inventory')}
                style={{ fontWeight: selectedView === 'inventory' ? 'bold' : 'normal' }}
            >
                Inventory
            </button>
            <button
                onClick={() => setSelectedView('menuitems')}
                style={{ fontWeight: selectedView === 'menuitems' ? 'bold' : 'normal' }}
            >
                Menu Items
            </button>
        </nav>
    );
}