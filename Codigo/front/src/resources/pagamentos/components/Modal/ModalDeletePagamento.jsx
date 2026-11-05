import Modal from "../../../../components/layout/Modal";
import { usePagamentoContext } from "../../hooks/usePagamentoContext";
import { formatarMoeda } from "../../../../utils/formatters"
import { usePagamentoMutations } from "../../hooks/usePagamentos";



const DeletePagamentoModal = () => {
    const { modalType, closeAllModals, pagamentoSelecionado } = usePagamentoContext();
    
    const { deleteMutation } = usePagamentoMutations(); 
    
    const isOpen = modalType === 'DELETE_PAGAMENTO';

    const handleDelete = () => {
        if (!pagamentoSelecionado) return;
        
        deleteMutation.mutate(pagamentoSelecionado.id, {
            onSuccess: () => {
                closeAllModals(); 
            },
            onError: (error) => {
                console.error("Erro ao deletar pagamento:", error);
                alert("Não foi possível excluir o pagamento.");
            }
        });
    };

    const botaoExcluir = {
        color: "delete-button",
        texto: deleteMutation.isPending ? "EXCLUINDO..." : "SIM, EXCLUIR",
        aoClicar: handleDelete
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeAllModals}
            title="Excluir Pagamento"
            botao={botaoExcluir}
            specificModal=""
        >
            <div className="flex flex-col gap-4 text-center p-4">
                <p>
                    Tem certeza que deseja excluir o pagamento de <strong>{pagamentoSelecionado ? formatarMoeda(pagamentoSelecionado.valorPago) : ''}</strong>?
                </p>
                <p className="text-sm text-gray-500">
                    Esta ação não poderá ser desfeita e o saldo da Nota Fiscal será recalculado.
                </p>
            </div>
        </Modal>
    )
}

export default DeletePagamentoModal;