import React, { useState, useEffect } from 'react';
import type { Desk } from '../../../types/desk';
import { getAllDesks, createDesk, updateDesk, deleteDesk } from '../../../services/desk.service';
import './desk.css';

const DeskPage = () => {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Estados para formulários
  const [formData, setFormData] = useState<Desk>({
    deskCode: '',
    seats: 4
  });
  
  const [editingDeskId, setEditingDeskId] = useState<string | null>(null);

  // Carregar mesas
  const fetchDesks = async () => {
    try {
      setLoading(true);
      const data = await getAllDesks();
      setDesks(data);
      setError(null);
    } catch (err: any) {
      setError('Erro ao carregar as mesas');
      console.error('Erro ao carregar mesas:', err);
      
      // Mostrar erro específico se disponível
      if (err.response?.data?.message) {
        setError(`Erro: ${err.response.data.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesks();
  }, []);

  // Handlers para modais
  const openCreateModal = () => {
    setFormData({ deskCode: '', seats: 4 });
    setSaveError(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (desk: Desk) => {
    if (desk.id) {
      setFormData({
        id: desk.id,
        deskCode: desk.deskCode || '',
        seats: desk.seats
      });
      setEditingDeskId(desk.id);
      setSaveError(null);
      setIsEditModalOpen(true);
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingDeskId(null);
    setSaveError(null);
    setIsSaving(false);
  };

  // Handler para deletar mesa
  const handleDeleteDesk = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta mesa?')) {
      try {
        await deleteDesk(id);
        await fetchDesks(); // Recarregar a lista
      } catch (err: any) {
        console.error('Erro ao excluir mesa:', err);
        
        let errorMessage = 'Erro ao excluir mesa';
        if (err.response?.data?.message) {
          errorMessage = `Erro: ${err.response.data.message}`;
        } else if (err.response?.status === 409) {
          errorMessage = 'Não é possível excluir a mesa porque está em uso.';
        }
        
        alert(errorMessage);
      }
    }
  };

  // Handler para salvar (criar ou editar)
  const handleSaveDesk = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setIsSaving(true);
    
    try {
      // Preparar dados para enviar
      const dataToSend = { ...formData };
      
      if (editingDeskId) {
        // Para edição, remover o ID do payload se estiver vazio
        if (!dataToSend.id || dataToSend.id.trim() === '') {
          delete dataToSend.id;
        }
        
        // Editar mesa existente
        await updateDesk(editingDeskId, dataToSend);
      } else {
        // Para criação, garantir que não enviamos ID
        delete dataToSend.id;
        
        // Validar deskCode
        if (!dataToSend.deskCode || dataToSend.deskCode.trim() === '') {
          throw new Error('O código da mesa é obrigatório');
        }
        
        // Criar nova mesa
        await createDesk(dataToSend);
      }
      
      closeModals();
      await fetchDesks(); // Recarregar a lista
    } catch (err: any) {
      console.error('Erro ao salvar mesa:', err);
      
      let errorMessage = 'Erro ao salvar mesa';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = `Erro: ${err.response.data.message}`;
      } else if (err.response?.status === 409) {
        errorMessage = 'Conflito: O código da mesa já existe ou os dados estão em conflito.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Dados inválidos: Verifique os campos do formulário.';
      }
      
      setSaveError(errorMessage);
      setIsSaving(false);
    }
  };

  // Handler para mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'seats' ? parseInt(value) || 0 : value
    }));
    
    // Limpar erro quando usuário começa a editar
    if (saveError) {
      setSaveError(null);
    }
  };

  // Handler para aumentar/diminuir lugares
  const handleSeatsChange = (increment: number) => {
    setFormData(prev => ({
      ...prev,
      seats: Math.max(1, Math.min(20, prev.seats + increment))
    }));
    
    // Limpar erro quando usuário começa a editar
    if (saveError) {
      setSaveError(null);
    }
  };

  // Renderizar loading
  if (loading) {
    return (
      <div className="desk-loading">
        <div className="desk-loading-spinner"></div>
        <div className="text-text-secondary">Carregando mesas...</div>
      </div>
    );
  }

  // Renderizar erro
  if (error) {
    return (
      <div className="desk-error">
        <div className="desk-error-message">{error}</div>
        <button 
          onClick={fetchDesks}
          className="desk-retry-button"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="desk-page-container">
      {/* Cabeçalho */}
      <div className="desk-header">
        <div>
          <h1 className="desk-title">Mesas</h1>
          <p className="desk-subtitle">Gerencie as mesas do restaurante</p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="desk-add-button"
          disabled={isSaving}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova mesa
        </button>
      </div>

      {/* Lista de mesas */}
      <div className="desk-grid">
        {desks.length === 0 ? (
          <div className="desk-empty-state">
            <div className="desk-empty-icon">🪑</div>
            <h3 className="desk-empty-title">Nenhuma mesa cadastrada</h3>
            <p className="desk-empty-description">
              Comece adicionando sua primeira mesa para organizar o restaurante
            </p>
            <button
              onClick={openCreateModal}
              className="desk-add-button"
              disabled={isSaving}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar primeira mesa
            </button>
          </div>
        ) : (
          desks.map((desk) => (
            <div 
              key={desk.id} 
              className="desk-card"
            >
              <div className="desk-card-header">
                <div>
                  <h3 className="desk-card-title">
                    Mesa {desk.deskCode || desk.id?.slice(-6) || 'N/A'}
                  </h3>
                  <span className="desk-card-badge">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {desk.seats} {desk.seats === 1 ? 'lugar' : 'lugares'}
                  </span>
                </div>
              </div>
              
              <div className="desk-card-content">
                <div className="desk-info-row">
                  <span className="desk-info-label">Código:</span>
                  <span className="desk-info-value">
                    {desk.deskCode || 'N/A'}
                  </span>
                </div>
                <div className="desk-info-row">
                  <span className="desk-info-label">ID:</span>
                  <span className="desk-info-value desk-info-value-id">
                    {desk.id ? `${desk.id.slice(0, 8)}...` : 'N/A'}
                  </span>
                </div>
                <div className="desk-info-row">
                  <span className="desk-info-label">Lugares:</span>
                  <div className="desk-seats-display">
                    <span className="desk-seats-icon">🪑</span>
                    <span>{desk.seats}</span>
                  </div>
                </div>
              </div>
              
              <div className="desk-card-actions">
                <button
                  onClick={() => openEditModal(desk)}
                  className="desk-action-button desk-edit-button"
                  title="Editar mesa"
                  disabled={isSaving}
                >
                  <svg className="desk-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                
                <button
                  onClick={() => desk.id && handleDeleteDesk(desk.id)}
                  className="desk-action-button desk-delete-button"
                  title="Excluir mesa"
                  disabled={isSaving}
                >
                  <svg className="desk-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Criar/Editar Mesa */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="desk-modal-overlay">
          <div className="desk-modal">
            <div className="desk-modal-header">
              <h2 className="desk-modal-title">
                {editingDeskId ? 'Editar Mesa' : 'Cadastrar Nova Mesa'}
              </h2>
              <button
                onClick={closeModals}
                className="desk-modal-close"
                title="Fechar"
                disabled={isSaving}
              >
                <svg className="desk-modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="desk-modal-content">
              <form onSubmit={handleSaveDesk} className="desk-form">
                {/* Mensagem de erro no save */}
                {saveError && (
                  <div className="desk-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div className="desk-error-message">{saveError}</div>
                  </div>
                )}
                
                <div className="desk-form-group">
                  <label className="desk-form-label">
                    Código da Mesa *
                  </label>
                  <input
                    type="text"
                    name="deskCode"
                    value={formData.deskCode}
                    onChange={handleInputChange}
                    required
                    className="desk-form-input"
                    placeholder="Ex: M01, MESA-A, etc."
                    disabled={isSaving}
                    maxLength={20}
                  />
                </div>
                
                <div className="desk-form-group">
                  <label className="desk-form-label">
                    Número de Lugares
                  </label>
                  <div className="desk-seats-counter">
                    <div className="desk-seats-control">
                      <button
                        type="button"
                        onClick={() => handleSeatsChange(-1)}
                        className="desk-seats-button"
                        disabled={formData.seats <= 1 || isSaving}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        required
                        className="desk-seats-display-input"
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={() => handleSeatsChange(1)}
                        className="desk-seats-button"
                        disabled={formData.seats >= 20 || isSaving}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-text-secondary">
                      {formData.seats === 1 ? 'lugar' : 'lugares'}
                    </span>
                  </div>
                </div>

                <div className="desk-modal-footer">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="desk-modal-cancel"
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="desk-modal-submit"
                    disabled={isSaving || !formData.deskCode.trim()}
                  >
                    {isSaving ? (
                      <>
                        <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingDeskId ? 'Salvando...' : 'Cadastrando...'}
                      </>
                    ) : (
                      editingDeskId ? 'Salvar Alterações' : 'Cadastrar Mesa'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeskPage;