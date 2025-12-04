// contexts/ClientContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ClientContextType {
  clientId: string | null;
  clientName: string | null;
  deskCode: string | null;
  isLoggedIn: boolean;
  setClientInfo: (id: string | null, name: string | null, deskCode: string | null) => void;
  logout: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [deskCode, setDeskCode] = useState<string | null>(null);

  useEffect(() => {
    // Carregar do localStorage ao iniciar
    const savedClientId = localStorage.getItem('clientId');
    const savedClientName = localStorage.getItem('clientName');
    const savedDeskCode = localStorage.getItem('deskCode');
    
    if (savedClientId) {
      setClientId(savedClientId);
      setClientName(savedClientName);
      setDeskCode(savedDeskCode);
    }
  }, []);

  const setClientInfo = (id: string | null, name: string | null, desk: string | null) => {
    setClientId(id);
    setClientName(name);
    setDeskCode(desk);
    
    if (id && name && desk) {
      localStorage.setItem('clientId', id);
      localStorage.setItem('clientName', name);
      localStorage.setItem('deskCode', desk);
    } else {
      localStorage.removeItem('clientId');
      localStorage.removeItem('clientName');
      localStorage.removeItem('deskCode');
    }
  };

  const logout = () => {
    setClientInfo(null, null, null);
    localStorage.removeItem('clientId');
    localStorage.removeItem('clientName');
    localStorage.removeItem('deskCode');
    localStorage.removeItem('deskId');
  };

  const value = {
    clientId,
    clientName,
    deskCode,
    isLoggedIn: !!clientId,
    setClientInfo,
    logout
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};