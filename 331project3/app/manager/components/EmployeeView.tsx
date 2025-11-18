"use client";

import React, { useState, useEffect } from 'react';

import { Employee } from '../../types/manager';

export default function EmployeeView() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchEmployees = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/manager/employees');
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const data: Employee[] = await response.json();
			const sortedData = data.sort((a, b) => a.employee_id - b.employee_id);
			setEmployees(sortedData);
		} catch (error) {
			console.error("Failed to fetch employees", error);
			setError((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchEmployees();
	}, [])

	const renderContent = () => {
        if (isLoading) {
            return <p>Loading employees...</p>;
        }

        if (error) {
            return (
                <div>
                    <strong>Error:</strong> {error}
                </div>
            );
        }

        if (employees.length === 0) {
            return <p>No employees found.</p>;
        }

        //load table of employees
        return (
			<table>
				<thead className="bg-gray-50">
					<tr>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Employee ID
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							First Name
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Last Name
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Username
						</th>
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Password
						</th>
					</tr>
				</thead>
				<tbody>
					{employees.map((employee) => (
						<tr key={employee.employee_id}>
							<td className="px-4 py-3 text-gray-700">
								{employee.employee_id}
							</td>
							<td className="px-4 py-3 text-gray-900">
								{employee.first_name}
							</td>
							<td className="px-4 py-3 text-gray-700">
								{employee.last_name}
							</td>
							<td className="px-4 py-3 text-gray-700">
								{employee.username}
							</td>
							<td className="px-4 py-3 text-gray-700">
								{employee.password}
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
                <h1 className="text-2xl font-bold">Employees</h1>
                <button
                    onClick={fetchEmployees}
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