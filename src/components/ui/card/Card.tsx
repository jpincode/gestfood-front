import { useState } from "react";
import type { Product } from "../../../types/product";
import { formatMoney } from "../../../utils/format";
import Image from "../../image/Image";
import { useCart } from "../../../context/CartContext";
import "./card.css";

interface CardProps {
  product: Product;
}

const Card = ({ product }: CardProps) => {
  const [quantity, setQuantity] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  // Use o hook do carrinho
  const { addToCart, cart } = useCart();

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      setIsAdding(true);
      
      // Adiciona ao carrinho usando o contexto
      addToCart(product, quantity);
      
      // Feedback visual
      console.log(`Adicionado ${quantity} ${product.name} ao carrinho`);
      
      // Reset da quantidade após adicionar
      setTimeout(() => {
        setQuantity(0);
        setIsAdding(false);
      }, 300); // Tempo para a animação
    }
  };
  
  // Verifica se o produto já está no carrinho
  const alreadyInCart = cart.find(item => item.productId === product.id);

  return (
    <div className="card">
      {/* Badge mostrando que foi adicionado (feedback visual) */}
      {isAdding && (
        <div className="added-to-cart-badge">
          ✓ Adicionado!
        </div>
      )}

      <div className="card-images">
        {product.imagesNames.map((img, index) => (
          <Image 
            key={`${product.id}-${img}-${index}`} 
            fileName={img} 
            alt={`${product.name} - Imagem ${index + 1}`} 
            className={`card-image ${index === currentImageIndex ? 'active' : 'hidden'}`}
          />
        ))}

        {/* Indicadores de imagem */}
        {product.imagesNames.length > 1 && (
          <div className="image-indicators">
            {product.imagesNames.map((_, index) => (
              <div
                key={index}
                className={`image-indicator ${
                  index === currentImageIndex ? "active" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="card-content">
        <h2 className="card-title">{product.name}</h2>
        <p className="card-description">{product.description}</p>

        <div className="card-price">
          <span className="price-label">Preço:</span>
          <span className="price-value">{formatMoney(product.price)}</span>
        </div>

        <div className="quantity-section">
          <span className="quantity-label">Quantidade:</span>
          <div className="quantity-controls">
            <button
              className="quantity-btn"
              onClick={handleDecrease}
              disabled={quantity === 0}
              aria-label="Diminuir quantidade"
            >
              -
            </button>
            <span className="quantity-display">{quantity}</span>
            <button 
              className="quantity-btn" 
              onClick={handleIncrease}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      <button
        className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
        onClick={handleAddToCart}
        disabled={quantity === 0}
        aria-label={`Adicionar ${quantity} ${product.name} ao carrinho`}
      >
        <span className="add-to-cart-icon">🛒</span>
        {isAdding ? 'Adicionando...' : 'Adicionar ao carrinho'}
      </button>
      
      {/* Mostrar mensagem se já estiver no carrinho */}
      {alreadyInCart && (
        <div className="already-in-cart">
          ✓ Já no carrinho: {alreadyInCart.quantity} un.
        </div>
      )}
    </div>
  );
};

export default Card;