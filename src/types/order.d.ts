export interface Order {
  id?: string;
  description: string;
  totalAmount: number;
  status: string;
  clientId: string;
  productsIds: string[];
}
