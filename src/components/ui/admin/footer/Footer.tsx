// components/layout/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import './footer.css'

const Footer: React.FC = () => {
  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <div>
          <p>© {new Date().getFullYear()} GestFood Admin. Todos os direitos reservados.</p>
          <p className="footer-version">
            Versão 1.0.0 • Última atualização: Hoje, {formatTime()}
          </p>
        </div>

        <div className="footer-links">
          <Link to="/privacy" className="footer-link">
            Política de Privacidade
          </Link>
          <Link to="/terms" className="footer-link">
            Termos de Uso
          </Link>
          <Link to="/support" className="footer-link">
            Suporte
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;