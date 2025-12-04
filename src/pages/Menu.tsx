import { useEffect, useState } from "react";
import { getAllProducts } from "../services/product.service";
import type { Product } from "../types/product";
import Card from "../components/ui/card/Card";
import '../styles/globals.css'
import '../styles/menu.css'
import { Link } from "react-router-dom";

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllProducts()
      .then((res) => setProducts(res))
      .catch(() => setError("Erro ao carregar produtos."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Carregando produtos...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h2 className="error-title">Ops! Algo deu errado</h2>
      <p className="error-message">{error}</p>
      <button 
        className="empty-btn" 
        onClick={() => window.location.reload()}
      >
        Tentar novamente
      </button>
    </div>
  );

  if (products.length === 0) return (
    <div className="empty-container">
      <div className="empty-icon">🍽️</div>
      <h2 className="error-title">Cardápio vazio</h2>
      <p className="empty-message">Nenhum produto disponível no momento.</p>
      <div className="empty-actions">
        <button className="empty-btn">
          <Link to={'/cardapio'}>Voltar para início</Link>
        </button>
      </div>
    </div>
  );

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="menu-header-content">
          <h1 className="menu-title">
            <span className="menu-title-icon">🍽️</span>
            Nosso Cardápio
          </h1>
          <p className="menu-subtitle">
            Delícias cuidadosamente preparadas para você saborear
          </p>
        </div>
      </div>

      {/* Opcional: Adicione filtros futuramente */}
      {/* <div className="menu-filters">
        <div className="filter-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar produto..." 
            />
          </div>
          <div className="filter-buttons">
            <button className="filter-btn active">Todos</button>
            <button className="filter-btn">Entradas</button>
            <button className="filter-btn">Pratos Principais</button>
            <button className="filter-btn">Sobremesas</button>
            <button className="filter-btn">Bebidas</button>
          </div>
        </div>
      </div> */}

      <div className="products-count">
        <span className="count-number">{products.length}</span>
        <span className="count-text">
          {products.length === 1 ? 'produto disponível' : 'produtos disponíveis'}
        </span>
      </div>

      <div className="cards-container">
        {products.map((p) => (
          <Card key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Menu;