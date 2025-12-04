"use client";

import React, { useState, useEffect } from 'react';

import { InventoryItem, NewInventoryItem } from '../../types/manager';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function InventoryView() {
	const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [newItem, setNewItem] = useState<NewInventoryItem>({
		ingredient_name: '',
		unit: '',
		current_quantity: 0,
	});
	const [isAdding, setIsAdding] = useState(false);

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
		setIsAdding(true);
		e.preventDefault();
		if (!newItem.ingredient_name || !newItem.unit || newItem.current_quantity <= 0) {
			setError('Please fill in all fields with valid values.');
			setIsAdding(false);
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
		} finally {
			setIsAdding(false);
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
		<Card className="p-6 mb-6 border-t-4 border-blue-600">
			<h2 className="text-lg font-medium mb-2">Add New Inventory Item</h2>
			<form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<Input
					type="text"
					name="ingredient_name"
					value={newItem.ingredient_name}
					onChange={handleNewItemChange}
					placeholder="Ingredient Name"
					className="md:col-span-2"
				/>
				<Input
					type="text"
					name="unit"
					value={newItem.unit}
					onChange={handleNewItemChange}
					placeholder="Unit"
					className="md:col-span-2"
				/>
				<Input
					type="number"
					name="current_quantity"
					value={newItem.current_quantity}
					onChange={handleNewItemChange}
					placeholder="Quantity"
					className="md:col-span-2"
				/>
				<Button type="submit" isLoading={isAdding} className="md:col-span-1">
					Add Item
				</Button>
			</form>
		</Card>
	);


	const renderContent = () => {
        if (isLoading) {
            return <p>Loading inventory items...</p>;
        }

        if (inventoryItems.length === 0) {
            return <p>No inventory items found.</p>;
        }

        //load table of inventory items
        return (
			<Card className="overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-blue-50">
							<tr>
								{['Ingredient ID', 'Name', 'Unit', 'Quantity', 'Actions'].map((header) => (
									<th
										key={header}
										scope="col"
										className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white">
							{inventoryItems.map((item, index) => (
								<tr key={item.ingredient_id} className={`border-b border-gray-200 last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-100 transition-colors`}>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateItem(item.ingredient_id, 'ingredient_id', e.currentTarget.textContent || '')}
										className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
									>
										{item.ingredient_id}
									</td>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateItem(item.ingredient_id, 'ingredient_name', e.currentTarget.textContent || '')}
										className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
									>
										{item.ingredient_name}
									</td>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateItem(item.ingredient_id, 'unit', e.currentTarget.textContent || '')}
										className="px-4 py-3 text-gray-700">
										<span className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full"
									>
                                            {item.unit}
                                        </span>
									</td>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateItem(item.ingredient_id, 'current_quantity', Number(e.currentTarget.textContent) || 0)}
										className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700"
									>
										{item.current_quantity}
									</td>
									<td className="px-4 py-3">
										<Button
											onClick={() => handleDeletItem(item.ingredient_id)}
											variant="danger"
										>
											Delete
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Item Inventory</h1>
                <Button
					onClick={fetchInventoryItems}
					disabled={isLoading}
					isLoading={isLoading}
					variant="secondary"
				>
					Refresh
				</Button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6">
                    <strong>Error:</strong> {error}
                </div>
            )}
			{renderAddNewItem()}
            {renderContent()}
        </div>
    );
}