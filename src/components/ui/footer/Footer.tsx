// src/components/Footer.tsx
import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Seção 1: Logo e Descrição */}
          <div className="footer-section">
            <div className="footer-logo">
              <Link to={'/cardapio'}>
                Gest<span>Food</span>
              </Link>
            </div>
            <p className="footer-description">
              Seu cardápio digital favorito. Pedidos rápidos, delivery seguro e
              a melhor experiência gastronômica.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">
                📱
              </a>
              <a href="#" className="social-icon">
                📷
              </a>
              <a href="#" className="social-icon">
                📘
              </a>
              <a href="#" className="social-icon">
                🐦
              </a>
            </div>
          </div>

          {/* Seção 2: Navegação */}
          <div className="footer-section">
            <h3 className="footer-title">Navegação</h3>
            <ul className="footer-links">
              <li>
                <a href="/cardapio">Cardápio</a>
              </li>
              <li>
                <a href="/promocoes">Promoções</a>
              </li>
              <li>
                <a href="/sobre">Sobre Nós</a>
              </li>
              <li>
                <a href="/contato">Contato</a>
              </li>
            </ul>
          </div>

          {/* <!-- Seção 3: Categorias --> */}
          <div className="footer-section">
            <h3 className="footer-title">Categorias</h3>
            <ul className="footer-links">
              <li>
                <a href="/categoria/lanches">Lanches</a>
              </li>
              <li>
                <a href="/categoria/pizzas">Pizzas</a>
              </li>
              <li>
                <a href="/categoria/bebidas">Bebidas</a>
              </li>
              <li>
                <a href="/categoria/sobremesas">Sobremesas</a>
              </li>
              <li>
                <a href="/categoria/combos">Combos</a>
              </li>
            </ul>
          </div>

          {/* <!-- Seção 4: Contato e Newsletter --> */}
          <div className="footer-section">
            <h3 className="footer-title">Contato</h3>
            <div className="contact-info">
              <p>📍 Av. Principal, 1234 - Centro</p>
              <p>📞 (11) 99999-9999</p>
              <p>✉️ contato@gestfood.com</p>
              <p>⏰ Aberto todos os dias: 10h - 23h</p>
            </div>

            <div className="newsletter">
              <h4 className="newsletter-title">Receba nossas ofertas</h4>
              <form className="newsletter-form">
                <input type="email" placeholder="Seu melhor e-mail" required />
                <button type="submit" className="newsletter-btn">
                  Inscrever
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* <!-- Rodapé inferior --> */}
        <div className="footer-bottom">
          {/* <!-- Métodos de pagamento --> */}
          <div className="payment-methods">
            <div className="payment-icon">💳</div>
            <div className="payment-icon">💰</div>
            <div className="payment-icon">📱</div>
            <div className="payment-icon">🏦</div>
            <div className="payment-icon">🔗</div>
          </div>

          {/* <!-- Copyright e links legais --> */}
          <div className="copyright">
            <p>© 2025 GestFood. Todos os direitos reservados.</p>
            <div className="legal-links">
              <a href="/termos">Termos de Uso</a>
              <a href="/privacidade">Política de Privacidade</a>
              <a href="/cookies">Cookies</a>
            </div>
          </div>

          {/* <!-- Informação do desenvolvedor --> */}
          <div className="developer-info">
            <p>Desenvolvido com ❤️ para amantes de boa comida</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
