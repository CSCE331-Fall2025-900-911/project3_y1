"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SalesData, UsageData } from '../../types/manager';

const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
};

type ReportType = 'sales' | 'usage';

export default function TrendsView() {
    const [reportType, setReportType] = useState<ReportType>('sales');
    const [data, setData] = useState<(SalesData | UsageData)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Set default dates
    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());

    const fetchReportData = async () => {
        setIsLoading(true);
        setError(null);
        setData([]);

        try {
            const params = new URLSearchParams({ start: startDate, end: endDate });
            const url = `/api/manager/reports/${reportType}?${params.toString()}`;

            const response = await fetch(url);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || `Error ${response.status}`);
            }

            const rawData = await response.json();

            // Convert numeric strings to numbers for charting
            const processedData = rawData.map((item: any) => ({
                ...item,
                total_revenue: parseFloat(item.total_revenue),
                total_quantity: parseInt(item.total_quantity, 10),
                total_used_quantity: parseFloat(item.total_used_quantity),
            }));

            setData(processedData);

        } catch (err) {
            setError((err as Error).message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getChartKeys = () => {
        if (reportType === 'sales') {
            return {
                nameKey: 'item_name',
                barKey: 'total_revenue',
                barName: 'Total Revenue ($)',
                fill: '#8884d8'
            };
        } else {
            return {
                nameKey: 'ingredient_name',
                barKey: 'total_used_quantity',
                barName: 'Total Used (units)',
                fill: '#82ca9d'
            };
        }
    };

    const { nameKey, barKey, barName, fill } = getChartKeys();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Trends & Reports</h1>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-end p-4 bg-gray-50 rounded-lg border mb-6">
                {/* Report Type Toggle */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <div className="flex rounded-md shadow-sm">
                        <button
                            onClick={() => setReportType('sales')}
                            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                                reportType === 'sales' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Sales Report
                        </button>
                        <button
                            onClick={() => setReportType('usage')}
                            className={`px-4 py-2 text-sm font-medium rounded-r-md border-l border-gray-200 ${
                                reportType === 'usage' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Usage Report
                        </button>
                    </div>
                </div>
                
                {/* Date Selection */}
                <div className="flex flex-col">
                    <label htmlFor="start-date" className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 border rounded-md"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="end-date" className="text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 border rounded-md"
                    />
                </div>
                
                {/* Generation Button */}
                <button
                    onClick={fetchReportData}
                    disabled={isLoading}
                    className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isLoading ? 'Loading...' : 'Generate Report'}
                </button>
            </div>

            {/* Chart */}
            <div className="w-full h-[500px] bg-white p-4 rounded-lg border shadow-sm">
                {isLoading && <p className="text-gray-500">Loading chart...</p>}
                
                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {!isLoading && !error && data.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                            No data for this period.
                        </p>
                    </div>
                )}
                
                {!isLoading && !error && data.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey={nameKey}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={60}
                                fontSize={12}
                            />
                            <YAxis />
                            <Tooltip formatter={(value) => 
                                typeof value === 'number' ? value.toFixed(2) : value 
                            }/>
                            <Legend />
                            <Bar dataKey={barKey} name={barName} fill={fill} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}