import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFornecedores } from '../../hooks/useFornecedores'
import '../../../recursos/components/RecursoAutocomplete/RecursoAutocomplete.css'; 
import SearchBar from '../../../../components/ui/SearchBar';

const FornecedorAutocomplete = ({ onSelectFornecedor, valorInicial = '' }) => {
    const { data: fornecedores, isLoading } = useFornecedores();
    
    const [searchTerm, setSearchTerm] = useState(valorInicial);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});

    useEffect(() => {
        setSearchTerm(valorInicial);
    }, [valorInicial]);

    // Filtra pelo Nome Fantasia, Razão Social ou Documento (CNPJ)
    const filteredFornecedores = fornecedores?.filter(f => 
        f.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.documento?.includes(searchTerm)
    ) || [];

    const updatePosition = () => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: 'absolute',
                top: `${rect.bottom + window.scrollY + 4}px`, 
                left: `${rect.left + window.scrollX}px`,
                width: `${rect.width}px`,
                zIndex: 99999,
            });
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (!isOpen) setIsOpen(true);
    };

    useEffect(() => {
        const handleScrollOrClickOutside = (event) => {
            const isOutsideWrapper = wrapperRef.current && !wrapperRef.current.contains(event.target);
            const isOutsidePortal = !event.target.closest('.autocomplete-dropdown-portal');

            if (isOpen && isOutsideWrapper && isOutsidePortal) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            updatePosition(); 
            window.addEventListener('scroll', handleScrollOrClickOutside, true); 
            window.addEventListener('mousedown', handleScrollOrClickOutside);
            window.addEventListener('resize', updatePosition); 
        }

        return () => {
            window.removeEventListener('scroll', handleScrollOrClickOutside, true);
            window.removeEventListener('mousedown', handleScrollOrClickOutside);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen]);

    const handleSelect = (fornecedor) => {
        onSelectFornecedor(fornecedor); 
        setSearchTerm(fornecedor.nomeFantasia);        
        setIsOpen(false);       
    };

    return (
        <div className="recurso-autocomplete-wrapper" ref={wrapperRef}>
            <SearchBar 
                placeholder="Buscar fornecedor por Razão Social ou CNPJ..." 
                value={searchTerm} 
                onChange={handleInputChange} 
            />
            
            {isOpen && searchTerm && createPortal(
                <div className="autocomplete-dropdown-portal" style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
                    {isLoading ? (
                        <div className="autocomplete-item empty">Carregando fornecedores...</div>
                    ) : filteredFornecedores.length > 0 ? (
                        filteredFornecedores.map(fornecedor => (
                            <div 
                                key={fornecedor.id} 
                                className="autocomplete-item"
                                onClick={() => handleSelect(fornecedor)}
                            >
                                <div className="autocomplete-item-info">
                                    <span className="recurso-nome">{fornecedor.nomeFantasia}</span>
                                    <span className="recurso-badge">CNPJ: {fornecedor.documento}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="autocomplete-item empty">Nenhum fornecedor encontrado.</div>
                    )}
                </div>,
                document.body
            )}
        </div>
    )
}

export default FornecedorAutocomplete;