import { X } from 'lucide-react';
import './Modal.css'
import IconeClicavel from '../../ui/IconeClicavel';
import Botao from '../../ui/Botao';
import { useState } from 'react';
import { useEffect } from 'react';


const Modal = ({ isOpen, onClose, title, children, botao, specificModal }) => {

    const [visible, setVisible] = useState(isOpen);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
    if (isOpen) {
        setVisible(true);
        setShouldAnimate(false);
        setTimeout(() => {
            setShouldAnimate(true);
        }, 10);
    } else {
        setShouldAnimate(false);
        setTimeout(() => setVisible(false), 300);
    }
}, [isOpen]);

    if (!visible) return null;

    return (
        <div className={`modal-overlay ${shouldAnimate ? 'open' : ''}`} onClick={onClose}>
            <div className={`modal-content ${shouldAnimate ? 'open' : ''} ${specificModal}`} onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h2>{title}</h2>
                    <IconeClicavel Icon={X} color="grey" onClick={onClose} size={24} />
                </div>
                <div className='modal-body'>
                    {children}
                </div>
                <div className='modal-footer'>
                    <Botao color={botao.color} aoClicar={botao.aoClicar}>
                        {botao.texto}
                    </Botao>
                </div>
            </div>
        </div>
    )

}

export default Modal;