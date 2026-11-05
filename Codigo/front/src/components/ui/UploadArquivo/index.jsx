import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import './UploadArquivo.css';
import { extrairDadosDaNota } from '../../../services/notaFiscalOcrService';

const UploadArquivo = ({ onFileSelect, onDataExtracted }) => {
  const [dragActive, setDragActive] = useState(false);
  const [arquivo, setArquivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processarArquivo(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processarArquivo(e.target.files[0]);
    }
  };

  const processarArquivo = async (file) => {
    const extensao = file.name.split('.').pop().toLowerCase();
    
    if (extensao === 'pdf' || extensao === 'xml') {
      setArquivo(file);
      if (onFileSelect) onFileSelect(file);

      if (extensao === 'pdf' && onDataExtracted) {
        setLoading(true);
        try {
          const data = await extrairDadosDaNota(file);
          onDataExtracted(data);
        } catch (error) {
          console.error("Erro ao extrair dados da nota", error);
          const status = error?.response?.status;
          let mensagem = "Erro ao processar o PDF. Por favor, tente novamente.";
          if (status === 400) mensagem = "Não foi possível ler o arquivo enviado.";
          else if (status === 422) mensagem = "Não foi possível extrair o texto do PDF.";
          else if (status === 502 || status === 503) mensagem = "Serviço de OCR indisponível no momento. Tente novamente em instantes.";
          alert(mensagem);
        } finally {
          setLoading(false);
        }
      }
    } else {
      alert('Formato inválido! Por favor, selecione apenas arquivos PDF ou XML.');
    }
  };

  const removerArquivo = (e) => {
    e.stopPropagation(); 
    setArquivo(null);
    if (inputRef.current) inputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
    if (onDataExtracted) onDataExtracted(null);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="upload-container">
      {!arquivo ? (
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload size={40} color={dragActive ? "#D97706" : "#94A3B8"} />
          <p>Arraste um <strong>XML</strong> ou <strong>PDF</strong> ou clique para enviar</p>
          <input 
            ref={inputRef}
            type="file" 
            accept=".xml,.pdf,application/xml,text/xml,application/pdf" 
            onChange={handleChange}
            style={{ display: 'none' }} 
          />
        </div>
      ) : (
        <div className="arquivo-selecionado">
          <div className="arquivo-info">
            {loading ? (
              <Loader2 size={24} className="upload-spinner" />
            ) : (
              <FileText size={24} color="#D97706" />
            )}
            <span className="arquivo-nome" title={arquivo.name}>{arquivo.name}</span>
          </div>
          <button type="button" className="btn-remover-arquivo" onClick={removerArquivo} title="Remover arquivo" disabled={loading}>
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadArquivo;