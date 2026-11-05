import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import SearchBar from '../../../../components/ui/SearchBar'; 
import { useRecursosLista } from '../../hooks/useRecursos';
import './RecursoAutocomplete.css';

const RecursoAutocomplete = ({ onSelectRecurso }) => {
    const { data: recursos, isLoading } = useRecursosLista();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    
    const [dropdownStyle, setDropdownStyle] = useState({});

    const filteredRecursos = recursos?.filter(r => 
        r.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.codigoHierarquico?.toLowerCase().includes(searchTerm.toLowerCase())
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
            const target = event.target;
            if (!target || typeof target.closest !== 'function') {
                if (event.type === 'scroll') setIsOpen(false);
                return;
            }

            const isOutsideWrapper = wrapperRef.current && !wrapperRef.current.contains(target);
            const isOutsidePortal = !target.closest('.autocomplete-dropdown-portal');

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

    const handleSelect = (recurso) => {
        onSelectRecurso(recurso); 
        setSearchTerm('');        
        setIsOpen(false);       
    };

    return (
        <div className="recurso-autocomplete-wrapper" ref={wrapperRef}>
            <SearchBar 
                placeholder="Buscar recurso por nome ou tipo..." 
                value={searchTerm} 
                onChange={handleInputChange} 
            />
            
            {isOpen && searchTerm && createPortal(
                <div className="autocomplete-dropdown-portal" style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
                    {isLoading ? (
                        <div className="autocomplete-item empty">Carregando catálogo...</div>
                    ) : filteredRecursos.length > 0 ? (
                        filteredRecursos.map(recurso => (
                            <div 
                                key={recurso.id} 
                                className="autocomplete-item"
                                onClick={() => handleSelect(recurso)}
                            >
                                <div className="autocomplete-item-info">
                                    <div className='autocomplete-item-text'>
                                        <span className="recurso-nome">{recurso.codigoHierarquico}</span>
                                        <span className="recurso-nome">{recurso.descricao}</span>
                                    </div>
                                    <span className="recurso-badge">{recurso.tipoRecurso || recurso.tipo}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="autocomplete-item empty">Nenhum recurso encontrado.</div>
                    )}
                </div>,
                document.body
            )}
        </div>
    )
}

export default RecursoAutocomplete;