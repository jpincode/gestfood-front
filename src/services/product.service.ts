// product.service.ts - Versão definitiva

import { api } from "./api";
import type { Product } from "../types/product";
import axios from 'axios';

// Criar uma instância do axios específica para multipart
const multipartApi = axios.create({
  baseURL: api.defaults.baseURL, // mesma base URL da api original
});

// Remover TODOS os headers padrão que podem interferir
delete multipartApi.defaults.headers.common['Content-Type'];
delete multipartApi.defaults.headers.common['Accept'];

// Função para criar produto com imagens (multipart)
export async function createProduct(data: Omit<Product, 'id'>, images: File[]): Promise<string> {
  const formData = new FormData();
  
  // Converter o produto para JSON e adicionar como string
  const productData = {
    name: data.name,
    price: data.price,
    description: data.description,
    imagesNames: [] // O backend deve preencher isso
  };
  
  // IMPORTANTE: Usar Blob com type 'application/json'
  const productBlob = new Blob([JSON.stringify(productData)], {
    type: 'application/json'
  });
  
  formData.append('product', productBlob, 'product.json');
  
  // Adicionar cada imagem
  images.forEach((image, index) => {
    formData.append('files', image);
  });
  
  try {
    const response = await multipartApi.post("/products", formData, {
      headers: {
        // Deixar o browser definir automaticamente
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Erro detalhado:', error.response?.data || error.message);
    throw error;
  }
}

// Função para atualizar produto com imagens (multipart)
export async function updateProduct(id: string, data: Omit<Product, 'id'>, images: File[]): Promise<string> {
  const formData = new FormData();
  
  // Converter o produto para JSON e adicionar como string
  const productData = {
    name: data.name,
    price: data.price,
    description: data.description,
    imagesNames: data.imagesNames // Manter imagens existentes
  };
  
  // IMPORTANTE: Usar Blob com type 'application/json'
  const productBlob = new Blob([JSON.stringify(productData)], {
    type: 'application/json'
  });
  
  formData.append('product', productBlob, 'product.json');
  
  // Adicionar novas imagens
  images.forEach((image) => {
    formData.append('files', image);
  });
  
  try {
    const response = await multipartApi.put(`/products/${id}`, formData, {
      headers: {
        // Deixar o browser definir automaticamente
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Erro detalhado:', error.response?.data || error.message);
    throw error;
  }
}

// As outras funções permanecem iguais usando a api original
export async function getAllProducts(): Promise<Product[]> {
  const response = await api.get("/products");
  return response.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}