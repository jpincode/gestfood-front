import React, { useEffect, useState } from 'react';
import type { Client } from '../../../types/client';
import { getAllClients, createClient, updateClient, deleteClient } from '../../../services/client.service';
import './client.css';

const Cliente = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    name: '',
    email: '',
    password: '',
    cpf: '',
    phoneNumber: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar clientes ao montar o componente
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteClient(id);
        fetchClients(); // Recarregar a lista após exclusão
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const handleEditClick = (client: Client) => {
    setCurrentClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      password: client.password,
      cpf: client.cpf,
      phoneNumber: client.phoneNumber,
      address: client.address
    });
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setCurrentClient(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      cpf: '',
      phoneNumber: '',
      address: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient(formData as Client);
      setIsCreateModalOpen(false);
      fetchClients();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient?.id) return;
    try {
      await updateClient(currentClient.id, { ...formData, id: currentClient.id } as Client);
      setIsEditModalOpen(false);
      fetchClients();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Modal de formulário reutilizável
  const renderModal = (isOpen: boolean, title: string, onSubmit: (e: React.FormEvent) => void) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={closeModals} aria-label="Fechar modal">
              ✕
            </button>
          </div>
          <form onSubmit={onSubmit} className="modal-body">
            <div className="form-group">
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                required
                placeholder="000.000.000-00"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Telefone:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Endereço:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                autoComplete="street-address"
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={closeModals}>
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="client-container">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-container">
      <div className="client-header">
        <h1>Clientes Cadastrados</h1>
        <button className="btn-create" onClick={handleCreateClick}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Cadastrar novo cliente
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <p>Nenhum cliente cadastrado.</p>
          <p className="text-muted">Clique no botão acima para adicionar seu primeiro cliente.</p>
        </div>
      ) : (
        <div className="client-grid">
          {clients.map(client => (
            <div key={client.id} className="client-card">
              <div className="client-info">
                <p>
                  <strong>Nome:</strong> {client.name}
                </p>
                <p>
                  <strong>Email:</strong> {client.email}
                </p>
                <p>
                  <strong>CPF:</strong> {client.cpf}
                </p>
                <p>
                  <strong>Telefone:</strong> {client.phoneNumber}
                </p>
                <p>
                  <strong>Endereço:</strong> {client.address}
                </p>
              </div>
              <div className="client-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEditClick(client)}
                  aria-label={`Editar cliente ${client.name}`}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(client.id!)}
                  aria-label={`Excluir cliente ${client.name}`}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {renderModal(isCreateModalOpen, 'Cadastrar Novo Cliente', handleSubmitCreate)}
      {renderModal(isEditModalOpen, 'Editar Cliente', handleSubmitEdit)}
    </div>
  );
};

export default Cliente;