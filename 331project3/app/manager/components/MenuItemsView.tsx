"use client";

import React, { useState, useEffect } from 'react';

import { MenuItem, NewMenuItem } from '../../types/manager';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function MenuitemsView() {
	const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [newItem, setNewItem] = useState<NewMenuItem>({
		item_name: '',
		item_category: '',
		item_price: 0,
	});
	const [isAdding, setIsAdding] = useState(false);

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
		setIsAdding(true);
		e.preventDefault();
		if (!newItem.item_name || !newItem.item_category || newItem.item_price <= 0) {
			setError('Please fill in all fields with valid values.');
			setIsAdding(false);
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
		} finally {
			setIsAdding(false);
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
		<Card className="p-6 mb-6 border-t-4 border-blue-600">
            <h2 className="text-lg font-medium mb-2">Add New Menu Item</h2>
            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input
                    name="item_name"
                    value={newItem.item_name}
                    onChange={handleNewItemChange}
                    placeholder="Item Name"
                    className="md:col-span-2"
                />
                <Input
                    name="item_category"
                    value={newItem.item_category}
                    onChange={handleNewItemChange}
                    placeholder="Category"
                    className="md:col-span-1"
                />
                <Input
                    type="number"
                    name="item_price"
                    value={newItem.item_price}
                    onChange={handleNewItemChange}
                    placeholder="Price"
                    className="md:col-span-1"
                />
                <Button 
                    type="submit"
                    isLoading={isAdding}
                    className="md:col-span-1"
                >
                    Add Item
                </Button>
            </form>
        </Card>
	);

	const renderContent = () => {
        if (isLoading) {
            return <p>Loading menu items...</p>;
        }

        if (menuItems.length === 0) {
            return <p>No menu items found.</p>;
        }

        //load table of menu items
        return (
			<Card className="overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-blue-50">
							<tr>
								{['Item ID', 'Name', 'Category', 'Price', 'Actions'].map((header) => (
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
							{menuItems.map((item, index) => (
								<tr key={item.item_id} className={`border-b border-gray-200 last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-100 transition-colors`}>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateItem(item.item_id, 'item_id', e.currentTarget.textContent || '')}
										className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
									>
										{item.item_id}
									</td>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateItem(item.item_id, 'item_name', e.currentTarget.textContent || '')}
										className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
									>
										{item.item_name}
									</td>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateItem(item.item_id, 'item_category', e.currentTarget.textContent || '')}
										className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
									>
										<span className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                            {item.item_category}
                                        </span>
									</td>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateItem(item.item_id, 'item_price', e.currentTarget.textContent.replace(/[$,]/g, '') || '')}
										className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700"
									>
										${item.item_price}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<Button
											variant="danger"
											onClick={() => handleDeletItem(item.item_id)}
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
                <h1 className="text-3xl font-bold text-gray-900">Menu Items</h1>
                <Button
                    onClick={fetchMenuItems}
                    disabled={isLoading}
                    isLoading={isLoading}
                    variant="secondary"
                >
                    Refresh
                </Button>
            </div>

			{/* Error Display */}
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