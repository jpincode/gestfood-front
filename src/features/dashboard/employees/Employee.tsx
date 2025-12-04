import React, { useEffect, useState } from 'react';
import type { Employee } from '../../../types/employee';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../../services/employee.service';
import './employee.css';

interface EmployeeProps {
  // Additional props can be added here
};

const Employeee = ({}: EmployeeProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    email: '',
    password: '',
    cpf: '',
    role: 'BALCONISTA' // Valor padrão conforme o enum
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role options baseadas no enum fornecido
  const roleOptions = [
    // { value: 'CLIENTE', label: 'Cliente' },
    { value: 'BALCONISTA', label: 'Balconista' },
    { value: 'GERENTE', label: 'Gerente' },
    { value: 'ADMINISTRADOR', label: 'Administrador' }
  ];

  // Carregar funcionários ao montar o componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees(); // Recarregar a lista após exclusão
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
      }
    }
  };

  const handleEditClick = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: employee.password,
      cpf: employee.cpf,
      role: employee.role
    });
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setCurrentEmployee(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      cpf: '',
      role: 'BALCONISTA'
    });
    setIsCreateModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, role: e.target.value }));
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEmployee(formData as Employee);
      setIsCreateModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee?.id) return;
    
    setIsSubmitting(true);
    try {
      await updateEmployee(currentEmployee.id, { ...formData, id: currentEmployee.id } as Employee);
      setIsEditModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Função para obter label do role
  const getRoleLabel = (role: string) => {
    const option = roleOptions.find(opt => opt.value === role);
    return option ? option.label : role;
  };

  // Modal de formulário
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
                placeholder="Digite o nome completo"
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
                placeholder="funcionario@exemplo.com"
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
                placeholder="••••••••"
                minLength={6}
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
              <label>Cargo:</label>
              <div className="role-select">
                {roleOptions.map(option => (
                  <div key={option.value} className="role-option">
                    <input
                      type="radio"
                      id={`role-${option.value}`}
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={handleRoleChange}
                    />
                    <label htmlFor={`role-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={closeModals}>
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="employee-container">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h1>Funcionários Cadastrados</h1>
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
          Cadastrar novo funcionário
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p>Nenhum funcionário cadastrado.</p>
          <p className="text-muted">Clique no botão acima para adicionar seu primeiro funcionário.</p>
        </div>
      ) : (
        <div className="employee-grid">
          {employees.map(employee => (
            <div key={employee.id} className="employee-card">
              <div className="employee-info">
                <p>
                  <strong>Nome:</strong> {employee.name}
                </p>
                <p>
                  <strong>Email:</strong> {employee.email}
                </p>
                <p>
                  <strong>CPF:</strong> {employee.cpf}
                </p>
                <p>
                  <strong>Cargo:</strong> {getRoleLabel(employee.role)}
                  <span className={`role-badge role-${employee.role.toLowerCase()}`}>
                    {getRoleLabel(employee.role)}
                  </span>
                </p>
              </div>
              <div className="employee-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEditClick(employee)}
                  aria-label={`Editar funcionário ${employee.name}`}
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
                  onClick={() => handleDelete(employee.id!)}
                  aria-label={`Excluir funcionário ${employee.name}`}
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

      {renderModal(isCreateModalOpen, 'Cadastrar Novo Funcionário', handleSubmitCreate)}
      {renderModal(isEditModalOpen, 'Editar Funcionário', handleSubmitEdit)}
    </div>
  );
};

export default Employeee;