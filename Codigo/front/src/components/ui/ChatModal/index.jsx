import { useState, useRef, useEffect } from 'react';
import { X, SendHorizontal, Bot } from 'lucide-react';
import IconeClicavel from '../IconeClicavel';
import api from '../../../services/api';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose, obraId, obraNome }) => {
    const mensagemInicial = `Olá! Sou o Assistente Amabilis. Como posso te ajudar com a obra${obraNome ? ` "${obraNome}"` : ''}?`;

    const [mensagens, setMensagens] = useState([
        { role: 'assistant', content: mensagemInicial }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [visible, setVisible] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            setShouldAnimate(false);
            setTimeout(() => {
                setShouldAnimate(true);
                inputRef.current?.focus();
            }, 10);
        } else {
            setShouldAnimate(false);
            setTimeout(() => setVisible(false), 300);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensagens, isLoading]);

    const enviarMensagem = async () => {
        const texto = inputValue.trim();
        if (!texto || isLoading) return;

        setMensagens(prev => [...prev, { role: 'user', content: texto }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const { data } = await api.post(`/api/chat/obra/${obraId}`, { mensagem: texto });
            setMensagens(prev => [...prev, { role: 'assistant', content: data.resposta }]);
        } catch {
            setMensagens(prev => [...prev, {
                role: 'assistant',
                content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensagem();
        }
    };

    if (!visible) return null;

    return (
        <>
        <div className={`chat-modal-overlay ${shouldAnimate ? 'open' : ''}`} onClick={onClose} />
        <div className={`chat-widget-panel ${shouldAnimate ? 'open' : ''}`}>
            <div className="chat-modal-header">
                <div className="chat-modal-header-info">
                    <Bot size={20} />
                    <h2>Assistente Amabilis</h2>
                </div>
                <IconeClicavel Icon={X} color="grey" onClick={onClose} size={24} />
            </div>

            <div className="chat-modal-messages">
                {mensagens.map((msg, index) => (
                    <div key={index} className={`chat-bubble chat-bubble-${msg.role}`}>
                        <p>{msg.content}</p>
                    </div>
                ))}

                {isLoading && (
                    <div className="chat-bubble chat-bubble-assistant chat-bubble-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-modal-input-area">
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-input"
                    placeholder="Digite sua mensagem..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <button
                    className={`chat-send-btn ${!inputValue.trim() || isLoading ? 'disabled' : ''}`}
                    onClick={enviarMensagem}
                    disabled={isLoading || !inputValue.trim()}
                >
                    <SendHorizontal size={18} />
                </button>
            </div>
        </div>
        </>
    );
};

export default ChatModal;
