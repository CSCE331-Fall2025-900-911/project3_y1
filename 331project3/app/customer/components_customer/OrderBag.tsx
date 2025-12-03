'use client';

import React from 'react';

export interface BagItem {
	uniqueId: string;
	itemId: number;
	name: string;
	basePrice: number;
	finalPrice: number;
	quantity: number;
	customizations: {
		size: string;
		iceLevel: string;
		sugarLevel: string;
		toppings: string[];
	};
}

interface OrderBagProps {
	bag: BagItem[];
	onQuantityChange: (uniqueId: string, delta: number) => void;
	onDelete: (uniqueId: string) => void;
	onEdit: (uniqueId: string) => void;
	onCheckout: () => void;
  editingItemId: string | null;
}

export default function OrderBag({ bag, onQuantityChange, onDelete, onEdit, onCheckout, editingItemId }: OrderBagProps) {
	const total = bag.reduce((sum, item) => sum + (item.finalPrice * item.quantity || 0), 0);

	return (
		<div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto">
			<h2 className="text-2xl font-bold mb-4 text-black">Your Bag</h2>

			{bag.length === 0 ? (
				<p className="text-black">Your bag is empty.</p>
			) : (
				<>
					<ul className="space-y-4 mb-4">
						{bag.map((item) => (
							<li key={item.uniqueId} className="border-b pb-4">
								<div className="flex justify-between items-start mb-1">
									<span className="font-semibold text-black">{item.name}</span>
									<span className="font-semibold text-black">${(item.finalPrice * item.quantity).toFixed(2)}</span>
								</div>

								<div className="text-sm text-black mb-2">
									<p>{item.customizations.size}</p>
									<p>{item.customizations.iceLevel}</p>
									<p>{item.customizations.sugarLevel}</p>
									{item.customizations.toppings.length > 0 && (
										<p>Toppings: {item.customizations.toppings.join(', ')}</p>
									)}
								</div>

								<div className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2 border rounded-full text-black">
										<button
											onClick={() => onQuantityChange(item.uniqueId, -1)}
											className="w-8 h-8 rounded-full text-lg font-bold disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100"
											disabled={item.quantity <= 1}
											title="Decrease quantity"
										>
											−
										</button>
										<span className="w-4 text-center font-semibold">{item.quantity}</span>
										<button
											onClick={() => onQuantityChange(item.uniqueId, 1)}
											className="w-8 h-8 rounded-full text-lg font-bold hover:bg-gray-100"
											title="Increase quantity"
										>
											+
										</button>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => onEdit(item.uniqueId)}
											className="text-blue-600 p-1 hover:bg-blue-50 rounded"
											title="Edit customizations"
										>
											Edit
										</button>
										<button
											onClick={() => onDelete(item.uniqueId)}
											className="text-red-600 p-1 hover:bg-red-50 rounded"
											title="Delete item permanently"
										>
											Delete
										</button>
									</div>
								</div>
							</li>
						))}
					</ul>

					<div className="border-t pt-4">
						<div className="flex justify-between text-xl font-bold mb-4 text-black">
							<span>Total:</span>
							<span>${total.toFixed(2)}</span>
						</div>

						<button
							onClick={onCheckout}
							className="w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 font-semibold"
						>
							Checkout
						</button>
					</div>
				</>
			)}
		</div>
	);
}