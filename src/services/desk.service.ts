import { api } from "./api";
import type { Desk } from "../types/desk";

export async function getAllDesks(): Promise<Desk[]> {
  const response = await api.get("/desks");
  return response.data;
}

export async function getDeskById(id: string): Promise<Desk> {
  const response = await api.get(`/desks/${id}`);
  return response.data;
}

export async function createDesk(data: Desk): Promise<string> {
  const response = await api.post("/desks", data);
  return response.data;
}

export async function updateDesk(id: string, data: Desk): Promise<string> {
  const response = await api.put(`/desks/${id}`, data);
  return response.data;
}

export async function deleteDesk(id: string): Promise<void> {
  await api.delete(`/desks/${id}`);
}
