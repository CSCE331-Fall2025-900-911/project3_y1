"use client"

import React, {useState} from "react";

//components imports
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import TrendsView from "./components/TrendsView";
import ReportsView from "./components/ReportsView";
import EmployeeView from "./components/EmployeeView";
import InventoryView from "./components/InventoryView";
import MenuitemsView from "./components/MenuItemsView";

//types imports
import { SelectedView } from "../types";

//main manager homepage component
export default function ManagerHomePage() {
	const [selectedView, setSelectedView] = useState<SelectedView>('dashboard')

	const renderSelectedView = () => {
		switch (selectedView) {
			case 'trends':
				return <TrendsView />;
			case 'reports':
				return <ReportsView />;
			case 'employee':
				return <EmployeeView />;
			case 'inventory':
				return <InventoryView />;
			case 'menuitems':
				return <MenuitemsView />;
			case 'dashboard':
				return <DashboardView />;
			default:
				return <DashboardView />;
		}
	}
	return (
		<main style = {{
			display: 'flex',
			minHeight: '100vh',
			fontFamily: 'Arial, sans-serif'
		}}>

		<Sidebar
			selectedView={selectedView}
			setSelectedView={setSelectedView}
		/>
		<div style={{ flex: 1, padding: '1rem' }}>
			{renderSelectedView()}
		</div>
		</main>
	)
};
