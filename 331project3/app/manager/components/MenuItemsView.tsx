"use client";

import React, { useState, useEffect } from 'react';

import { MenuItem, NewMenuItem } from '../../types/manager';

export default function MenuitemsView() {
	const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [newItem, setNewItem] = useState<NewMenuItem>({
		item_name: '',
		item_category: '',
		item_price: 0,
	});

	const fetchMenuItems = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/manager/menu-items');
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const data: MenuItem[] = await response.json();
			const sortedData = data.sort((a, b) => a.item_id - b.item_id);
			setMenuItems(sortedData);
		} catch (error) {
			console.error("Failed to fetch menu items", error);
			setError((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchMenuItems();
	}, [])

	const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewItem((prev) => ({...prev, [name]: value }));
	}

	const handleAddItem = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newItem.item_name || !newItem.item_category || newItem.item_price <= 0) {
			setError('Please fill in all fields with valid values.');
			return;
		}

		try {
			const response = await fetch('/api/manager/menu-items', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newItem),
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			setNewItem({ item_name: '', item_category: '', item_price: 0 });
			fetchMenuItems();
			setError(null);
		} catch (error) {
			setError((error as Error).message);
		}
	}

	const handleUpdateItem = async (item_id: number, field: string, value: string | number) => {
		const originalItem = menuItems.find(item => item.item_id === item_id);

		if (!originalItem) return;

		try {
			const response = await fetch(`/api/manager/menu-items/${item_id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ field, value }),
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			setMenuItems((prev) =>
				prev.map(item =>
					item.item_id === item_id ? { ...item, [field]: value } : item
				)
			);
		} catch (error) {
			setError((error as Error).message);
		}
	}

	const handleDeletItem = async (item_id: number) => {
		try {
			const response = await fetch(`/api/manager/menu-items/${item_id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error(`Error failed to delete item: ${response.status}`);
			}

			setMenuItems((prev) => prev.filter(item => item.item_id !== item_id));
		} catch (error) {
			setError((error as Error).message);
		}
	}

	const renderAddNewItem = () => (
		<form onSubmit={handleAddItem} className="mb-4">
			<h2 className="text-lg font-medium mb-2">Add New Menu Item</h2>
			<div className="flex space-x-2">
				<input
					type="text"
					name="item_name"
					value={newItem.item_name}
					onChange={handleNewItemChange}
					placeholder="Item Name"
					className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
				/>
				<input
					type="text"
					name="item_category"
					value={newItem.item_category}
					onChange={handleNewItemChange}
					placeholder="Category"
					className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
				/>
				<input
					type="number"
					name="item_price"
					value={newItem.item_price}
					onChange={handleNewItemChange}
					placeholder="Price"
					className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
				/>
				<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
					Add Item
				</button>
			</div>
		</form>
	);

	const renderContent = () => {
        if (isLoading) {
            return <p>Loading menu items...</p>;
        }

        if (error) {
            return (
                <div>
                    <strong>Error:</strong> {error}
                </div>
            );
        }

        if (menuItems.length === 0) {
            return <p>No menu items found.</p>;
        }

        //load table of menu items
        return (
			<table>
				<thead className="bg-gray-50">
					<tr>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Item ID
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Name
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Category
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Price
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{menuItems.map((item) => (
						<tr key={item.item_id}>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateItem(item.item_id, 'item_id', e.currentTarget.textContent || '')}
								className="px-4 py-3 text-gray-700"
							>
								{item.item_id}
							</td>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateItem(item.item_id, 'item_name', e.currentTarget.textContent || '')}
								className="px-4 py-3 text-gray-900"
							>
								{item.item_name}
							</td>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateItem(item.item_id, 'item_category', e.currentTarget.textContent || '')}
								className="px-4 py-3 text-gray-700"
							>
								{item.item_category}
							</td>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateItem(item.item_id, 'item_price', e.currentTarget.textContent.replace(/[$,]/g, '') || '')}
								className="px-4 py-3 text-gray-700"
							>
								${item.item_price} 
							</td>
							<td>
								<button
									onClick={() => handleDeletItem(item.item_id)}
									className="bg-red-600 text-white px-3 py-1 rounded-md"
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Menu Items</h1>
                <button
                    onClick={fetchMenuItems}
                    disabled={isLoading}
					className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium"
                >
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
			{renderAddNewItem()}
            {renderContent()}
        </div>
    );
}