// Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllClients,
  createClient,
} from "../../services/client.service";
import { getAllDesks } from "../../services/desk.service";
import type { Client } from "../../types/client";
import type { Desk } from "../../types/desk";
import "./login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    email: "",
    password: "",
    cpf: "",
    phoneNumber: "",
    address: "",
  });
  const [loginData, setLoginData] = useState({
    cpf: "", // Mudado de id para cpf
    password: "",
  });
  const [desks, setDesks] = useState<Desk[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]); // Para buscar cliente por CPF

  // Buscar mesas disponíveis e clientes
  useEffect(() => {
    fetchData();

    // Verificar se já existe um usuário logado
    const savedClientId = localStorage.getItem("clientId");
    if (savedClientId) {
      navigate("/cardapio");
    }
  }, []);

  const fetchData = async () => {
    try {
      const [desksData, clientsData] = await Promise.all([
        getAllDesks(),
        getAllClients(),
      ]);

      setDesks(desksData);
      setClients(clientsData);

      // Selecionar primeira mesa por padrão
      if (desksData.length > 0) {
        setSelectedDesk(desksData[0].id || "");
      }
    } catch (err) {
      setError("Erro ao carregar dados iniciais");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isRegister) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDesk(e.target.value);
  };

  // Função auxiliar para buscar cliente por CPF
  const findClientByCpf = (cpf: string): Client | undefined => {
    // Remove formatação para comparação
    const cleanCpf = cpf.replace(/\D/g, "");
    return clients.find((client) => client.cpf.replace(/\D/g, "") === cleanCpf);
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!loginData.cpf || !loginData.password || !selectedDesk) {
        throw new Error("Preencha todos os campos");
      }

      // Buscar cliente pelo CPF
      const client = findClientByCpf(loginData.cpf);

      if (!client) {
        throw new Error("CPF não encontrado. Verifique ou cadastre-se.");
      }

      // Verificar senha
      if (client.password !== loginData.password) {
        throw new Error("Senha incorreta");
      }

      // Salvar no localStorage
      localStorage.setItem("clientId", client.id || "");
      localStorage.setItem("clientName", client.name);
      localStorage.setItem("clientCpf", client.cpf); // Salvar CPF também
      localStorage.setItem("deskId", selectedDesk);

      // Salvar mesa no localStorage
      const selectedDeskObj = desks.find((d) => d.id === selectedDesk);
      if (selectedDeskObj) {
        localStorage.setItem("deskCode", selectedDeskObj.deskCode);
      }

      navigate("/cardapio");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  // Login.tsx (apenas a função handleSubmitRegister corrigida)
  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validar campos obrigatórios
      const requiredFields = [
        "name",
        "email",
        "password",
        "cpf",
        "phoneNumber",
        "address",
      ];
      for (const field of requiredFields) {
        if (!formData[field as keyof Client]) {
          throw new Error(`Preencha o campo ${field}`);
        }
      }

      if (!selectedDesk) {
        throw new Error("Selecione uma mesa");
      }

      // Verificar se CPF já está cadastrado
      const existingClient = findClientByCpf(formData.cpf!);
      if (existingClient) {
        throw new Error("CPF já cadastrado. Faça login em vez de cadastrar.");
      }

      // Verificar se e-mail já está cadastrado
      const existingEmail = clients.find(
        (client) => client.email.toLowerCase() === formData.email!.toLowerCase()
      );
      if (existingEmail) {
        throw new Error(
          "E-mail já cadastrado. Use outro e-mail ou faça login."
        );
      }

      // Preparar dados - salvar CPF sem formatação
      const cleanCpf = formData.cpf!.replace(/\D/g, "");

      const newClient: Client = {
        name: formData.name!,
        email: formData.email!,
        password: formData.password!,
        cpf: cleanCpf,
        phoneNumber: formData.phoneNumber!.replace(/\D/g, ""),
        address: formData.address!,
      };

      // Criar cliente
      await createClient(newClient);

      // ATUALIZAÇÃO AQUI: Buscar todos os clientes novamente
      const updatedClients = await getAllClients();

      // Buscar o cliente recém-criado pelo CPF (mais confiável)
      const createdClient = updatedClients.find(
        (client) => client.cpf.replace(/\D/g, "") === cleanCpf
      );

      if (createdClient) {
        // Salvar no localStorage
        localStorage.setItem("clientId", createdClient.id || "");
        localStorage.setItem("clientName", createdClient.name);
        localStorage.setItem("clientCpf", createdClient.cpf);
        localStorage.setItem("deskId", selectedDesk);

        // Salvar mesa no localStorage
        const selectedDeskObj = desks.find((d) => d.id === selectedDesk);
        if (selectedDeskObj) {
          localStorage.setItem("deskCode", selectedDeskObj.deskCode);
        }

        // Atualizar lista local
        setClients(updatedClients);

        // Redirecionar
        navigate("/cardapio");
      } else {
        // Tentar buscar por email como fallback
        const fallbackClient = updatedClients.find(
          (client) =>
            client.email.toLowerCase() === formData.email!.toLowerCase()
        );

        if (fallbackClient) {
          // Salvar no localStorage
          localStorage.setItem("clientId", fallbackClient.id || "");
          localStorage.setItem("clientName", fallbackClient.name);
          localStorage.setItem("clientCpf", fallbackClient.cpf);
          localStorage.setItem("deskId", selectedDesk);

          // Salvar mesa no localStorage
          const selectedDeskObj = desks.find((d) => d.id === selectedDesk);
          if (selectedDeskObj) {
            localStorage.setItem("deskCode", selectedDeskObj.deskCode);
          }

          // Atualizar lista local
          setClients(updatedClients);

          // Redirecionar
          navigate("/cardapio");
        } else {
          throw new Error(
            "Cliente criado mas não foi possível recuperar os dados. Tente fazer login manualmente."
          );
        }
      }
    } catch (err: any) {
      // Verificar se é erro 409 (conflito - já existe)
      if (err.response?.status === 409) {
        setError("CPF ou e-mail já cadastrado. Tente fazer login.");
      } else if (err.response?.status === 400) {
        setError("Dados inválidos. Verifique as informações fornecidas.");
      } else {
        setError(err.message || "Erro ao cadastrar");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setLoginData({ cpf: "", password: "" }); // Mudado de id para cpf
    setFormData({
      name: "",
      email: "",
      password: "",
      cpf: "",
      phoneNumber: "",
      address: "",
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">
            {isRegister ? "Criar Conta" : "Faça seu Login"}
          </h1>
          <p className="login-subtitle">
            {isRegister
              ? "Preencha os dados para criar sua conta"
              : "Entre com seu CPF e senha"}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form
          onSubmit={isRegister ? handleSubmitRegister : handleSubmitLogin}
          className="login-form"
        >
          {/* Seleção de Mesa (comum para ambos os modos) */}
          <div className="form-group">
            <label htmlFor="desk" className="form-label">
              Mesa
            </label>
            <select
              id="desk"
              value={selectedDesk}
              onChange={handleDeskChange}
              className="form-select"
              required
            >
              <option value="">Selecione uma mesa</option>
              {desks.map((desk) => (
                <option key={desk.id} value={desk.id}>
                  Mesa {desk.deskCode} ({desk.seats} lugares)
                </option>
              ))}
            </select>
          </div>

          {isRegister ? (
            // Formulário de Cadastro
            <>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Crie uma senha segura"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cpf" className="form-label">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="000.000.000-00"
                  required
                />
                <small className="form-hint">
                  Digite apenas números ou com pontos e traço
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber" className="form-label">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Endereço
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Digite seu endereço completo"
                  required
                />
              </div>
            </>
          ) : (
            // Formulário de Login
            <>
              <div className="form-group">
                <label htmlFor="cpf" className="form-label">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={loginData.cpf}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Digite seu CPF"
                  required
                />
                <small className="form-hint">Use o mesmo CPF cadastrado</small>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">Carregando...</span>
            ) : isRegister ? (
              "Criar Conta"
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="toggle-mode">
          <p>
            {isRegister ? "Já tem uma conta?" : "Ainda não tem conta?"}
            <button
              type="button"
              className="toggle-button"
              onClick={toggleMode}
            >
              {isRegister ? "Faça login" : "Crie uma conta"}
            </button>
          </p>
        </div>

        <div className="login-footer">
          <p className="footer-text">
            Ao continuar, você concorda com nossos{" "}
            <a href="/terms" className="footer-link">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="/privacy" className="footer-link">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
