// pages/admin/Dashboard.tsx
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../../components/ui/admin/layout/AdminLayout";
import MainDash from "./MainDash";
import Cliente from './clients/Client';
import Desk from './desks/Desk';
import Employeee from './employees/Employee';
import Orderse from './orders/Order';
import Producte from './products/Product';

const Dashboard = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <AdminLayout title="Dashboard" subtitle="Bem-vindo de volta, Administrador!">
            <MainDash />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <AdminLayout title="Dashboard" subtitle="Visão geral do sistema">
            <MainDash />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/orders" 
        element={
          <AdminLayout title="Pedidos" subtitle="Gerencie todos os pedidos">
            <Orderse />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/customers" 
        element={
          <AdminLayout title="Clientes" subtitle="Gerencie o cadastro de clientes">
            <Cliente />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/products" 
        element={
          <AdminLayout title="Produtos" subtitle="Gerencie o cardápio e produtos">
            <Producte />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/employees" 
        element={
          <AdminLayout title="Funcionários" subtitle="Gerencie a equipe de funcionários">
            <Employeee />
          </AdminLayout>
        } 
      />
      
      <Route 
        path="/desks" 
        element={
          <AdminLayout title="Mesas" subtitle="Controle de mesas e reservas">
            <Desk />
          </AdminLayout>
        } 
      />
    </Routes>
  );
};

export default Dashboard;