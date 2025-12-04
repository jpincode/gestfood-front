import React, { useEffect, useState, useRef } from 'react';
import type { Product } from '../../../types/product';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../../services/product.service';
import Image from '../../../components/image/Image';
import './product.css';

interface ProductProps {
  // Additional props can be added here
};

const Producte = ({}: ProductProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    description: '',
    imagesNames: []
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar produtos ao montar o componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Recarregar a lista após exclusão
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      imagesNames: [...product.imagesNames]
    });
    setUploadedFiles([]); // Resetar arquivos carregados
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      price: 0,
      description: '',
      imagesNames: []
    });
    setUploadedFiles([]);
    setIsCreateModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Manipulação de upload de imagens
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB max
    );
    
    if (validFiles.length !== files.length) {
      alert('Alguns arquivos foram ignorados. Apenas imagens até 5MB são permitidas.');
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagesNames: prev.imagesNames.filter((_, i) => i !== index)
    }));
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      await createProduct(formData, uploadedFiles);
      setIsCreateModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert('Erro ao criar produto. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct?.id) return;
    
    setIsSubmitting(true);
    try {
      await updateProduct(currentProduct.id, formData, uploadedFiles);
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setUploadedFiles([]);
  };

  // Função para renderizar a imagem principal do produto
  const renderMainProductImage = (product: Product) => {
    if (product.imagesNames && product.imagesNames.length > 0) {
      return (
        <Image 
          fileName={product.imagesNames[0]} 
          alt={product.name}
          className="product-image"
        />
      );
    }
    
    return (
      <div className="no-image">
        📷
      </div>
    );
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
              <label htmlFor="name">Nome do Produto:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ex: Pizza Margherita"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Preço (R$):</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Descreva o produto..."
              />
            </div>

            <div className="form-group">
              <label>Imagens do Produto:</label>
              
              {/* Área de upload com drag and drop */}
              <div 
                className={`image-upload-container ${isDragging ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="image-upload-label">
                  <div className="image-upload-icon">📷</div>
                  <div className="image-upload-text">
                    Clique para selecionar ou arraste imagens aqui
                  </div>
                  <div className="image-upload-hint">
                    Formatos suportados: JPG, PNG, GIF • Máx: 5MB por imagem
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="image-upload-input"
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*"
                />
              </div>

              {/* Visualização de imagens existentes */}
              {formData.imagesNames.length > 0 && (
                <div className="uploaded-images" style={{ marginTop: 'var(--spacing-md)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                    Imagens existentes (clique em × para remover):
                  </p>
                  {formData.imagesNames.map((imageName, index) => (
                    <div key={`existing-${index}`} className="uploaded-image-item">
                      <Image 
                        fileName={imageName} 
                        alt={`Imagem ${index + 1} do produto`}
                        className="uploaded-image"
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeExistingImage(index)}
                        aria-label={`Remover imagem ${imageName}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Visualização de novas imagens carregadas */}
              {uploadedFiles.length > 0 && (
                <div className="uploaded-images">
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                    Novas imagens (clique em × para remover):
                  </p>
                  {uploadedFiles.map((file, index) => (
                    <div key={`new-${index}`} className="uploaded-image-item">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name}
                        className="uploaded-image"
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeUploadedFile(index)}
                        aria-label={`Remover imagem ${file.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--spacing-sm)' }}>
                <strong>Nota:</strong> Ao remover imagens existentes, elas serão excluídas permanentemente do servidor.
              </p>
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
      <div className="product-container">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-container">
      <div className="product-header">
        <h1>Produtos Cadastrados</h1>
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
          Cadastrar novo produto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍕</div>
          <p>Nenhum produto cadastrado.</p>
          <p className="text-muted">Clique no botão acima para adicionar seu primeiro produto.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                {renderMainProductImage(product)}
                {product.imagesNames && product.imagesNames.length > 1 && (
                  <div className="product-images-count">
                    +{product.imagesNames.length - 1}
                  </div>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">
                  R$ {product.price.toFixed(2)}
                </div>
                
                {product.imagesNames && product.imagesNames.length > 0 && (
                  <div className="product-images-preview">
                    {product.imagesNames.slice(0, 3).map((imageName, index) => (
                      <span key={index} className="image-tag" title={imageName}>
                        {imageName.length > 15 ? imageName.substring(0, 12) + '...' : imageName}
                      </span>
                    ))}
                    {product.imagesNames.length > 3 && (
                      <span className="image-tag">
                        +{product.imagesNames.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="product-actions">
                  <button 
                    className="btn-edit" 
                    onClick={() => handleEditClick(product)}
                    aria-label={`Editar produto ${product.name}`}
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
                    onClick={() => handleDelete(product.id!)}
                    aria-label={`Excluir produto ${product.name}`}
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
            </div>
          ))}
        </div>
      )}

      {renderModal(isCreateModalOpen, 'Cadastrar Novo Produto', handleSubmitCreate)}
      {renderModal(isEditModalOpen, 'Editar Produto', handleSubmitEdit)}
    </div>
  );
};

export default Producte;