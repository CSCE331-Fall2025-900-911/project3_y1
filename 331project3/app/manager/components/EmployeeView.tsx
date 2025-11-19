"use client";

import React, { useState, useEffect } from 'react';

import { Employee, NewEmployee } from '../../types/manager';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function EmployeeView() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [newEmployee, setNewEmployee] = useState<NewEmployee>({
		first_name: '',
		last_name: '',
		username: '',
		password: '',
	});
	const [isAdding, setIsAdding] = useState(false);

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

	const handleNewEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			setNewEmployee((prev) => ({...prev, [name]: value }));
		}

	const handleAddEmployee = async (e: React.FormEvent) => {
			setIsAdding(true);
			e.preventDefault();
			if (!newEmployee.first_name || !newEmployee.last_name || !newEmployee.username || !newEmployee.password) {
				setError('Please fill in all fields with valid values.');
				setIsAdding(false);
				return;
			}

			try {
				const response = await fetch('/api/manager/employees', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newEmployee),
				});

				if (!response.ok) {
					throw new Error(`Error: ${response.status}`);
				}

				setNewEmployee({ first_name: '', last_name: '', username: '', password: '' });
				fetchEmployees();
				setError(null);
			} catch (error) {
				setError((error as Error).message);
			} finally {
				setIsAdding(false);
			}
		}

		const handleUpdateEmployee = async (employee_id: number, field: string, value: string | number) => {
			const originalEmployee = employees.find(employee => employee.employee_id === employee_id);

			if (!originalEmployee) return;

			try {
				const response = await fetch(`/api/manager/employees/${employee_id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ field, value }),
				});
	
				if (!response.ok) {
					throw new Error(`Error: ${response.status}`);
				}

				setEmployees((prev) =>
					prev.map(employee =>
						employee.employee_id === employee_id ? { ...employee, [field]: value } : employee
					)
				);
			} catch (error) {
				setError((error as Error).message);
			}
		}

		const handleDeleteEmployee = async (employee_id: number) => {
			try {
				const response = await fetch(`/api/manager/employees/${employee_id}`, {
					method: 'DELETE',
				});
	
				if (!response.ok) {
					throw new Error(`Error failed to delete employee: ${response.status}`);
				}

				setEmployees((prev) => prev.filter(employee => employee.employee_id !== employee_id));
			} catch (error) {
				setError((error as Error).message);
			}
		}

		const renderAddNewEmployee = () => (
			<Card className="p-6 mb-6 border-t-4 border-blue-600">
				<h2 className="text-lg font-medium mb-2">Add New Employee</h2>
				<form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-5 gap-4">
					<Input
						type="text"
						name="first_name"
						value={newEmployee.first_name}
						onChange={handleNewEmployeeChange}
						placeholder="First Name"
						className="md:col-span-2"
					/>
					<Input
						type="text"
						name="last_name"
						value={newEmployee.last_name}
						onChange={handleNewEmployeeChange}
						placeholder="Last Name"
						className="md:col-span-2"
					/>
					<Input
						type="text"
						name="username"
						value={newEmployee.username}
						onChange={handleNewEmployeeChange}
						placeholder="Username"
						className="md:col-span-2"
					/>
					<Input
						type="text"
						name="password"
						value={newEmployee.password}
						onChange={handleNewEmployeeChange}
						placeholder="Password"
						className="md:col-span-2"
					/>
					<Button type="submit" isLoading={isAdding} className="md:col-span-2">
						Add Employee
					</Button>
				</form>
			</Card>
		);
	

	const renderContent = () => {
        if (isLoading) {
            return <p>Loading employees...</p>;
        }

        if (employees.length === 0) {
            return <p>No employees found.</p>;
        }

        //load table of employees
        return (
			<Card className="overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-blue-50">
							<tr>
								{['Employee ID', 'First Name', 'Last Name', 'Username', 'Password', 'Actions'].map((header) => (
									<th
										key={header}
										scope="col"
										className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white">
							{employees.map((employee, index) => (
								<tr key={employee.employee_id} className={`border-b border-gray-200 last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-100 transition-colors`}>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateEmployee(employee.employee_id, 'employee_id', e.currentTarget.textContent || '')}
										className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
									>
										{employee.employee_id}
									</td>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateEmployee(employee.employee_id, 'first_name', e.currentTarget.textContent || '')}
										className="px-4 py-3 text-gray-900"
									>
										{employee.first_name}
									</td>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateEmployee(employee.employee_id, 'last_name', e.currentTarget.textContent || '')}
										className="px-4 py-3 text-gray-900"
									>
										{employee.last_name}
									</td>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateEmployee(employee.employee_id, 'username', e.currentTarget.textContent || '')}
										className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-700"
									>
										{employee.username}
									</td>
									<td 
										contentEditable
										suppressContentEditableWarning={true}
										onBlur={(e) => handleUpdateEmployee(employee.employee_id, 'password', e.currentTarget.textContent || '')}
										className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700"
									>
										{employee.password}
									</td>
									<td className="px-4 py-3">
										<Button
											onClick={() => handleDeleteEmployee(employee.employee_id)}
											variant="danger"
										>
											Delete
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
                <Button
					onClick={fetchEmployees}
					disabled={isLoading}
					isLoading={isLoading}
					variant="secondary"
				>
					Refresh
				</Button>
            </div>

			{error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6">
                    <strong>Error:</strong> {error}
                </div>
            )}
			
			{renderAddNewEmployee()}
            {renderContent()}
        </div>
    );
}