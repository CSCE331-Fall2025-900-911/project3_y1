"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SalesData, UsageData } from '../../types/manager';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const getTodayString = () => {
    const date = new Date(2025, 8, 29);
    return date.toISOString().split('T')[0];
};

type ReportType = 'sales' | 'usage';

export default function TrendsView() {
    const [reportType, setReportType] = useState<ReportType>('sales');
    const [data, setData] = useState<(SalesData | UsageData)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    //set start to -7 days from start
    const startDateDate = new Date(getTodayString());
    startDateDate.setDate(startDateDate.getDate() - 7);
    const [startDate, setStartDate] = useState(startDateDate.toISOString().split('T')[0]);

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
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const processedData = rawData.map((item: any) => ({
            /* eslint-enable @typescript-eslint/no-explicit-any */
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
                fill: '#3b82f6'
            };
        } else {
            return {
                nameKey: 'ingredient_name',
                barKey: 'total_used_quantity',
                barName: 'Total Used (units)',
                fill: '#22c55e'
            };
        }
    };

    const { nameKey, barKey, barName, fill } = getChartKeys();

    const themeColor = reportType === 'sales' ? 'blue' : 'green';

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Trends</h1>

            {/* Controls */}
            <Card className={`p-6 mb-6 border-t-4 ${themeColor === 'blue' ? 'border-blue-600' : 'border-green-600'}`}>
            <div className="flex flex-wrap gap-4 items-end">
                {/* Report Type Toggle */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <div className="flex rounded-md shadow-sm">
                        <button
                            onClick={() => setReportType('sales')}
                            className={`px-4 py-2 text-sm font-medium rounded-l-md transition-colors ${
                                reportType === 'sales' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                        >
                            Sales Report
                        </button>
                        <button
                            onClick={() => setReportType('usage')}
                            className={`px-4 py-2 text-sm font-medium rounded-r-md transition-colors ${
                                reportType === 'usage' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-y border-r border-gray-300'
                            }`}
                        >
                            Usage Report
                        </button>
                    </div>
                </div>
                
                {/* Date Selection */}
                <Input
                    label="Start Date"
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2"
                />
                <Input
                    label="End Date"
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2"
                />
                
                {/* Generation Button */}
                <Button
                    onClick={fetchReportData}
                    disabled={isLoading}
                    className={`${themeColor === 'blue' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}`}
                >
                    {isLoading ? 'Loading...' : 'Generate Report'}
                </Button>
            </div>
            </Card>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Chart */}
            <Card className="w-full h-[500px] p-6">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Loading chart...</p>
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
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis 
                                dataKey={nameKey}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={60}
                                fontSize={12}
                                stroke="#374151"
                            />
                            <YAxis stroke="#374151" />
                            <Tooltip 
                                formatter={(value) => 
                                    typeof value === 'number' ? value.toFixed(2) : value 
                                }
                                contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e5e7eb', 
                                    borderRadius: '0.5rem' 
                                }}
                            />
                            <Legend />
                            <Bar dataKey={barKey} name={barName} fill={fill} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Card>
        </div>
    );
}