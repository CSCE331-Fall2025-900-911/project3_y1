"use client";

import React, {useState} from "react";
import {BagItem} from "./OrderBag";

interface CheckoutScreenProps {
	bag: BagItem[];
	total: number;
	onFinalizeOrder: (customerEmail: string | null) => void;
	onCancel: () => void;
}

export default function CheckoutScreen({bag, total, onFinalizeOrder, onCancel}: CheckoutScreenProps) {
	const [customerEmail, setCustomerEmail] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	const handleConfirm = () => {
		setIsProcessing(true);
		const emailToSend = customerEmail.trim() || null;
		onFinalizeOrder(emailToSend);
	};

	return (
		<div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-8 z-50">
			<h2 className="text-4xl font-bold mb-8 text-black">Final Checkout</h2>

			<div className="w-full max-w-xl bg-gray-50 p-6 rounded-xl shadow-lg">
				<h3 className="text-2xl font-semibold mb-4 text-black">Order Summary</h3>
				<div className="flex justify-between text-xl font-bold mb-4 border-t pt-2 text-black">
					<span>Grand Total:</span>
					<span>${total.toFixed(2)}</span>
				</div>

				<div className="mb-6">
					<label htmlFor="customer-email" className="block text-lg font-medium text-gray-700 mb-2">
						Email for Ready Notification (Optional)
					</label>
					<input id="customer-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="e.g., waiting@example.com" className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-blue-500 focus:border-blue-500" disabled={isProcessing} />
					<p className="mt-1 text-sm text-gray-500">We will email you when your order is ready for pickup.</p>
				</div>
				<h3 className="text-xl font-semibold mb-3 text-black">Payment Method (Demo)</h3>
				<div className="space-y-3">
					<button onClick={handleConfirm} className="w-full bg-green-600 text-white py-4 text-lg rounded-xl shadow-md hover:bg-green-700 disabled:bg-green-400" disabled={isProcessing || bag.length === 0}>
						{isProcessing ? "Processing..." : "Confirm Payment (Confirm Order)"}
					</button>
					<button onClick={onCancel} className="w-full bg-gray-300 text-gray-800 py-3 text-lg rounded-xl hover:bg-gray-400 disabled:opacity-50" disabled={isProcessing}>
						Go Back to Menu
					</button>
				</div>
			</div>
		</div>
	);
}
