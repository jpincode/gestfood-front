import { api } from "./api";
import type { Employee } from "../types/employee";

export async function getAllEmployees(): Promise<Employee[]> {
  const response = await api.get("/employees");
  return response.data;
}

export async function getEmployeeById(id: string): Promise<Employee> {
  const response = await api.get(`/employees/${id}`);
  return response.data;
}

export async function createEmployee(data: Employee): Promise<string> {
  const response = await api.post("/employees", data);
  return response.data;
}

export async function updateEmployee(id: string, data: Employee): Promise<string> {
  const response = await api.put(`/employees/${id}`, data);
  return response.data;
}

export async function deleteEmployee(id: string): Promise<void> {
  await api.delete(`/employees/${id}`);
}
