import { useParams } from 'react-router-dom';
import ObrasHeader from '../../resources/obras/components/ObrasHeader';
import IconeClicavel from '../../components/ui/IconeClicavel';
import "./ObrasDetalhes.css"
import ObraResumo from './ObrasResumo';
import TarefasObra from './TarefasObras';
import { useState, useContext } from 'react';
import NotasFiscaisObras from './NotasFiscaisObras';
import { FileText, ListTree, MessageSquare, Plus } from 'lucide-react';
import { ObrasDetalhesProvider, ObrasDetalhesContext } from '../../resources/obrasDetalhes/contexts/ObrasDetalhesContext';
import ObrasModalManager from '../../resources/obrasDetalhes/components/modals/ObrasDetalhesModalManager';
import Botao from '../../components/ui/Botao';
import ChatModal from '../../components/ui/ChatModal';

import { useObraDetalhes } from '../../resources/obras/hooks/useObras';

const ObraDetalhesContent = () => {
    const { id } = useParams();
    const { openLancarNotaFiscalModal } = useContext(ObrasDetalhesContext);
    const [abaAtiva, setAbaAtiva] = useState('atividades');
    const [isChatOpen, setIsChatOpen] = useState(false);

    const { data: obra, isLoading, isError } = useObraDetalhes(id);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p>Carregando detalhes da obra...</p>
            </div>
        );
    }

    if (isError || !obra) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'red' }}>
                <p>Erro ao carregar a obra. Tente novamente.</p>
            </div>
        );
    }

    return (
        <>
            <section className='obras-detalhes-section'>
                <ObraResumo obra={obra} />

                <div className="obras-tabs-container">
                    <div className="obras-tabs-left">
                        <button
                            className={`obra-tab-btn ${abaAtiva === 'atividades' ? 'active' : ''}`}
                            onClick={() => setAbaAtiva('atividades')}
                        >
                            <ListTree size={18} />
                            Tarefas
                        </button>

                        <button
                            className={`obra-tab-btn ${abaAtiva === 'notas' ? 'active' : ''}`}
                            onClick={() => setAbaAtiva('notas')}
                        >
                            <FileText size={18} />
                            Notas Fiscais
                        </button>
                    </div>

                    {abaAtiva === 'notas' && (
                        <Botao color="primary-button" aoClicar={() => openLancarNotaFiscalModal(obra)}>
                            <Plus size={18} /> Lançar Nova Nota Fiscal
                        </Botao>
                    )}
                </div>

                <section className='container-fluxo'>
                    {abaAtiva === 'atividades' ? <TarefasObra obra={obra} /> : <NotasFiscaisObras obra={obra} />}
                </section>
            </section>

            <ObrasModalManager tarefas={[]} />

            <button
                className={`chat-fab ${isChatOpen ? 'active' : ''}`}
                onClick={() => setIsChatOpen(prev => !prev)}
                title="Chat com IA"
            >
                <MessageSquare size={32} />
            </button>

            <ChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                obraId={id}
                obraNome={obra?.nome}
            />
        </>
    );
};

const ObrasDetalhes = () => {
    const { id } = useParams();
    const { data: obra, isLoading, isError } = useObraDetalhes(id);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p>Carregando detalhes da obra...</p>
            </div>
        );
    }

    if (isError || !obra) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'red' }}>
                <p>Erro ao carregar a obra. Tente novamente.</p>
            </div>
        );
    }

    // 3. Extraímos as tarefas vinculadas aos itens da obra (tratando a nomenclatura do DTO)
    const listaItens = obra.itensObra || obra.itens || [];
    const tarefasDaObra = listaItens.map(item => item.tarefa).filter(Boolean);

    return (
        // 4. Injetamos as tarefas reais no Contexto!
        <ObrasDetalhesProvider tarefas={tarefasDaObra}>
            <ObraDetalhesContent obra={obra} />
        </ObrasDetalhesProvider>
    );
}

export default ObrasDetalhes;