// pages/admin/Dashboard.tsx
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../../components/ui/admin/layout/AdminLayout";
import { getAllOrders } from "../../services/order.service";
import type { Order } from "../../types/order";
import MainDash from "./MainDash";
import Cliente from './clients/Client';
import Desk from './desks/Desk';
import Employeee from './employees/Employee';
import Orderse from './orders/Order';
import Producte from './products/Product';

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  
    useEffect(() => {
      async () => {
        try {
          const ordersData = await getAllOrders();
          setOrders(ordersData);
        } catch (err) {
          setOrders([]);
        }
      } 
    }, []);
    
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <AdminLayout title="Dashboard" subtitle="Bem-vindo de volta, Administrador!" ordersLenght={orders.length}>
            <MainDash />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <AdminLayout title="Dashboard" subtitle="Visão geral do sistema" ordersLenght={orders.length}>
            <MainDash />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/orders" 
        element={
          <AdminLayout title="Pedidos" subtitle="Gerencie todos os pedidos" ordersLenght={orders.length}>
            <Orderse />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/customers" 
        element={
          <AdminLayout title="Clientes" subtitle="Gerencie o cadastro de clientes" ordersLenght={orders.length}>
            <Cliente />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/products" 
        element={
          <AdminLayout title="Produtos" subtitle="Gerencie o cardápio e produtos" ordersLenght={orders.length}>
            <Producte />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/employees" 
        element={
          <AdminLayout title="Funcionários" subtitle="Gerencie a equipe de funcionários" ordersLenght={orders.length}>
            <Employeee />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/desks" 
        element={
          <AdminLayout title="Mesas" subtitle="Controle de mesas e reservas" ordersLenght={orders.length}>
            <Desk />
          </AdminLayout>
        } 
      />
    </Routes>
  );
};

export default Dashboard;