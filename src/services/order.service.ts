import { api } from "./api";
import type { Order } from "../types/order";

export async function getAllOrders(): Promise<Order[]> {
  const response = await api.get("/orders");
  return response.data;
}

export async function getOrderById(id: string): Promise<Order> {
  // Remove o | undefined do parâmetro
  if (!id) {
    throw new Error('ID is required');
  }
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export async function createOrder(data: Order): Promise<string> {
  const response = await api.post("/orders", data);
  return response.data;
}

export async function updateOrder(id: string, data: Order): Promise<string> {
  const response = await api.put(`/orders/${id}`, data);
  return response.data;
}

export async function deleteOrder(id: string): Promise<void> {
  await api.delete(`/orders/${id}`);
}
