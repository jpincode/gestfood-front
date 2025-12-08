import "./dashboard.css";
import { Link } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  UserCircle,
  Table,
  Package,
  BarChart3,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllOrders } from "../../services/order.service";
import type { Order } from "../../types/order";

const MainDash = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getAllOrders();
        setOrders(ordersData);
        console.log(ordersData);
      } catch (err) {
        setOrders([]);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: "Pedidos Hoje",
      value: orders.length,
      icon: ShoppingCart,
      color: "blue",
      change: "+12%",
    },
    {
      title: "Clientes Ativos",
      value: "156",
      icon: Users,
      color: "green",
      change: "+5%",
    },
    {
      title: "Receita Total",
      value: "R$ 12.450",
      icon: DollarSign,
      color: "purple",
      change: "+18%",
    },
    {
      title: "Produtos Vendidos",
      value: "342",
      icon: Package,
      color: "orange",
      change: "+8%",
    },
  ];

  // Dados fictícios para pedidos recentes
  const recentOrders = [
    {
      id: "#ORD001",
      customer: "João Silva",
      amount: "R$ 89,90",
      status: "Entregue",
      time: "10 min",
    },
    {
      id: "#ORD002",
      customer: "Maria Santos",
      amount: "R$ 125,50",
      status: "Preparando",
      time: "25 min",
    },
    {
      id: "#ORD003",
      customer: "Pedro Oliveira",
      amount: "R$ 67,80",
      status: "Pendente",
      time: "40 min",
    },
    {
      id: "#ORD004",
      customer: "Ana Costa",
      amount: "R$ 210,00",
      status: "Entregue",
      time: "55 min",
    },
    {
      id: "#ORD005",
      customer: "Carlos Lima",
      amount: "R$ 95,30",
      status: "Cancelado",
      time: "1h 10min",
    },
  ];

  // Módulos do dashboard
  const modules = [
    {
      title: "Pedidos",
      description: "Gerencie todos os pedidos do sistema",
      icon: ShoppingCart,
      link: "/admin/orders",
      count: orders.length,
    },
    {
      title: "Clientes",
      description: "Gerencie o cadastro de clientes",
      icon: Users,
      link: "/admin/customers",
      count: 342,
    },
    {
      title: "Produtos",
      description: "Gerencie o cardápio e produtos",
      icon: Package,
      link: "/admin/products",
      count: 89,
    },
    {
      title: "Funcionários",
      description: "Gerencie a equipe de funcionários",
      icon: UserCircle,
      link: "/admin/employees",
      count: 24,
    },
    {
      title: "Mesas",
      description: "Controle de mesas e reservas",
      icon: Table,
      link: "/admin/desks",
      count: 15,
    },
    {
      title: "Relatórios",
      description: "Relatórios e análises",
      icon: BarChart3,
      link: "/admin/reports",
      count: "12+",
    },
  ];

  return (
    <div className="page-content">
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClass = stat.color;

          return (
            <div key={index} className="stat-card fade-in">
              <div className="stat-card-header">
                <div>
                  <div className="stat-title">{stat.title}</div>
                  <div className="stat-value">{stat.value}</div>
                </div>
                <div className={`stat-icon ${colorClass}`}>
                  <Icon size={24} />
                </div>
              </div>
              <div className="stat-change positive">
                <TrendingUp size={16} />
                <span>{stat.change} desde ontem</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Módulos Principais */}
      <div className="mb-8">
        <div className="section-header">
          <div>
            <h2 className="section-title">Gerenciamento</h2>
            <p className="section-subtitle">
              Gerencie todas as áreas do sistema
            </p>
          </div>
        </div>

        <div className="modules-grid">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link
                key={index}
                to={module.link}
                className="module-card fade-in"
              >
                <div className="module-card-header">
                  <div className="module-icon">
                    <Icon size={24} />
                  </div>
                  <span className="module-badge">{module.count}</span>
                </div>

                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>

                <div className="module-link">
                  <span>Acessar módulo</span>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pedidos Recentes e Gráfico */}
      <div className="content-row">
        {/* Pedidos Recentes */}
        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">Pedidos Recentes</h2>
            <Link to="/admin/orders" className="view-all">
              Ver todos →
            </Link>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <div className="table-cell-id">{order.id}</div>
                    </td>
                    <td>
                      <div className="table-cell-customer">
                        {order.customer}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-amount">{order.amount}</div>
                    </td>
                    <td>
                      <div className="table-cell-status">
                        <span
                          className={`status-badge ${
                            order.status === "Entregue"
                              ? "delivered"
                              : order.status === "Preparando"
                              ? "preparing"
                              : order.status === "Pendente"
                              ? "pending"
                              : "cancelled"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="table-cell-time">{order.time}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfico de Vendas */}
        <div className="chart-container">
          <div className="chart-header">
            <h2 className="section-title">Vendas do Mês</h2>
            <div className="chart-filters">
              <button className="filter-btn">Semana</button>
              <button className="filter-btn active">Mês</button>
              <button className="filter-btn">Ano</button>
            </div>
          </div>

          {/* Placeholder para gráfico */}
          <div className="chart-placeholder">
            <BarChart3 size={48} className="chart-placeholder-icon" />
            <p className="chart-placeholder-text">
              Gráfico de vendas será exibido aqui
            </p>
            <p className="chart-placeholder-subtext">
              Integração com biblioteca de gráficos
            </p>
          </div>

          <div className="chart-stats">
            <div className="chart-stat-item">
              <div className="chart-stat-value">R$ 8.450</div>
              <div className="chart-stat-label">Esta semana</div>
            </div>
            <div className="chart-stat-item">
              <div className="chart-stat-value">R$ 34.210</div>
              <div className="chart-stat-label">Este mês</div>
            </div>
            <div className="chart-stat-item">
              <div className="chart-stat-value">+18%</div>
              <div className="chart-stat-label">Crescimento</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDash;
