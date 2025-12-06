"use client";

import React, {useState} from "react";
import {BagItem} from "./OrderBag";

interface CheckoutScreenProps {
	bag: BagItem[];
	total: number;
	onFinalizeOrder: (customerEmail: string | null) => void;
	onCancel: () => void;
    isHighContrast?: boolean;
}

export default function CheckoutScreen({bag, total, onFinalizeOrder, onCancel, isHighContrast = false}: CheckoutScreenProps) {
	const [customerEmail, setCustomerEmail] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	const handleConfirm = () => {
		setIsProcessing(true);
		const emailToSend = customerEmail.trim() || null;
		onFinalizeOrder(emailToSend);
	};

    // Styling constants
    const bgClass = isHighContrast ? "bg-black" : "bg-white";
    const cardBgClass = isHighContrast ? "bg-black border-4 border-white" : "bg-gray-50 shadow-lg";
    const textClass = isHighContrast ? "text-white" : "text-black";
    const labelClass = isHighContrast ? "text-white" : "text-gray-700";
    const inputClass = isHighContrast 
        ? "bg-black text-white border-2 border-white focus:ring-white focus:border-white placeholder-gray-400" 
        : "bg-white text-black border-gray-300 focus:ring-blue-500 focus:border-blue-500";
    
    const confirmBtnClass = isHighContrast
        ? "bg-white text-black border-2 border-white hover:bg-gray-200 disabled:opacity-50"
        : "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 shadow-md";
        
    const cancelBtnClass = isHighContrast
        ? "bg-black text-white border-2 border-white hover:bg-white hover:text-black"
        : "bg-gray-300 text-gray-800 hover:bg-gray-400";

	return (
		<div className={`fixed inset-0 flex flex-col items-center justify-center p-8 z-50 ${bgClass}`}>
			<h2 className={`text-4xl font-bold mb-8 ${textClass}`}>Final Checkout</h2>

			<div className={`w-full max-w-xl p-6 rounded-xl ${cardBgClass}`}>
				<h3 className={`text-2xl font-semibold mb-4 ${textClass}`}>Order Summary</h3>
				<div className={`flex justify-between text-xl font-bold mb-4 border-t-2 pt-2 ${textClass} ${isHighContrast ? 'border-white' : 'border-gray-200'}`}>
					<span>Grand Total:</span>
					<span>${total.toFixed(2)}</span>
				</div>

				<div className="mb-6">
					<label htmlFor="customer-email" className={`block text-lg font-medium mb-2 ${labelClass}`}>
						Email for Ready Notification (Optional)
					</label>
					<input 
                        id="customer-email" 
                        type="email" 
                        value={customerEmail} 
                        onChange={(e) => setCustomerEmail(e.target.value)} 
                        placeholder="e.g., waiting@example.com" 
                        className={`w-full p-3 rounded-lg border ${inputClass}`} 
                        disabled={isProcessing} 
                    />
					<p className={`mt-1 text-sm ${isHighContrast ? 'text-gray-300' : 'text-gray-500'}`}>We will email you when your order is ready for pickup.</p>
				</div>
				<h3 className={`text-xl font-semibold mb-3 ${textClass}`}>Payment Method (Demo)</h3>
				<div className="space-y-3">
					<button onClick={handleConfirm} className={`w-full py-4 text-lg rounded-xl font-bold ${confirmBtnClass}`} disabled={isProcessing || bag.length === 0}>
						{isProcessing ? "Processing..." : "Confirm Payment (Confirm Order)"}
					</button>
					<button onClick={onCancel} className={`w-full py-3 text-lg rounded-xl font-bold ${cancelBtnClass}`} disabled={isProcessing}>
						Go Back to Menu
					</button>
				</div>
			</div>
		</div>
	);
}