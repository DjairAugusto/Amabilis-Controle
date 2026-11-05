import Modal from '../../../../components/layout/Modal';
import { useFornecedorContext } from '../../hooks/useFornecedorContext';

const DeleteFornecedorModal = () => {
    const { isDeleteModalOpen, fecharModalDelete, selectedFornecedor, deleteMutation } = useFornecedorContext();

    const handleDelete = () => {
        if (!selectedFornecedor) return;

        const idFornecedor = selectedFornecedor.id;

        deleteMutation.mutate(idFornecedor, {
            onSuccess: () => {
                fecharModalDelete();
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
            isOpen={isDeleteModalOpen}
            onClose={fecharModalDelete}
            title="Excluir Fornecedor"
            botao={botaoExcluir}
            specificModal=""
        >
            <div className="flex flex-col gap-4 text-center p-4">
                <p>
                    Tem certeza que deseja excluir o fornecedor <strong>{selectedFornecedor?.nomeFantasia}</strong>?
                </p>
                <p className="text-sm text-gray-500">
                    Esta ação não poderá ser desfeita.
                </p>
            </div>
        </Modal>
    );
};

export default DeleteFornecedorModal;
