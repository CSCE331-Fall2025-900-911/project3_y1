"use client"

import React, {useState} from "react";

type ApiResponse = {
	message: string;
	databaseTime?: string;
	error?: string;
} | null;

function DashboardView() {
	const [apiResponse, setApiResponse] = useState<ApiResponse>(null);
	const [isLoading, setIsLoading] = useState(false);

	const testDbConnection = async () => {
		setApiResponse(null);
		setIsLoading(true);

		try {
			const response = await fetch('/api/db-test')
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || `Error: ${response.status}`)
			}

			setApiResponse(data);
		} catch (error) {
			console.error("Failed to fetch from api", error)
			setApiResponse({
				message: 'Failed to connect to API',
				error: (error as Error).message
			})
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Main Dashboard. DB Connection Testing</p>

			<button
				onClick={testDbConnection}
				disabled={isLoading}
				style = {{
					padding: '.5rem 1rem',
					fontSize: '1rem',
					cursor: isLoading ? 'not-allowed' : 'pointer',
					backgroundColor: isLoading ? '#ccc' : '#0070f3',
					color: '#fff',
					border: 'none',
					borderRadius: '5px'
				}}
			>
				{isLoading ? 'Loading...' : 'Test DB Connection! :D'}
			</button>

			{apiResponse && (
				<pre style = {{
					backgroundColor: '#f6f8fa',
					border: '1px solid #eee',
					borderRadius: '5px',
					padding: '1rem',
					overflowX: 'auto'
				}}>
				<strong>API Response:</strong>
				{JSON.stringify(apiResponse,null,2)}
				</pre>
			)}
		</div>
	)
}

function TrendsView() {
	return <div>Trends View</div>;
}

function ReportsView() {
	return <div>Reports View</div>;
}

function EmployeeView() {
	return <div>Employee View</div>;
}

function InventoryView() {
	return <div>Inventory View</div>;
}

function MenuitemsView() {
	return <div>Menuitems View</div>;
}

type SelectedView = 'trends' | 'reports' | 'employee' | 'inventory' | 'menuitems' | 'dashboard';

type SidebarProps = {
	selectedView: SelectedView;
	setSelectedView: (view: SelectedView) => void;
};

const SidebarComponent: React.FC<SidebarProps> = ({ 
	selectedView, 
	setSelectedView 
}) => (
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

		<SidebarComponent
			selectedView={selectedView}
			setSelectedView={setSelectedView}
		/>
		<div style={{ flex: 1, padding: '1rem' }}>
			{renderSelectedView()}
		</div>
		</main>
	)
};
