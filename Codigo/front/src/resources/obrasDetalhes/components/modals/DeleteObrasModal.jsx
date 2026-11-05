import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/layout/Modal";
import { useObraMutations } from "../../../obras/hooks/useObras";
import { useObrasDetalhesContext } from "../../hooks/useObrasDetalhesContext"

const DeleteObraModal = () => {
    const { modalType, closeAllModals, obraInfo } = useObrasDetalhesContext();
    const { deleteMutation } = useObraMutations();
    const isOpen = modalType === 'DELETE'
    const navigate = useNavigate();


    const handleDelete = () => {
        if (!obraInfo) return;

        const obraId = obraInfo.id;
        
        deleteMutation.mutate(obraId, {
            onSuccess: () => {
                closeAllModals();
                navigate('/obras', { replace: true });
            }
        })

    };

    const botaoExcluirObra = {
        color: "delete-button",
        texto: deleteMutation.isPending ? "EXCLUINDO" : "SIM, EXCLUIR",
        aoClicar: handleDelete
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeAllModals}
            title="Excluir Obra:"
            botao={botaoExcluirObra}
            specificModal=""
        >
            <div className="flex flex-col gap-4 text-center p-4">
                <p>
                    Tem certeza que deseja excluir a Obra <strong>{obraInfo?.nome}</strong>?
                </p>
                <p className="text-sm text-gray-500">
                    Esta ação não poderá ser desfeita. 
                </p>
            </div>
        </Modal>
    )
}

export default DeleteObraModal