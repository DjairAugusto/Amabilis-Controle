import { Plus, Search } from "lucide-react";
import Botao from "../../../../components/ui/Botao"
import { useTarefaContext } from "../../hooks/useTarefaContext";
import Input from "../../../../components/ui/Input";
import './TarefaHeader.css'
import SearchBar from "../../../../components/ui/SearchBar";

const TarefaHeader = () => {

    const { expandirTudo, recolherTudo, openCreateModal, searchTerm, setSearchTerm } = useTarefaContext();

    return (
        <div className='tarefas-header'>
            <div className='tarefas-header-texto'>
                <h1 className='tarefas-titulo'>Gestão de Tarefas</h1>
                <p className='tarefas-subtitulo'>Cadastro hierárquico de Tarefas Mãe, Tarefas e Subtarefas</p>
                <SearchBar 
                    placeholder="Busque uma Tarefa Específica"
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='tarefas-header-botoes'>
                <Botao color="secondary-button" aoClicar={expandirTudo}>Expandir Tudo</Botao>
                <Botao color="secondary-button" aoClicar={recolherTudo}>Recolher Tudo</Botao>
                <Botao color="primary-button" aoClicar={() => openCreateModal()}>
                    <Plus /> Nova Tarefa
                </Botao>
            </div>
        </div>
    )
}

export default TarefaHeader