import { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types/product';
import type { Order } from '../types/order';
import type { ReactNode } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
};

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  getOrder: (clientId: string) => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: {children: ReactNode}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    // SOLUÇÃO: Criar uma variável local tipada explicitamente
    const productId = product.id;
    
    // Validação explícita
    if (typeof productId !== 'string') {
      console.error('Product ID must be a string', productId);
      return;
    }
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === productId);

      if(existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
          product: product
        };
        return updatedCart;
      } else {
        // Criamos um objeto explicitamente tipado
        const newItem: CartItem = {
          productId: productId, // Agora TypeScript sabe que é string
          quantity,
          product
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => {
      const productPrice = item.product?.price || 0;
      return total + (productPrice * item.quantity);
    }, 0);
  };

  const getOrder = (clientId: string): Order => {
    const description = cart.map(item => 
      `${item.quantity}x ${item.product?.name || 'Produto'}`
    ).join(', ');
    
    const productsIds = cart.flatMap(item => 
      Array(item.quantity).fill(item.productId)
    );

    return {
      description: description || "Pedido do cardápio online",
      totalAmount: getTotalAmount(),
      status: "PENDING",
      clientId,
      productsIds
    };
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalAmount,
      getOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};