import { api } from "./api";
import type { Client } from "../types/client";

export async function getAllClients(): Promise<Client[]> {
  const response = await api.get("/clients");
  return response.data;
}

export async function getClientById(id: string): Promise<Client> {
  const response = await api.get(`/clients/${id}`);
  return response.data;
}

export async function createClient(data: Client): Promise<string> {
  const response = await api.post("/clients", data);
  return response.data;
}

export async function updateClient(id: string, data: Client): Promise<string> {
  const response = await api.put(`/clients/${id}`, data);
  return response.data;
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}
