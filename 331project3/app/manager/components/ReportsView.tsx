"use client";

import React, { useState } from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';
import { XReportData, ZReportData } from '../../types/manager';

const getTodayString = () => {
    const date = new Date(2025, 8, 29);
    return date.toISOString().split('T')[0];
};

type ReportType = 'x-report' | 'z-report';

export default function ReportsView() {
    const [reportType, setReportType] = useState<ReportType>('x-report');
    const [date, setDate] = useState(getTodayString());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // xreport state
    const [xReportData, setXReportData] = useState<XReportData[]>([]);
    
    //zreport state
    const [zReportData, setZReportData] = useState<ZReportData | null>(null);

    const fetchXReport = async (selectedDate: string) => {
        setIsLoading(true);
        setError(null);
        setXReportData([]);
        try {
            const params = new URLSearchParams({ date: selectedDate });
            const response = await fetch(`/api/manager/reports/x-report?${params.toString()}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to fetch X-Report');
            }
            const data: XReportData[] = await response.json();
            setXReportData(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const generateZReport = async () => {
        setIsLoading(true);
        setError(null);
        setZReportData(null);
        try {
            const response = await fetch('/api/manager/reports/z-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: date })
            });
            const data: ZReportData = await response.json();
            setZReportData(data);
            if (data.status === 'ERROR') {
                throw new Error(data.message || 'Failed to generate Z-Report');
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderXReport = () => (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <label htmlFor="x-date" className="font-medium">Date:</label>
                <input
                    id="x-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2 border rounded-md"
                />
                <button
                    onClick={() => fetchXReport(date)}
                    disabled={isLoading}
                    className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isLoading ? 'Loading...' : 'Run X-Report'}
                </button>
            </div>
            
            {error && <p className="text-red-500">Error: {error}</p>}
            
            {xReportData.length > 0 && (
                <div className="w-full h-[400px] mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={xReportData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" label={{ value: 'Hour of the Day', position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: 'Total Sales ($)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="sales_totals" name="Total Sales" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );

    const renderZReport = () => (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <label htmlFor="z-date" className="font-medium">Date:</label>
                <input
                    id="z-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2 border rounded-md"
                />
                <button
                    onClick={generateZReport}
                    disabled={isLoading}
                    className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isLoading ? 'Generating...' : 'Generate Z-Report'}
                </button>
            </div>
            
            {error && <p className="text-red-500">Error: {error}</p>}

            {zReportData && (
                <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Z-Report for {date}</h3>
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                        {zReportData.status === 'SUCCESS' && (
                            <>
                                <strong>--- REPORT GENERATED SUCCESSFULLY ---</strong><br /><br />
                                <strong>Total Sales:</strong> ${zReportData.totalSales?.toFixed(2) ?? '0.00'}<br />
                                <strong>Total Items Sold:</strong> {zReportData.totalItemsSold ?? '0'}<br /><br />
                                
                                <strong>--- Sales by Category ---</strong><br />
                                {Object.entries(zReportData.salesByCategory ?? {}).length > 0 ?
                                    Object.entries(zReportData.salesByCategory ?? {}).map(([category, total]) => (
                                        `${category}: $${total.toFixed(2)}\n`
                                    )) : 'No category sales recorded.\n'}
                                <br />
                                
                                <strong>--- Ingredient Usage Summary ---</strong><br />
                                {Object.entries(zReportData.ingredientUsage ?? {}).length > 0 ?
                                    Object.entries(zReportData.ingredientUsage ?? {}).map(([name, total]) => (
                                        `${name}: ${total.toFixed(2)} units\n`
                                    )) : 'No ingredients used today.\n'}
                                <br />
                                <strong>ACTION:</strong> Report generated and logged.
                            </>
                        )}
                        {zReportData.status === 'ALREADY_RUN' && (
                            <strong>REPORT ALREADY RUN FOR THIS DAY.</strong>
                        )}
                        {zReportData.status === 'ERROR' && (
                            <strong>FATAL ERROR: {zReportData.message}</strong>
                        )}
                    </pre>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Daily Reports</h1>
            
            {/* Report Type Toggle */}
            <div className="flex rounded-md shadow-sm mb-6">
                <button
                    onClick={() => setReportType('x-report')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                        reportType === 'x-report' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    X-Report (Hourly Sales)
                </button>
                <button
                    onClick={() => setReportType('z-report')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md border-l border-gray-200 ${
                        reportType === 'z-report' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Z-Report (End-of-Day)
                </button>
            </div>
            
            {/* Render selected report view */}
            {reportType === 'x-report' ? renderXReport() : renderZReport()}
        </div>
    );
}