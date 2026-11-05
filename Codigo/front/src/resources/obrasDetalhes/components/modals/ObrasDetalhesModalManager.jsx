import DeleteObraModal from "./DeleteObrasModal"
import EditObrasModal from "./EditaObrasModal"
import LancarNotaFiscalModal from "./LancarNotaFiscalModal"
import AlocacaoItensObraModal from "./AlocaoItensObraModal"

const ObrasModalManager = () => {
    return(
        <>
            <EditObrasModal />
            <DeleteObraModal />
            <LancarNotaFiscalModal />
            <AlocacaoItensObraModal />
        </>
    )
}

export default ObrasModalManager