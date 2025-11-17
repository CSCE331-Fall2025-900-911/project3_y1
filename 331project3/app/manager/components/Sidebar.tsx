import React from 'react';
import { SelectedView } from '../../types';

type SidebarProps = {
    selectedView: SelectedView;
    setSelectedView: (view: SelectedView) => void;
};

export default function Sidebar({ 
    selectedView, 
    setSelectedView 
}: SidebarProps) {

    const styleButton = (view: SelectedView) => {
        const isActive = selectedView === view;
        
        const base = 'p-2 text-left rounded border text-sm transition-colors mb-2';

        //define active and inactive styles
        const active = 'bg-blue-600 text-white font-bold border-blue-600';
        const inactive = 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100';

        // Combine and return
        return `${base} ${isActive ? active : inactive}`;
    };

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
                className={styleButton('dashboard')}
            >
                Dashboard
            </button>
            <button
                onClick={() => setSelectedView('trends')}
                className={styleButton('trends')}
            >
                Trends
            </button>
            <button
                onClick={() => setSelectedView('reports')}
                className={styleButton('reports')}
            >
                Reports
            </button>
            <button
                onClick={() => setSelectedView('employee')}
                className={styleButton('employee')}
            >
                Employee
            </button>
            <button
                onClick={() => setSelectedView('inventory')}
                className={styleButton('inventory')}
            >
                Inventory
            </button>
            <button
                onClick={() => setSelectedView('menuitems')}
                className={styleButton('menuitems')}
            >
                Menu Items
            </button>
        </nav>
    );
}