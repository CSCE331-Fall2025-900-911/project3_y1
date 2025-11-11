"use client";

import React, { useState, useEffect } from 'react';

import { MenuItem } from '../types';

export default function MenuitemsView() {
	const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchMenuItems = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/menu-items');
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
					</tr>
				</thead>
				<tbody>
					{menuItems.map((item) => (
						<tr key={item.item_id}>
							<td className="px-4 py-3 text-gray-700">
								{item.item_id}
							</td>
							<td className="px-4 py-3 text-gray-900">
								{item.item_name}
							</td>
							<td className="px-4 py-3 text-gray-700">
								{item.item_category}
							</td>
							<td className="px-4 py-3 text-gray-700">
								${item.item_price}
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
            {renderContent()}
        </div>
    );
}