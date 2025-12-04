"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { XReportData, ZReportData } from '../../types/manager';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

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
    const [isClearing, setIsClearing] = useState(false);

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

    const handleClearZHistory = async () => {
        if (!window.confirm("Are you sure you want to clear ALL Z-Report history? This is for testing only.")) {
            return;
        }

        setIsClearing(true);
        setError(null);
        try {
            const response = await fetch('/api/manager/reports/z-report', {
                method: 'DELETE',
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to clear history');
            }
            alert('Z-Report history cleared successfully.');
            setZReportData(null);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsClearing(false);
        }
    };
    
    const renderXReport = () => (

        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Hourly Sales (X-Report)</h2>
            <div className="flex flex-wrap items-end gap-4 mb-4">
                <Input
                    label="Date:"
                    name="x-date"
                    id="x-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2"
                />
                <Button
                    onClick={() => fetchXReport(date)}
                    isLoading={isLoading}
                    variant="primary"
                >
                    Run X-Report
                </Button>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-6">
                    <strong>Error:</strong> {error}
                </div>
            )}
            
            {isLoading && xReportData.length === 0 && (
                 <div className="flex items-center justify-center h-[400px]">
                    <p className="text-gray-500">Loading chart...</p>
                 </div>
            )}
            {!isLoading && xReportData.length === 0 && (
                 <div className="flex items-center justify-center h-[400px]">
                    <p className="text-gray-500">No sales data for this day.</p>
                 </div>
            )}
            
            {xReportData.length > 0 && (
                <div className="w-full h-[400px] mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={xReportData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="hour" label={{ value: 'Hour of the Day', position: 'insideBottom', offset: -5 }} stroke="#374151" />
                            <YAxis label={{ value: 'Total Sales ($)', angle: -90, position: 'insideLeft' }} stroke="#374151" />
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Legend />
                            {/* CHANGED: Added color and radius */}
                            <Bar dataKey="sales_totals" name="Total Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );

    const renderZReport = () => (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">End-of-Day (Z-Report)</h2>
            <div className="flex flex-wrap items-end gap-4 mb-4">
                <Input
                    label="Date:"
                    name="z-date"
                    id="z-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2"
                />
                <Button
                    onClick={generateZReport}
                    isLoading={isLoading}
                    className="bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                >
                    Generate Z-Report
                </Button>

                <Button
                    onClick={handleClearZHistory}
                    isLoading={isClearing}
                    variant="danger"
                    title="FOR TESTING"
                >
                    Clear Z-History
                </Button>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-6">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {zReportData && (
                <div className="mt-6">
                    {zReportData.status === 'SUCCESS' && (
                        <div className="border border-green-300 bg-green-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-4">
                                Report Generated Successfully for {date}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                {/* Totals */}
                                <div className="space-y-2">
                                    <strong className="text-green-700 block">Totals</strong>
                                    <p><strong>Total Sales:</strong> ${zReportData.totalSales?.toFixed(2) ?? '0.00'}</p>
                                    <p><strong>Total Items Sold:</strong> {zReportData.totalItemsSold ?? '0'}</p>
                                </div>
                                {/* Category Sales */}
                                <div className="space-y-2">
                                    <strong className="text-green-700 block">Sales by Category</strong>
                                    {Object.entries(zReportData.salesByCategory ?? {}).length > 0 ?
                                        Object.entries(zReportData.salesByCategory ?? {}).map(([category, total]) => (
                                            <p key={category}>{category}: ${total.toFixed(2)}</p>
                                        )) : <p className="text-gray-500">No category sales.</p>}
                                </div>
                                {/* Ingredient Usage */}
                                <div className="space-y-2">
                                    <strong className="text-green-700 block">Ingredient Usage</strong>
                                    {Object.entries(zReportData.ingredientUsage ?? {}).length > 0 ?
                                        Object.entries(zReportData.ingredientUsage ?? {}).map(([name, total]) => (
                                            <p key={name}>{name}: {total.toFixed(2)} units</p>
                                        )) : <p className="text-gray-500">No ingredients used.</p>}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ALREADY RUN */}
                    {zReportData.status === 'ALREADY_RUN' && (
                        <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-6">
                             <strong className="text-yellow-800">REPORT ALREADY RUN FOR THIS DAY.</strong>
                        </div>
                    )}
                    {/* ERROR */}
                    {zReportData.status === 'ERROR' && (
                        <div className="border border-red-300 bg-red-50 rounded-lg p-6">
                             <strong className="text-red-800">FATAL ERROR: {zReportData.message}</strong>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Daily Reports</h1>
            <div className="flex rounded-md shadow-sm mb-6">
                <button
                    onClick={() => setReportType('x-report')}
                    className={`px-6 py-3 text-sm font-medium rounded-l-md transition-colors ${
                        reportType === 'x-report' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                >
                    X-Report (Hourly Sales)
                </button>
                <button
                    onClick={() => setReportType('z-report')}
                    className={`px-6 py-3 text-sm font-medium rounded-r-md transition-colors ${
                        reportType === 'z-report' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-y border-r border-gray-300'
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