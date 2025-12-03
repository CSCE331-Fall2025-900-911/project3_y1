"use client";

import React, { useState, useEffect } from "react";
import { ApiResponse, Order, OrderStatus } from "@/app/types/manager"; // Import the Order type

//display orders
type OrderItemProps = {
    order: Order;
    onOrderReady: (id: number) => void;
};

const OrderItem: React.FC<OrderItemProps> = ({ order, onOrderReady }) => {
    return (
        <div className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-50">
            <div>
                <p className="font-semibold text-lg">Order #{order.order_id}</p>
                {/* customer email display*/}
                <p className="text-sm text-gray-800 font-mono">
                    Phone: {order.customer_email || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                    Total: <span className="font-mono">${order.total_amount.toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-400">
                    Placed at: {new Date(new Date(order.order_timestamp).getTime() + 18 * 60 * 60 * 1000).toLocaleTimeString()}
                </p>
            </div>
            <div className="text-right">
                <p className={`text-sm font-medium mb-2 ${order.order_status === 'READY' ? 'text-green-600' : 'text-yellow-600'}`}>
                    Status: {order.order_status}
                </p>
                {order.order_status === 'PLACED' && (
                    <button
                        onClick={() => onOrderReady(order.order_id)}
                        className="rounded-md bg-green-600 px-3 py-1 text-white text-xs font-medium shadow hover:bg-green-700 transition"
                    >
                        Mark Ready & Notify
                    </button>
                )}
            </div>
        </div>
    );
};
// ----------------------------------------------------

export default function DashboardView() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecentOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            //fetch orders placed from last 24hrs
            const response = await fetch('/api/manager/orders'); 
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `Error: ${response.status}`);
            }
            const data: Order[] = await response.json();
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    //mark order as ready
    const handleOrderReady = async (orderId: number) => {
        //optimistic update :D
        setOrders(prev => prev.map(o => 
            o.order_id === orderId ? { ...o, order_status: 'READY' as OrderStatus } : o
        ));

        try {
            const response = await fetch(`/api/manager/orders/${orderId}`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update order ${orderId} and send SMS.`);
            }

            //refetch orders to get rid of newly marked as ready one
            await fetchRecentOrders();

        } catch (err) {
            console.error("Order Ready API Failed:", err);
            //revert optimistic update and show user error
            setOrders(prev => prev.map(o => 
                o.order_id === orderId ? { ...o, order_status: 'PLACED' as OrderStatus } : o
            ));
            setError(`Error updating order: ${(err as Error).message}`);
        }
    };

    // fetch orders immediately on load
    useEffect(() => {
        fetchRecentOrders();
    }, []);


    return (
        <>
            <style>
            {`
              @keyframes fade-in-up {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @keyframes text-gradient {
                to {
                  background-position: 200% center;
                }
              }

              .animate-fade-in-up {
                animation: fade-in-up 1s ease-out forwards;
              }

              .bg-gradient-size-200 {
                background-size: 200% 200%;
              }

              .animate-text-gradient {
                animation: text-gradient 3s linear infinite;
              }
            `}
            </style>
            
            <div className="p-4">
                <div className="animate-fade-in-up text-center mb-8" style={{ animationFillMode: 'forwards', opacity: 0 }}>
                    <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text
                                 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 to-red-500
                                 animate-text-gradient bg-gradient-size-200
                                 pb-2">
                        Welcome to the Sharetea Manager Dashboard :D
                    </h1>
                </div>

                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-semibold">Orders Pending Completion (Last 24h)</h2>
                     <button
                        onClick={fetchRecentOrders}
                        disabled={isLoading}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Loading...' : 'Check New Orders'}
                    </button>
                </div>
                
                {error && <p className="text-red-500 mb-4 p-2 bg-red-100 border border-red-400 rounded">Error: {error}</p>}

                {isLoading && <p>Loading orders...</p>}

                {!isLoading && orders.length === 0 && <p className="text-gray-500 p-4 border rounded-lg">No pending orders!</p>}

                {!isLoading && orders.length > 0 && (
                    <div className="border rounded-lg shadow-md divide-y divide-gray-200 bg-white">
                        {orders.map(order => (
                            <OrderItem 
                                key={order.order_id} 
                                order={order} 
                                onOrderReady={handleOrderReady} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}