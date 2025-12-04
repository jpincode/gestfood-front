// Cart.tsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/order.service';
import { formatMoney } from '../utils/format';
import '../styles/cart.css';
import { Link } from 'react-router-dom';
import Image from '../components/image/Image';

interface CartProps {
  clientId: string;
};

// Componente para gerar QR Code do Pix
const PixQRCode = ({ value }: { value: number }) => {
  const [isPaid, setIsPaid] = useState(false);
  
  // Gerar QR Code fictício usando uma API pública
  const pixValue = value.toFixed(2);
  const pixKey = "123.456.789-09"; // CPF fictício
  const merchantName = "Restaurante GestFood";
  
  // Dados para o QR Code (em formato de string para PIX)
  const pixData = `00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-4266141740005204000053039865406${pixValue}5802BR5925${merchantName}6009SAO PAULO62170515RP123456789-096304`;

  const handleSimulatePayment = () => {
    setIsPaid(true);
    // Aqui você implementaria a lógica real de verificação de pagamento
    setTimeout(() => {
      alert("Pagamento confirmado! Seu pedido está sendo preparado.");
    }, 1000);
  };

  return (
    <div className="pix-payment-container">
      <div className="pix-instructions">
        <h3>Pagamento via PIX</h3>
        <div className="instruction-steps">
          <p>1. Abra o aplicativo do seu banco</p>
          <p>2. Escaneie o QR Code abaixo</p>
          <p>3. Confirme o pagamento de <strong>{formatMoney(value)}</strong></p>
        </div>
      </div>
      
      <div className="qrcode-container">
        <div className="qrcode-placeholder">
          {/* QR Code fictício - em produção, use uma biblioteca ou API real */}
          <div className="qrcode-grid">
            <div className="qrcode-content">
              <div className="qrcode-amount">
                <span className="currency">R$</span>
                <span className="value">{value.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="qrcode-merchant">{merchantName}</div>
              <div className="qrcode-key">Chave: {pixKey}</div>
              <div className="qrcode-data" style={{ display: 'none' }}>{pixData}</div>
            </div>
          </div>
          <div className="qrcode-label">Escaneie com seu banco</div>
        </div>
        
        <div className="pix-info">
          <div className="pix-info-item">
            <span className="label">Beneficiário:</span>
            <span className="value">{merchantName}</span>
          </div>
          <div className="pix-info-item">
            <span className="label">Valor:</span>
            <span className="value">{formatMoney(value)}</span>
          </div>
          <div className="pix-info-item">
            <span className="label">Chave PIX:</span>
            <span className="value">{pixKey}</span>
          </div>
          <div className="pix-info-item">
            <span className="label">Código:</span>
            <span className="value copy-code" onClick={() => {
              navigator.clipboard.writeText(pixData);
              alert('Código copiado! Cole no seu banco.');
            }}>
              000201...6304 <span className="copy-icon">📋</span>
            </span>
          </div>
        </div>
      </div>
      
      {!isPaid ? (
        <button 
          className="simulate-payment-btn"
          onClick={handleSimulatePayment}
        >
          Simular Pagamento Concluído
        </button>
      ) : (
        <div className="payment-success">
          <div className="success-icon">✅</div>
          <p className="success-message">Pagamento confirmado!</p>
          <p className="success-detail">Aguarde a preparação do seu pedido.</p>
        </div>
      )}
    </div>
  );
};

// Componente para pagamento com cartão
const CardPayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [installments, setInstallments] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulação de processamento
    setTimeout(() => {
      setIsProcessing(false);
      alert('Pagamento processado! Aguarde a confirmação do funcionário.');
    }, 2000);
  };

  return (
    <div className="card-payment-container">
      <div className="payment-waiting">
        <div className="waiting-icon">👨‍🍳</div>
        <h3>Aguarde um funcionário</h3>
        <p className="waiting-message">
          Para pagamentos com cartão, um funcionário virá até sua mesa 
          para processar o pagamento.
        </p>
        <p className="waiting-instruction">
          Por favor, tenha seu cartão e documento em mãos.
        </p>
      </div>

      <div className="card-form-section">
        <h4>Ou preencha os dados do cartão:</h4>
        <form onSubmit={handleCardSubmit} className="card-form">
          <div className="form-group">
            <label htmlFor="cardNumber">Número do Cartão</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="0000 0000 0000 0000"
              maxLength={16}
              disabled={isProcessing}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cardName">Nome no Cartão</label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Como está escrito no cartão"
              disabled={isProcessing}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Validade</label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    const formatted = value.length > 2 ? 
                      `${value.slice(0, 2)}/${value.slice(2)}` : value;
                    setExpiryDate(formatted);
                  }
                }}
                placeholder="MM/AA"
                maxLength={5}
                disabled={isProcessing}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="password"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                maxLength={3}
                disabled={isProcessing}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="installments">Parcelamento</label>
            <select
              id="installments"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              disabled={isProcessing}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num.toString()}>
                  {num}x {num === 1 ? '(à vista)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            type="submit" 
            className="submit-card-btn"
            disabled={isProcessing || !cardNumber || !cardName || !expiryDate || !cvv}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Processando...
              </>
            ) : (
              'Enviar Dados do Cartão'
            )}
          </button>
        </form>
      </div>
      
      <div className="security-notice">
        <div className="security-icon">🔒</div>
        <p>Seus dados são criptografados e protegidos</p>
      </div>
    </div>
  );
};

const Cart = ({ clientId }: CartProps) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalAmount
  } = useCart();
  
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    if (window.confirm('Tem certeza que deseja remover este item do carrinho?')) {
      removeFromCart(productId);
    }
  };

  const handleProceedToPayment = async () => {
    if (getTotalItems() === 0) {
      setOrderStatus({
        type: 'error',
        message: 'Seu carrinho está vazio!'
      });
      return;
    }

    setIsSubmitting(true);
    setOrderStatus({
      type: 'info',
      message: 'Criando seu pedido...'
    });

    try {
      const productsIds = cart.map(item => item.productId);

      const orderData = {
        description: description.trim() || '',
        totalAmount: getTotalAmount(),
        clientId: clientId,
        status: 'PENDING',
        productsIds: productsIds
      };

      const createdOrderId = await createOrder(orderData);
      setOrderId(createdOrderId);
      
      setShowPayment(true);
      setOrderStatus(null);
      
    } catch (error: any) {
      let errorMessage = 'Erro ao criar pedido. Tente novamente.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos enviados ao servidor.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro interno no servidor.';
      }
      
      setOrderStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o carrinho?')) {
      clearCart();
      setOrderStatus({
        type: 'info',
        message: 'Carrinho limpo com sucesso!'
      });
      setShowPayment(false);
      setPaymentMethod(null);
    }
  };

  const handleBackToCart = () => {
    setShowPayment(false);
    setPaymentMethod(null);
  };

  const handlePaymentComplete = () => {
    clearCart();
    setDescription('');
    setShowPayment(false);
    setPaymentMethod(null);
    setOrderId(null);
    
    setOrderStatus({
      type: 'success',
      message: 'Pedido finalizado com sucesso! Acompanhe seu pedido na seção "Meus Pedidos".'
    });
  };

  if (getTotalItems() === 0 && !showPayment) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2 className="empty-title">Seu carrinho está vazio</h2>
        <p className="empty-message">
          Adicione produtos deliciosos ao seu carrinho para continuar!
        </p>
        <Link to={'/cardapio'} className="empty-button">
          Ver Cardápio
        </Link>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-header">
            <button 
              className="back-button"
              onClick={handleBackToCart}
            >
              ← Voltar para o carrinho
            </button>
            <h1 className="payment-title">Finalizar Pagamento</h1>
            <div className="payment-order-info">
              <p>Pedido: <strong>#{orderId?.slice(-8)}</strong></p>
              <p>Valor: <strong>{formatMoney(getTotalAmount())}</strong></p>
            </div>
          </div>

          {!paymentMethod ? (
            <div className="payment-method-selector">
              <h2 className="method-title">Escolha a forma de pagamento</h2>
              
              <div className="method-options">
                <div 
                  className="method-option pix-option"
                  onClick={() => setPaymentMethod('pix')}
                >
                  <div className="method-icon">🏷️</div>
                  <div className="method-content">
                    <h3>PIX</h3>
                    <p>Pagamento instantâneo via QR Code</p>
                    <ul className="method-benefits">
                      <li>✓ Pagamento instantâneo</li>
                      <li>✓ Sem taxas</li>
                      <li>✓ Disponível 24h</li>
                    </ul>
                  </div>
                  <div className="method-arrow">→</div>
                </div>

                <div 
                  className="method-option card-option"
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="method-icon">💳</div>
                  <div className="method-content">
                    <h3>Cartão de Crédito/Débito</h3>
                    <p>Pagamento na mesa com funcionário</p>
                    <ul className="method-benefits">
                      <li>✓ Até 6x sem juros</li>
                      <li>✓ Débito disponível</li>
                      <li>✓ Pagamento seguro</li>
                    </ul>
                  </div>
                  <div className="method-arrow">→</div>
                </div>
              </div>
            </div>
          ) : paymentMethod === 'pix' ? (
            <PixQRCode value={getTotalAmount()} />
          ) : (
            <CardPayment />
          )}

          <div className="payment-actions">
            {paymentMethod && (
              <button
                className="action-btn secondary"
                onClick={() => setPaymentMethod(null)}
              >
                Voltar para opções
              </button>
            )}
            
            {paymentMethod === 'pix' && (
              <button
                className="action-btn primary"
                onClick={handlePaymentComplete}
              >
                Concluir Pedido
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">🛒 Meu Carrinho</h1>
          <div className="cart-stats">
            <span className="stats-item">
              <strong>{getTotalItems()}</strong> itens
            </span>
            <span className="stats-item">
              Total: <strong>{formatMoney(getTotalAmount())}</strong>
            </span>
          </div>
        </div>

        {orderStatus && (
          <div className={`order-status ${orderStatus.type}`}>
            <p>{orderStatus.message}</p>
            {orderStatus.type === 'error' && (
              <button 
                className="retry-button"
                onClick={() => setOrderStatus(null)}
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}

        <div className="cart-items-section">
          <h2 className="section-title">Itens no Carrinho</h2>
          
          <div className="cart-items-list">
            {cart.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="item-image-container">
                  {item.product?.imagesNames?.[0] ? (
                    <Image 
                      fileName={item.product.imagesNames[0]} 
                      alt={item.product.name}
                      className="item-image"
                    />
                  ) : (
                    <div className="item-image-placeholder">
                      🍽️
                    </div>
                  )}
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.product?.name || `Produto ${item.productId}`}</h3>
                  <p className="item-price-unit">
                    {formatMoney(item.product?.price || 0)} cada
                  </p>
                  <p className="item-quantity-info">
                    Quantidade: <strong>{item.quantity}</strong>
                  </p>
                  <p className="item-id">
                    ID: <code>{item.productId}</code>
                  </p>
                </div>
                
                <div className="item-quantity-controls">
                  <button
                    className="quantity-control-btn minus"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Diminuir quantidade"
                  >
                    -
                  </button>
                  
                  <div className="quantity-display">
                    <span className="quantity-number">{item.quantity}</span>
                    <span className="quantity-label">un.</span>
                  </div>
                  
                  <button
                    className="quantity-control-btn plus"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  <div className="item-total-label">Subtotal</div>
                  <div className="item-total-value">
                    {formatMoney((item.product?.price || 0) * item.quantity)}
                  </div>
                </div>
                
                <button
                  className="item-remove-btn"
                  onClick={() => handleRemoveItem(item.productId)}
                  aria-label="Remover item"
                  title="Remover item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="order-description-section">
          <h2 className="section-title">Observações do Pedido</h2>
          <div className="description-container">
            <textarea
              className="description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione observações sobre seu pedido (opcional)"
              rows={4}
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="description-counter">
              {description.length}/500 caracteres
            </div>
            <p className="description-hint">
              Ex: "Sem cebola", "Bem passado", "Para viagem", etc.
            </p>
          </div>
        </div>

        <div className="cart-summary-section">
          <div className="summary-details">
            <div className="summary-row">
              <span>Total de itens:</span>
              <span>{getTotalItems()}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatMoney(getTotalAmount())}</span>
            </div>
            <div className="summary-row total">
              <span>Valor Total:</span>
              <span className="total-amount">{formatMoney(getTotalAmount())}</span>
            </div>
          </div>
          
          <div className="cart-actions">
            <button
              className="action-btn secondary"
              onClick={handleClearCart}
              disabled={isSubmitting || getTotalItems() === 0}
            >
              Limpar Carrinho
            </button>
            
            <button
              className="action-btn primary"
              onClick={handleProceedToPayment}
              disabled={isSubmitting || getTotalItems() === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Processando...
                </>
              ) : (
                'Prosseguir para Pagamento'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;