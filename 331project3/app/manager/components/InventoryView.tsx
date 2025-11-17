"use client";

import React, { useState, useEffect } from 'react';

import { InventoryItem, NewInventoryItem } from '../../types/manager';

export default function InventoryView() {
	const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [newItem, setNewItem] = useState<NewInventoryItem>({
		ingredient_name: '',
		unit: '',
		current_quantity: 0,
	});

	const fetchInventoryItems = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/manager/item-inventory');
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const data: InventoryItem[] = await response.json();
			const sortedData = data.sort((a, b) => a.ingredient_id - b.ingredient_id);
			setInventoryItems(sortedData);
		} catch (error) {
			console.error("Failed to fetch menu items", error);
			setError((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchInventoryItems();
	}, [])

	const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewItem((prev) => ({...prev, [name]: value }));
	}
	
	const handleAddItem = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newItem.ingredient_name || !newItem.unit || newItem.current_quantity <= 0) {
			setError('Please fill in all fields with valid values.');
			return;
		}

		try {
			const response = await fetch('/api/manager/item-inventory', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newItem),
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			setNewItem({ ingredient_name: '', unit: '', current_quantity: 0 });
			fetchInventoryItems();
			setError(null);
		} catch (error) {
			setError((error as Error).message);
		}
	}

	const handleUpdateItem = async (item_id: number, field: string, value: string | number) => {
		const originalItem = inventoryItems.find(item => item.ingredient_id === item_id);

		if (!originalItem) return;

		try {
			const response = await fetch(`/api/manager/item-inventory/${item_id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ field, value }),
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			setInventoryItems((prev) =>
				prev.map(item =>
					item.ingredient_id === item_id ? { ...item, [field]: value } : item
				)
			);
		} catch (error) {
			setError((error as Error).message);
		}
	}

	const handleDeletItem = async (item_id: number) => {
		try {
			const response = await fetch(`/api/manager/item-inventory/${item_id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error(`Error failed to delete item: ${response.status}`);
			}

			setInventoryItems((prev) => prev.filter(item => item.ingredient_id !== item_id));
		} catch (error) {
			setError((error as Error).message);
		}
	}

	const renderAddNewItem = () => (
		<form onSubmit={handleAddItem} className="mb-4">
			<h2 className="text-lg font-medium mb-2">Add New Inventory Item</h2>
			<div className="flex space-x-2">
				<input
					type="text"
					name="ingredient_name"
					value={newItem.ingredient_name}
					onChange={handleNewItemChange}
					placeholder="Ingredient Name"
					className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
				/>
				<input
					type="text"
					name="unit"
					value={newItem.unit}
					onChange={handleNewItemChange}
					placeholder="Unit"
					className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
				/>
				<input
					type="number"
					name="current_quantity"
					value={newItem.current_quantity}
					onChange={handleNewItemChange}
					placeholder="Quantity"
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
            return <p>Loading inventory items...</p>;
        }

        if (error) {
            return (
                <div>
                    <strong>Error:</strong> {error}
                </div>
            );
        }

        if (inventoryItems.length === 0) {
            return <p>No inventory items found.</p>;
        }

        //load table of inventory items
        return (
			<table>
				<thead className="bg-gray-50">
					<tr>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Ingredient ID
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Name
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Unit
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Quantity
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{inventoryItems.map((item) => (
						<tr key={item.ingredient_id}>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateItem(item.ingredient_id, 'ingredient_id', e.currentTarget.textContent || '')}
								className="px-4 py-3 text-gray-700">
								{item.ingredient_id}
							</td>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateItem(item.ingredient_id, 'ingredient_name', e.currentTarget.textContent || '')}
								className="px-4 py-3 text-gray-700">
								{item.ingredient_name}
							</td>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateItem(item.ingredient_id, 'unit', e.currentTarget.textContent || '')}
								className="px-4 py-3 text-gray-700">
								{item.unit}
							</td>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateItem(item.ingredient_id, 'current_quantity', Number(e.currentTarget.textContent) || 0)}
								className="px-4 py-3 text-gray-700">
								{item.current_quantity}
							</td>
							<td className="px-4 py-3">
								<button
									onClick={() => handleDeletItem(item.ingredient_id)}
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
                <h1 className="text-2xl font-bold">Item Inventory</h1>
                <button
                    onClick={fetchInventoryItems}
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