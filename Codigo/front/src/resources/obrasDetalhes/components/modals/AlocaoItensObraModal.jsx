import { useEffect, useState } from "react";
import Modal from "../../../../components/layout/Modal";
import { useItensObraMutations } from "../../hooks/useItensObra";
import { useObrasDetalhesContext } from "../../hooks/useObrasDetalhesContext";
import { useTarefas } from "../../../../resources/tarefas/hooks/useTarefas"; // Hook de buscar tarefas globais
import TarefaSelectNode from "../tarefas/TarefaSelectNode"; // Ajuste o caminho se necessário

const AlocacaoItensObraModal = () => {
    const { modalType, closeAllModals, obraInfo } = useObrasDetalhesContext();
    const { atribuirTarefasMutation } = useItensObraMutations();
    
    const isOpen = modalType === 'ALOCACAO_ITENS';

    const [tarefasSelecionadas, setTarefasSelecionadas] = useState([]);

    // 1. Busca o catálogo global apenas quando o modal for aberto (o React Query lida com o cache)
    const { data: arvoreTarefas, isLoading } = useTarefas();

    // 2. Preenche os checkboxes com o que a obra já tem
    useEffect(() => {
        if (isOpen && obraInfo?.itensObra) {
            const idsPreSelecionados = obraInfo.itensObra
                .filter(item => item.tarefa != null)
                .map(item => item.tarefa.id);
            setTarefasSelecionadas(idsPreSelecionados);
        }
    }, [isOpen, obraInfo]);

    // 3. Lida com os cliques nos checkboxes
    const handleToggleSelect = (tarefaId, isChecking) => {
        setTarefasSelecionadas(prevSelecionadas => {
            let novaSelecao = [...prevSelecionadas];
            if (isChecking) {
                if (!novaSelecao.includes(tarefaId)) novaSelecao.push(tarefaId);
            } else {
                novaSelecao = novaSelecao.filter(id => id !== tarefaId);
            }
            return novaSelecao;
        });
    };

    const handleClose = () => {
        setTarefasSelecionadas([]); // Limpa para a próxima abertura
        closeAllModals();
    }

    const handleSave = () => {
        if (!obraInfo) return;

        const payload = {
            tarefaIds: tarefasSelecionadas
        };

        // 4. Dispara a mutação do seu novo hook isolado!
        atribuirTarefasMutation.mutate(
            { obraId: obraInfo.id, data: payload }, // Atenção: hook configurado p/ esperar "obraId"
            {
                onSuccess: () => {
                    handleClose();
                }
            }
        );
    }

    const botaoAtribuirTarefas = {
        color: "primary-button",
        texto: atribuirTarefasMutation.isPending ? "SALVANDO..." : "SALVAR ALTERAÇÕES",
        aoClicar: handleSave
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Vincular Tarefas"
            botao={botaoAtribuirTarefas}
            specificModal={'modal-vincular-tarefas'}
        >
            <div className="modal-tree-container" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div style={{ textAlign: 'center', color: '#64748B' }}>
                    {isLoading ? (
                        <p style={{ padding: '20px' }}>Carregando catálogo global de tarefas...</p>
                    ) : (
                        <div className="modal-tree-container" style={{ maxHeight: '60vh', overflowY: 'auto', textAlign: 'left' }}>
                            {arvoreTarefas?.map((tarefa) => (
                                <TarefaSelectNode
                                    key={tarefa.id}
                                    node={tarefa}
                                    tarefasSelecionadas={tarefasSelecionadas}
                                    handleToggleSelect={handleToggleSelect}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default AlocacaoItensObraModal;