// components/layout/Header.tsx
import React from "react";
import { Bell, ChevronDown } from "lucide-react";
import ChangeTheme from "../../../button/ChangeTheme";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Dashboard", 
  subtitle = "Bem-vindo de volta, Administrador!", 
  onMenuToggle 
}) => {
  return (
    <header className="top-bar">
      <button className="mobile-menu-btn" onClick={onMenuToggle}>
        <svg
          className="nav-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="page-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="top-bar-actions">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>

        <ChangeTheme />

        <div className="user-profile">
          <div className="user-avatar">A</div>
          <div className="user-info">
            <div className="user-name">Administrador</div>
            <div className="user-email">admin@restaurante.com</div>
          </div>
          <ChevronDown size={16} className="user-dropdown" />
        </div>
      </div>
    </header>
  );
};

export default Header;