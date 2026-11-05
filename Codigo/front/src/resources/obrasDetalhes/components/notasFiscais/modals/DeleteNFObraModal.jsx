
// 🔴 1. Importamos o useParams para ler a URL
import { useParams } from "react-router-dom"; 
import { useNotasFiscaisContext } from "../../../hooks/useNotasFiscaisContext";
import { useNotasFiscaisMutations } from "../../../hooks/useNotasFiscais";
import Modal from "../../../../../components/layout/Modal";

const DeletarNotaFiscalModal = () => {
    const { modalType, closeAllModals, notaFiscalInfo } = useNotasFiscaisContext();
    
    const { id } = useParams();
    const obraId = Number(id); 

    const { deleteMutation } = useNotasFiscaisMutations(obraId);

    const isOpen = modalType === 'DELETE_NF';

    const handleDelete = () => {
        if (!notaFiscalInfo) return;

        deleteMutation.mutate(notaFiscalInfo.id, {
            onSuccess: () => {
                closeAllModals();
            },
            onError: (error) => {
                console.error("Erro ao excluir nota fiscal:", error);
                alert("Não foi possível excluir a nota fiscal.");
            }
        });
    };

    const botaoExcluirNF = {
        color: "delete-button",
        texto: deleteMutation.isPending ? "EXCLUINDO..." : "SIM, EXCLUIR",
        aoClicar: handleDelete
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeAllModals}
            title="Excluir Nota Fiscal"
            botao={botaoExcluirNF}
            specificModal="modal-excluir-nf"
        >
            <div className="flex flex-col gap-4 text-center p-4">
                <p>
                    Tem certeza que deseja excluir a Nota Fiscal nº <strong>{notaFiscalInfo?.numeroDocumento}</strong>?
                </p>
                <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
                    Esta ação removerá permanentemente a nota e todos os seus itens associados.
                </p>
            </div>
        </Modal>
    );
};

export default DeletarNotaFiscalModal;