import DeleteNFObraModal from "./DeleteNFObraModal";
import EditarNotaFiscalModal from "./EditarNotaFiscalModal";
import AtrelarRecursosModal from "./ModalAtrelarRecurso/AtrelarRecursosModal";

const ModalNfObrasManager = () => {
    return (
        <>
            <DeleteNFObraModal />
            <EditarNotaFiscalModal />
            <AtrelarRecursosModal />
        </>
    )
}

export default ModalNfObrasManager;