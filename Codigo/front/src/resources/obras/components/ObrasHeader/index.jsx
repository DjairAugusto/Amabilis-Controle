import "./ObrasHeader.css"
import SearchBar from "../../../../components/ui/SearchBar"
import Botao from "../../../../components/ui/Botao"
import { Plus } from "lucide-react"
import { useState } from "react"
import Modal from "../../../../components/layout/Modal"
import { ESTADOS_BRASIL } from "../../../../data/estadosBrasil"
import Input from "../../../../components/ui/Input"
import Dropdown from "../../../../components/ui/Dropdown"
import { useCep } from "../../../../hooks/useCep" 
import ModalCreateObra from "../Modals/ModalCreateObra"
import { useObraContext } from "../../hooks/useObraContext"

const ObrasHeader = () => {
    const [modalCreateObraIsOpen, setModalCreateObraIsOpen] = useState(false);
    
    // 🟢 1. Extraímos o setPaginaAtual do contexto
    const { searchTerm, setSearchTerm, setPaginaAtual } = useObraContext(); 

    // 🟢 2. Criamos a função que atualiza o texto e reseta a página
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPaginaAtual(0);
    };

    return (
        <>
            <div className="obras-header">
                <div className='obras-header-texto'>
                    <h1 className='obras-titulo'>Gestão de Obras</h1>
                    <p className='obras-subtitulo'>Acompanhamento de Obras</p>
                    <SearchBar
                        placeholder="Busque uma Obra Específica"
                        value={searchTerm}
                        // 🟢 3. Usamos a nova função aqui
                        onChange={handleSearch} 
                    />
                </div>
                <div className='tarefas-header-botoes'>
                    <Botao color="primary-button" aoClicar={() => setModalCreateObraIsOpen(!modalCreateObraIsOpen)}>
                        <Plus /> Nova Obra
                    </Botao>
                </div>
            </div>

            <ModalCreateObra modalCreateObraIsOpen={modalCreateObraIsOpen} setModalCreateObraIsOpen={setModalCreateObraIsOpen}/>
        </>
    )
}

export default ObrasHeader