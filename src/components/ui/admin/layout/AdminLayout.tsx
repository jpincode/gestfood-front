// components/layout/AdminLayout.tsx
import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import Footer from "../footer/Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  ordersLenght: number
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  ordersLenght
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        ordersLenght={ordersLenght}
      />
      
      <main className="dashboard-main">
        <Header 
          title={title}
          subtitle={subtitle}
          onMenuToggle={toggleSidebar}
        />
        
        <div className="page-content">
          {children}
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

export default AdminLayout;