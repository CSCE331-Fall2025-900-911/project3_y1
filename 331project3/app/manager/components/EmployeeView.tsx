"use client";

import React, { useState, useEffect } from 'react';

import { Employee, NewEmployee } from '../../types/manager';

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
			e.preventDefault();
			if (!newEmployee.first_name || !newEmployee.last_name || !newEmployee.username || !newEmployee.password) {
				setError('Please fill in all fields with valid values.');
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
			<form onSubmit={handleAddEmployee} className="mb-4">
				<h2 className="text-lg font-medium mb-2">Add New Employee</h2>
				<div className="flex space-x-2">
					<input
						type="text"
						name="first_name"
						value={newEmployee.first_name}
						onChange={handleNewEmployeeChange}
						placeholder="First Name"
						className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
					/>
					<input
						type="text"
						name="last_name"
						value={newEmployee.last_name}
						onChange={handleNewEmployeeChange}
						placeholder="Last Name"
						className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
					/>
					<input
						type="text"
						name="username"
						value={newEmployee.username}
						onChange={handleNewEmployeeChange}
						placeholder="Username"
						className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
					/>
					<input
						type="text"
						name="password"
						value={newEmployee.password}
						onChange={handleNewEmployeeChange}
						placeholder="Password"
						className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
					/>
					<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
						Add Employee
					</button>
				</div>
			</form>
		);
	

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
						<th className="px-4 py-3 text-left font-medium text-gray-900">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{employees.map((employee) => (
						<tr key={employee.employee_id}>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateEmployee(employee.employee_id, 'employee_id', e.currentTarget.textContent || '')}
								className="px-4 py-3 text-gray-700"
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
								className="px-4 py-3 text-gray-700"
							>
								{employee.last_name}
							</td>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateEmployee(employee.employee_id, 'username', e.currentTarget.textContent || '')}
								className="px-4 py-3 text-gray-700"
							>
								{employee.username}
							</td>
							<td 
								contentEditable
								suppressContentEditableWarning={true}
								onBlur={(e) => handleUpdateEmployee(employee.employee_id, 'password', e.currentTarget.textContent || '')}
								className="px-4 py-3 text-gray-700"
							>
								{employee.password}
							</td>
							<td>
								<button
									onClick={() => handleDeleteEmployee(employee.employee_id)}
									className="bg-red-600 text-white px-4 py-2 rounded-md"
								>
									Delete
								</button>
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
			{renderAddNewEmployee()}
            {renderContent()}
        </div>
    );
}