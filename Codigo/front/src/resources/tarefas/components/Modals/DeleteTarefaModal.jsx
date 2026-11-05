import Modal from '../../../../components/layout/Modal'; 
import { useTarefaContext } from '../../hooks/useTarefaContext';
import { useTarefaMutations } from '../../hooks/useTarefas';

const DeleteTarefaModal = () => {
    const { modalType, closeAllModals, selectedTarefa } = useTarefaContext();
    
    const { deleteMutation } = useTarefaMutations(); 

    const isOpen = modalType === 'DELETE';
    
    const isTarefaMae = selectedTarefa?.tarefaPaiId === null || selectedTarefa?.id_tarefa_pai === null;

    const handleDelete = () => {
        if (!selectedTarefa) return;

        const idTarefa = selectedTarefa.id || selectedTarefa.id_tarefa;

        deleteMutation.mutate(idTarefa, {
            onSuccess: () => {
                closeAllModals(); 
            }
        });
    };

    const botaoExcluirAtividade = {
        color: "delete-button", 
        texto: deleteMutation.isPending ? "EXCLUINDO..." : "SIM, EXCLUIR",
        aoClicar: handleDelete
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeAllModals}
            title={isTarefaMae ? "Excluir Atividade Mãe" : "Excluir Subatividade"}
            botao={botaoExcluirAtividade}
            specificModal=""
        >
            <div className="flex flex-col gap-4 text-center p-4">
                <p>
                    Tem certeza que deseja excluir a atividade <strong>{selectedTarefa?.codigo_tarefa} {selectedTarefa?.descricao}</strong>?
                </p>
                <p className="text-sm text-gray-500">
                    Esta ação não poderá ser desfeita. 
                    {isTarefaMae && " Atenção: Excluir uma Atividade Mãe pode afetar todas as subtarefas vinculadas a ela."}
                </p>
            </div>
        </Modal>
    );
};

export default DeleteTarefaModal;