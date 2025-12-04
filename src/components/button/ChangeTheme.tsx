import { useState, useEffect } from 'react';
import './changetheme.css';

const ChangeTheme = () => {
  const [isLightTheme, setIsLightTheme] = useState<boolean>(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light';
  });

  useEffect(() => {
    // Apply theme on initial load
    applyTheme(isLightTheme);
  }, []);

  const applyTheme = (light: boolean) => {
    const body = document.body;
    
    if (light) {
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  };

  const toggleTheme = () => {
    const newThemeState = !isLightTheme;
    setIsLightTheme(newThemeState);
    applyTheme(newThemeState);
  };

  return (
    <div className="theme-toggle">
      <button 
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label={isLightTheme ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
      >
        {isLightTheme ? (
          <>
            <span className="theme-icon">🌙</span>
            {/* <span className="theme-text">Modo Escuro</span> */}
          </>
        ) : (
          <>
            <span className="theme-icon">☀️</span>
            {/* <span className="theme-text">Modo Claro</span> */}
          </>
        )}
      </button>
    </div>
  );
};

export default ChangeTheme;