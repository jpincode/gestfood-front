// Header.tsx (versão corrigida)
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ChangeTheme from "../../button/ChangeTheme";
import { useClient } from "../../../context/ClientContext";
import "./header.css";

function Header() {
  const navigate = useNavigate();
  const { clientName, deskCode, isLoggedIn, logout } = useClient();
  const [cartItemsCount] = useState(0);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/login', { state: { showRegister: true } });
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      // Aqui você pode implementar um dropdown/modal de perfil
      console.log("Abrir menu do perfil");
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Função para gerar iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to={"/cardapio"}>
            <strong>Gest</strong>Food
          </Link>
        </div>

        <div className="nav-bar">
          <nav>
            <ul>
              <li>
                <NavLink to={"/cardapio"} className={({ isActive }) => (isActive ? "active" : undefined)}>
                  Cardápio
                </NavLink>
              </li>
              <li>
                <NavLink to={"/carrinho"} className={({ isActive }) => (isActive ? "active" : undefined)}>
                  Carrinho
                  {cartItemsCount > 0 && (
                    <span className="cart-count">{cartItemsCount}</span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to={'/pedidos'} className={({ isActive }) => (isActive ? "active" : undefined)}>
                  Meus pedidos
                </NavLink>
              </li>
            </ul>

            <div className="profile">
              {isLoggedIn ? (
                // Usuário logado
                <div className="logged-in-user">
                  <div className="user-info">
                    <div className="desk-info">
                      <span className="desk-icon">🪑</span>
                      <span className="desk-code">Mesa {deskCode}</span>
                    </div>
                    <div className="user-greeting">
                      Olá, <strong>{clientName}</strong>
                    </div>
                  </div>
                  
                  <div className="user-actions">
                    <div 
                      className="profile-logo logged"
                      onClick={handleProfileClick}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleProfileClick()}
                    >
                      <div className="image">
                        <span className="avatar-initials">
                          {getInitials(clientName || '')}
                        </span>
                      </div>
                      <div className="user-details">
                        <p className="desk-info-mobile">Mesa {deskCode}</p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="btn-logout"
                      onClick={handleLogout}
                      aria-label="Sair da conta"
                    >
                      Sair
                    </button>
                    
                    <div className="change-theme-container">
                      <ChangeTheme />
                    </div>
                  </div>
                </div>
              ) : (
                // Usuário não logado
                <>
                  <div className="login-btn">
                    <button
                      type="button"
                      className="btn-login"
                      onClick={handleLoginClick}
                      aria-label="Fazer login na conta"
                    >
                      Login
                    </button>
                    <p>ou</p>
                    <button
                      type="button"
                      className="btn-register"
                      onClick={handleRegisterClick}
                      aria-label="Criar nova conta"
                    >
                      Registro
                    </button>
                  </div>
                  
                  <div 
                    className="profile-logo guest"
                    onClick={handleLoginClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleLoginClick()}
                  >
                    <div className="image">
                      <span>👤</span>
                    </div>
                    <p className="name">Não logado</p>
                  </div>
                  
                  <div className="change-theme-container">
                    <ChangeTheme />
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;