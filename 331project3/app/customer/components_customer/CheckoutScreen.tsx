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

    const bgClass = isHighContrast ? "bg-[#333333]" : "bg-gray-100";
    const cardBgClass = isHighContrast ? "bg-[#333333] border border-gray-600 shadow-2xl" : "bg-white shadow-2xl border border-gray-100";
    const textClass = isHighContrast ? "text-white" : "text-gray-800";
    const labelClass = isHighContrast ? "text-gray-300 font-bold" : "text-gray-600 font-semibold";
    const inputClass = isHighContrast 
        ? "bg-[#2a2a2a] text-white border-gray-600 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500" 
        : "bg-gray-50 text-gray-900 border-gray-200 focus:ring-purple-500 focus:border-purple-500";
        const confirmBtnClass = isHighContrast
        ? "bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:-translate-y-0.5 disabled:opacity-50"
        : "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 disabled:opacity-50";
    const cancelBtnClass = isHighContrast
        ? "bg-[#333333] text-white border border-gray-500 hover:bg-gray-700"
        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-purple-600";

	return (
		<div className={`fixed inset-0 flex flex-col items-center justify-center p-4 z-50 ${bgClass} font-sans`}>
			<div className={`w-full max-w-lg p-8 rounded-2xl ${cardBgClass}`}>
                <div className="text-center mb-8">
				    <h2 className={`text-3xl font-extrabold mb-2 ${textClass}`}>Checkout</h2>
                    <p className={isHighContrast ? "text-gray-400" : "text-gray-500"}>Review your order details below</p>
                </div>

				<div className={`flex justify-between items-center text-xl font-bold mb-8 pb-4 border-b-2 border-dashed ${textClass} ${isHighContrast ? 'border-gray-600' : 'border-gray-200'}`}>
					<span>Total Amount</span>
					<span className={isHighContrast ? "text-purple-400" : "text-purple-600"}>${total.toFixed(2)}</span>
				</div>

				<div className="mb-8">
					<label htmlFor="customer-email" className={`block text-sm mb-2 ${labelClass}`}>
						Email Receipt (Optional)
					</label>
					<input 
                        id="customer-email" 
                        type="email" 
                        value={customerEmail} 
                        onChange={(e) => setCustomerEmail(e.target.value)} 
                        placeholder="name@example.com" 
                        className={`w-full p-3.5 rounded-xl border ${inputClass} outline-none transition-all`} 
                        disabled={isProcessing} 
                    />
					<p className={`mt-2 text-xs ${isHighContrast ? 'text-gray-400' : 'text-gray-400'}`}>We&apos;ll let you know when your order is ready.</p>
				</div>
				
				<div className="space-y-3">
					<button onClick={handleConfirm} className={`w-full py-4 text-lg rounded-xl font-bold transition-all ${confirmBtnClass}`} disabled={isProcessing || bag.length === 0}>
						{isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
					</button>
					<button onClick={onCancel} className={`w-full py-3 text-lg rounded-xl font-bold transition-all ${cancelBtnClass}`} disabled={isProcessing}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}