import React, { useState, useEffect } from 'react';
import { getAllOrders, getOrderById } from '../services/order.service';
import type { Order } from '../types/order';
import { formatMoney } from '../utils/format';
import '../styles/orders.css';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

  // Status com cores e ícones
  const statusConfig: Record<string, { color: string; icon: string; label: string }> = {
    PENDING: { color: 'warning', icon: '⏳', label: 'Pendente' },
    PROCESSING: { color: 'info', icon: '🔄', label: 'Processando' },
    READY: { color: 'success', icon: '✅', label: 'Pronto' },
    DELIVERED: { color: 'success', icon: '🚚', label: 'Entregue' },
    CANCELLED: { color: 'error', icon: '❌', label: 'Cancelado' },
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pedidos');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedId = searchId.trim();
    if (!trimmedId) {
      setFilteredOrders(orders);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Solução: usar type assertion ou validar antes de chamar
      const order = await getOrderById(trimmedId);
      setFilteredOrders([order]);
      setSelectedOrder(order);
      setViewMode('details');
    } catch (err: any) {
      setError('Pedido não encontrado');
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchId('');
    setFilteredOrders(orders);
    setError(null);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setViewMode('list');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    return statusConfig[status]?.color || 'default';
  };

  const getStatusDisplay = (status: string) => {
    const config = statusConfig[status];
    return config ? `${config.icon} ${config.label}` : status;
  };

  // Adicione uma verificação segura para order.id
  const getOrderShortId = (order: Order) => {
    if (!order.id) return 'N/A';
    return `#${order.id.substring(0, 8)}...`;
  };

  // Verificação segura para data
  const getOrderDate = (order: Order) => {
    // Se não houver data real, retorne a data atual como fallback
    return formatDate(new Date().toISOString());
  };

  if (loading && viewMode === 'list') {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  if (error && viewMode === 'list' && filteredOrders.length === 0) {
    return (
      <div className="orders-error">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Ops! Algo deu errado</h2>
        <p className="error-message">{error}</p>
        <button onClick={loadOrders} className="error-retry-btn">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <div className="header-left">
            <h1 className="orders-title">📋 Meus Pedidos</h1>
            <p className="orders-subtitle">Acompanhe o status dos seus pedidos</p>
          </div>
          
          <div className="header-right">
            <button onClick={loadOrders} className="refresh-btn" title="Atualizar pedidos">
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* Modo lista */}
        {viewMode === 'list' && (
          <>
            {/* Barra de busca */}
            <div className="search-section">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Buscar pedido por ID..."
                    className="search-input"
                  />
                  {searchId && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="search-clear-btn"
                      aria-label="Limpar busca"
                    >
                      ×
                    </button>
                  )}
                </div>
                <button type="submit" className="search-btn">
                  🔍 Buscar
                </button>
              </form>
              
              <div className="search-info">
                <span className="orders-count">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
                </span>
                {searchId && (
                  <button onClick={handleClearSearch} className="clear-search-btn">
                    Ver todos os pedidos
                  </button>
                )}
              </div>
            </div>

            {/* Lista de pedidos */}
            <div className="orders-list">
              {filteredOrders.length === 0 ? (
                <div className="no-orders">
                  <div className="no-orders-icon">📭</div>
                  <h3>Nenhum pedido encontrado</h3>
                  <p>
                    {searchId 
                      ? 'Nenhum pedido corresponde ao ID informado.'
                      : 'Você ainda não realizou nenhum pedido.'
                    }
                  </p>
                  {searchId && (
                    <button onClick={handleClearSearch} className="no-orders-btn">
                      Ver todos os pedidos
                    </button>
                  )}
                </div>
              ) : (
                <div className="orders-grid">
                  {filteredOrders.map((order) => (
                    <div 
                      key={order.id || `order-${Math.random()}`} 
                      className="order-card"
                      onClick={() => handleViewOrder(order)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && handleViewOrder(order)}
                    >
                      <div className="order-card-header">
                        <div className="order-id">{getOrderShortId(order)}</div>
                        <div className={`order-status-badge status-${getStatusColor(order.status)}`}>
                          {getStatusDisplay(order.status)}
                        </div>
                      </div>
                      
                      <div className="order-card-body">
                        <p className="order-description">
                          {order.description.length > 100 
                            ? `${order.description.substring(0, 100)}...` 
                            : order.description
                          }
                        </p>
                        
                        <div className="order-details">
                          <div className="detail-item">
                            <span className="detail-label">Cliente:</span>
                            <span className="detail-value">#{order.clientId}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Itens:</span>
                            <span className="detail-value">{order.productsIds.length}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Total:</span>
                            <span className="detail-value total-amount">{formatMoney(order.totalAmount)}</span>
                          </div>
                        </div>
                        
                        <div className="order-meta">
                          <span className="meta-item">
                            📅 {getOrderDate(order)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="order-card-footer">
                        <button className="view-order-btn">
                          Ver Detalhes →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Modo detalhes */}
        {viewMode === 'details' && selectedOrder && (
          <div className="order-details-view">
            <button onClick={handleBackToList} className="back-btn">
              ← Voltar para lista
            </button>
            
            <div className="details-card">
              <div className="details-header">
                <div>
                  <h2 className="details-title">Detalhes do Pedido</h2>
                  <p className="details-subtitle">
                    ID: <code>{selectedOrder.id || 'N/A'}</code>
                  </p>
                </div>
                <div className={`order-status-large status-${getStatusColor(selectedOrder.status)}`}>
                  {getStatusDisplay(selectedOrder.status)}
                </div>
              </div>
              
              <div className="details-grid">
                <div className="detail-section">
                  <h3 className="section-title">📋 Informações do Pedido</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">ID do Pedido:</span>
                      <span className="info-value">
                        <code>{selectedOrder.id || 'N/A'}</code>
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Cliente:</span>
                      <span className="info-value">#{selectedOrder.clientId}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Data/Hora:</span>
                      <span className="info-value">{getOrderDate(selectedOrder)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Valor Total:</span>
                      <span className="info-value total-large">{formatMoney(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3 className="section-title">📝 Descrição</h3>
                  <div className="description-box">
                    {selectedOrder.description}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3 className="section-title">🛒 Itens do Pedido</h3>
                  <div className="products-section">
                    <div className="products-info">
                      <div className="products-count">
                        {selectedOrder.productsIds.length} {selectedOrder.productsIds.length === 1 ? 'item' : 'itens'} no pedido
                      </div>
                      <div className="products-total">
                        Valor total: <strong>{formatMoney(selectedOrder.totalAmount)}</strong>
                      </div>
                    </div>
                    
                    <div className="products-list">
                      <h4>IDs dos Produtos:</h4>
                      <div className="product-ids">
                        {selectedOrder.productsIds.map((productId, index) => (
                          <div key={`${productId}-${index}`} className="product-id-item">
                            <code>{productId}</code>
                            <span className="product-number">#{index + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="products-summary">
                      <div className="summary-item">
                        <span>Quantidade de itens:</span>
                        <span><strong>{selectedOrder.productsIds.length}</strong></span>
                      </div>
                      <div className="summary-item">
                        <span>Valor por item (médio):</span>
                        <span>{formatMoney(selectedOrder.totalAmount / selectedOrder.productsIds.length)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3 className="section-title">🚚 Status e Acompanhamento</h3>
                  <div className="timeline">
                    {Object.entries(statusConfig).map(([statusKey, status]) => (
                      <div 
                        key={statusKey} 
                        className={`timeline-step ${selectedOrder.status === statusKey ? 'active' : ''}`}
                      >
                        <div className="step-icon">{status.icon}</div>
                        <div className="step-content">
                          <div className="step-title">{status.label}</div>
                          <div className="step-description">
                            {selectedOrder.status === statusKey 
                              ? 'Status atual do pedido'
                              : statusKey === 'PENDING' 
                                ? 'Pedido recebido' 
                                : `Aguardando: ${status.label.toLowerCase()}`
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="details-actions">
                <button onClick={handleBackToList} className="action-btn secondary">
                  Voltar para Lista
                </button>
                <button onClick={() => window.print()} className="action-btn primary">
                  🖨️ Imprimir Pedido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas (apenas no modo lista) */}
        {viewMode === 'list' && filteredOrders.length > 0 && (
          <div className="orders-stats">
            <div className="stats-card">
              <h3 className="stats-title">📊 Estatísticas</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{filteredOrders.length}</div>
                  <div className="stat-label">Total de Pedidos</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {formatMoney(filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0))}
                  </div>
                  <div className="stat-label">Valor Total</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {filteredOrders.filter(o => o.status === 'PENDING').length}
                  </div>
                  <div className="stat-label">Pendentes</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {filteredOrders.filter(o => o.status === 'DELIVERED').length}
                  </div>
                  <div className="stat-label">Entregues</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;