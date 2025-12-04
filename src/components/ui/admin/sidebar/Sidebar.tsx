// components/layout/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  UserCircle,
  Table,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Calendar,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  ordersLenght: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose, ordersLenght }) => {
  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-wrapper">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-container">
            <div className="logo-icon">R</div>
            <span className="logo-text">GestFood Admin</span>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-title">Principal</div>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Home size={20} className="nav-icon" />
              <span className="nav-text">Dashboard</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-title">Gerenciamento</div>
            <NavLink 
              to="/admin/orders" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <ShoppingCart size={20} className="nav-icon" />
              <span className="nav-text">Pedidos</span>
              <span className="nav-badge">{ordersLenght === 0 ? 0 : ordersLenght}</span>
            </NavLink>

            <NavLink 
              to="/admin/customers" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Users size={20} className="nav-icon" />
              <span className="nav-text">Clientes</span>
            </NavLink>

            <NavLink 
              to="/admin/products" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Package size={20} className="nav-icon" />
              <span className="nav-text">Produtos</span>
            </NavLink>

            <NavLink 
              to="/admin/employees" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <UserCircle size={20} className="nav-icon" />
              <span className="nav-text">Funcionários</span>
            </NavLink>

            <NavLink 
              to="/admin/desks" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Table size={20} className="nav-icon" />
              <span className="nav-text">Mesas</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <div className="nav-title">Análise</div>
            <NavLink 
              to="/admin/reports" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <BarChart3 size={20} className="nav-icon" />
              <span className="nav-text">Relatórios</span>
            </NavLink>

            <NavLink 
              to="/admin/calendar" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Calendar size={20} className="nav-icon" />
              <span className="nav-text">Agenda</span>
            </NavLink>
          </div>
        </nav>

        {/* Configurações e Logout */}
        <div className="sidebar-footer">
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Settings size={20} className="nav-icon" />
            <span className="nav-text">Configurações</span>
          </NavLink>

          <button className="nav-link logout-btn">
            <LogOut size={20} className="nav-icon" />
            <span className="nav-text">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;