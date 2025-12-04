import React, { useEffect, useState } from 'react';
import type { Order } from '../../../types/order';
import type { Product } from '../../../types/product';
import type { Client } from '../../../types/client';
import { getAllOrders, createOrder, updateOrder, deleteOrder } from '../../../services/order.service';
import { getAllProducts } from '../../../services/product.service';
import { getAllClients } from '../../../services/client.service';
import './order.css';


const Ordere = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<Omit<Order, 'id'>>({
    description: '',
    totalAmount: 0,
    status: 'pendente',
    clientId: '',
    productsIds: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status options
  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, productsData, clientsData] = await Promise.all([
        getAllOrders(),
        getAllProducts(),
        getAllClients()
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await deleteOrder(id);
        fetchData(); // Recarregar a lista após exclusão
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
      }
    }
  };

  const handleEditClick = (order: Order) => {
    setCurrentOrder(order);
    setFormData({
      description: order.description,
      totalAmount: order.totalAmount,
      status: order.status,
      clientId: order.clientId,
      productsIds: [...order.productsIds]
    });
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setCurrentOrder(null);
    setFormData({
      description: '',
      totalAmount: 0,
      status: 'pendente',
      clientId: '',
      productsIds: []
    });
    setIsCreateModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'totalAmount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProductToggle = (productId: string) => {
    setFormData(prev => {
      const newProductsIds = prev.productsIds.includes(productId)
        ? prev.productsIds.filter(id => id !== productId)
        : [...prev.productsIds, productId];
      
      // Calcular total automaticamente se produtos mudarem
      const selectedProducts = products.filter(p => newProductsIds.includes(p.id!));
      const newTotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
      
      return {
        ...prev,
        productsIds: newProductsIds,
        totalAmount: newTotal
      };
    });
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || formData.productsIds.length === 0) {
      alert('Por favor, selecione um cliente e pelo menos um produto.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder(formData as Order);
      setIsCreateModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder?.id || !formData.clientId || formData.productsIds.length === 0) {
      alert('Por favor, selecione um cliente e pelo menos um produto.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateOrder(currentOrder.id, { ...formData, id: currentOrder.id } as Order);
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Função para obter nome do cliente pelo ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  };

  // Função para obter nome do produto pelo ID
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  // Função para obter label do status
  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  // Modal de formulário
  const renderModal = (isOpen: boolean, title: string, onSubmit: (e: React.FormEvent) => void) => {
    if (!isOpen) return null;

    // const selectedClient = clients.find(c => c.id === formData.clientId);
    const selectedProducts = products.filter(p => formData.productsIds.includes(p.id!));

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={closeModals} aria-label="Fechar modal">
              ✕
            </button>
          </div>
          <form onSubmit={onSubmit} className="modal-body">
            <div className="form-group">
              <label htmlFor="description">Descrição:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva o pedido..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientId">Cliente:</label>
              <select
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Produtos:</label>
              <div className="products-select">
                {products.map(product => (
                  <div key={product.id} className="product-checkbox">
                    <input
                      type="checkbox"
                      id={`product-${product.id}`}
                      checked={formData.productsIds.includes(product.id!)}
                      onChange={() => handleProductToggle(product.id!)}
                    />
                    <label htmlFor={`product-${product.id}`}>
                      {product.name} - R$ {product.price.toFixed(2)}
                    </label>
                  </div>
                ))}
              </div>
              {selectedProducts.length > 0 && (
                <div className="total-amount">
                  Total: R$ {formData.totalAmount.toFixed(2)}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={closeModals}>
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="order-container">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <div className="order-header">
        <h1>Pedidos Cadastrados</h1>
        <button className="btn-create" onClick={handleCreateClick}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Cadastrar novo pedido
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>Nenhum pedido cadastrado.</p>
          <p className="text-muted">Clique no botão acima para adicionar seu primeiro pedido.</p>
        </div>
      ) : (
        <div className="order-grid">
          {orders.map(order => (
            <div 
              key={order.id} 
              className="order-card"
              data-status={order.status}
            >
              <div className="order-info">
                <p>
                  <strong>Descrição:</strong> {order.description}
                </p>
                <p>
                  <strong>Cliente:</strong> {getClientName(order.clientId)}
                </p>
                <p>
                  <strong>Status:</strong> {getStatusLabel(order.status)}
                  <span className={`status-badge status-${order.status}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </p>
                <p>
                  <strong>Total:</strong> R$ {order.totalAmount.toFixed(2)}
                </p>
                
                {order.productsIds.length > 0 && (
                  <div className="order-products">
                    <h4>Produtos:</h4>
                    <div className="products-list">
                      {order.productsIds.map(productId => (
                        <span key={productId} className="product-tag">
                          {getProductName(productId)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="order-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEditClick(order)}
                  aria-label={`Editar pedido ${order.description}`}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(order.id!)}
                  aria-label={`Excluir pedido ${order.description}`}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {renderModal(isCreateModalOpen, 'Cadastrar Novo Pedido', handleSubmitCreate)}
      {renderModal(isEditModalOpen, 'Editar Pedido', handleSubmitEdit)}
    </div>
  );
};

export default Ordere;