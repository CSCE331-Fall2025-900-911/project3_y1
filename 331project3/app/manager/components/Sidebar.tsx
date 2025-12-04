import React from 'react';
import { SelectedView } from '../../types/manager';
import Image from 'next/image';

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
        
        const base = 'flex items-center space-x-2 w-full p-3 text-left rounded-lg text-sm font-medium transition-colors';

        //define active and inactive styles
        const active = 'bg-blue-600 text-white';
        const inactive = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';

        return `${base} ${isActive ? active : inactive}`;
    };

    return (
        <nav className="flex flex-col w-64 h-screen p-4 bg-white border-r border-gray-200"> 
            <div className="mb-6">
                <Image 
                    src="/images/sharetea.webp" 
                    alt="ShareTea logo" 
                    className="w-60 h-15"
                    width={96}
                    height={96}
                />
                <h2 className="text-xl font-bold text-gray-900">POS Manager</h2>
            </div>
            <div className="flex flex-col space-y-2">
                <button
                    onClick={() => setSelectedView('dashboard')}
                    className={styleButton('dashboard')}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setSelectedView('employee')}
                    className={styleButton('employee')}
                >
                    Employees
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
            </div>
        </nav>
    );
}