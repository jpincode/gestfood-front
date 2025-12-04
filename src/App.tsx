// App.tsx
import "./styles/globals.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./layout/Main";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import PageNotFound from "./pages/PageNotFound";
import Orders from "./pages/Orders";
import Dashboard from "./features/dashboard/Dashboard";
import Login from "./features/login/Login";
import { useClient } from "./context/ClientContext";

// Componente para proteger rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useClient();
  
  if (!isLoggedIn) {
    // Redireciona para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente para rota pública (só acessível quando NÃO logado)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useClient();
  
  if (isLoggedIn) {
    // Redireciona para home se já estiver logado
    return <Navigate to="/cardapio" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { clientId } = useClient();
  
  return (
    <div>
      <Routes>
        {/* Rota pública - só acessível quando NÃO logado */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        {/* Rotas protegidas - só acessíveis quando logado */}
        <Route element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }>
          <Route path="/cardapio" element={<Menu />} />
          <Route path="/carrinho" element={<Cart clientId={clientId || ""} />} />
          <Route path="/pedidos" element={<Orders />} />
        </Route>
        
        {/* Rota de erro 404 - acessível por todos */}
        <Route path="/error404" element={<PageNotFound />} />
        
        {/* Rota admin - livre acesso */}
        <Route path="/admin/*" element={<Dashboard />} />
        
        {/* Redirecionar rotas desconhecidas para 404 */}
        <Route path="*" element={<Navigate to="/error404" replace />} />
      </Routes>
    </div>
  );
}

export default App;