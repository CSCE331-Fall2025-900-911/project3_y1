"use client";

import React, { useState, useEffect } from 'react';

import { InventoryItem } from '../../types/manager';

export default function InventoryView() {
	const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
					</tr>
				</thead>
				<tbody>
					{inventoryItems.map((item) => (
						<tr key={item.ingredient_id}>
							<td className="px-4 py-3 text-gray-700">
								{item.ingredient_id}
							</td>
							<td className="px-4 py-3 text-gray-900">
								{item.ingredient_name}
							</td>
							<td className="px-4 py-3 text-gray-700">
								{item.unit}
							</td>
							<td className="px-4 py-3 text-gray-700">
								{item.current_quantity}
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
            {renderContent()}
        </div>
    );
}