import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './Dropdown.css';

const Dropdown = ({ label, opcoes, placeholder, onSelect, valorDrop = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selecionado, setSelecionado] = useState(valorDrop);
    
    const triggerRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});

    const handleOpen = () => {
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: 'absolute',
                top: `${rect.bottom + window.scrollY + 4}px`, 
                left: `${rect.left + window.scrollX}px`,
                width: `${rect.width}px`,
                zIndex: 99999, 
            });
        }
        setIsOpen(!isOpen);
    };

    const handleSelecionar = (opcao) => {
        setSelecionado(opcao); 
        setIsOpen(false);      
        if (onSelect) {
            onSelect(opcao);   
        }
    };

    useEffect(() => {
        const handleScrollOrClickOutside = (e) => {
        
        if (!(e.target instanceof Element)) {
            if (isOpen) setIsOpen(false);
            return;
        }

        const isOutsideTrigger = triggerRef.current && !triggerRef.current.contains(e.target);
        const isOutsidePortal = !e.target.closest('.dropdown-menu-portal');

        if (isOpen && isOutsideTrigger && isOutsidePortal) {
            setIsOpen(false);
        }
    };

        if (isOpen) {
            window.addEventListener('scroll', handleScrollOrClickOutside, true); 
            window.addEventListener('mousedown', handleScrollOrClickOutside);
        }

        return () => {
            window.removeEventListener('scroll', handleScrollOrClickOutside, true);
            window.removeEventListener('mousedown', handleScrollOrClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        setSelecionado(valorDrop);
    }, [valorDrop]);

    return (
        <div className="dropdown-container">
            <label>{label}</label>
            
            <div 
                ref={triggerRef}
                className="dropdown-trigger" 
                onClick={handleOpen}
            >
                <span className={selecionado ? 'texto-preenchido' : 'texto-placeholder'}>
                    {selecionado || placeholder}
                </span>
                
                {isOpen ? <ChevronUp size={20} color="rgba(142, 142, 142, 0.72)" /> : <ChevronDown size={20} color="rgba(142, 142, 142, 0.72)" />}
            </div>

            {isOpen && createPortal(
                <ul className="dropdown-menu-portal" style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
                    {opcoes.map((opcao, index) => (
                        <li 
                            key={index} 
                            className="dropdown-item"
                            onClick={() => handleSelecionar(opcao)}
                        >
                            {opcao}
                        </li>
                    ))}
                </ul>,
                document.body
            )}
        </div>
    );
};

export default Dropdown;