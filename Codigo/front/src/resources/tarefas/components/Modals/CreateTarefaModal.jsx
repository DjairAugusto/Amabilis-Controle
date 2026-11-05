import { useState } from 'react';
import Modal from '../../../../components/layout/Modal'; 
import Input from '../../../../components/ui/Input';
import Dropdown from '../../../../components/ui/Dropdown';
import { UNIDADES_MEDIDA } from '../../../../data/unidadesDeMedida';
import { useTarefaMutations } from '../../hooks/useTarefas';
import { useTarefaContext } from '../../hooks/useTarefaContext';

const CreateTarefaModal = () => {
    const {modalType, closeAllModals, parentId} = useTarefaContext();

    const {createMutation} = useTarefaMutations();

    const [descricao, setDescricao] = useState('');
    const [tipoTarefa, setTipoTarefa] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');

    const isOpen = modalType === 'CREATE';
    
    const isTarefaMae = parentId === null;

    const handleClose = () => {
        setDescricao('');
        setTipoTarefa('');
        setUnidadeMedida('');
        closeAllModals(); 
    };

    const handleSave = () => {
        if (!descricao.trim()) return; 

        const novaTarefa = {
            descricao: descricao,
            tarefaPaiId: parentId,
            unidadeMedida: isTarefaMae ? null : unidadeMedida,
            tipoTarefa: isTarefaMae ? tipoTarefa : null
        };

        createMutation.mutate(novaTarefa, {
            onSuccess: () => {
                handleClose(); 
            }
        });
    };

    const botaoCriarAtividade = {
        color: "primary-button",
        texto: createMutation.isPending ? "SALVANDO..." : "CADASTRAR",
        aoClicar: handleSave
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isTarefaMae ? "Nova Atividade Mãe" : "Criar Subatividade"}
            botao={botaoCriarAtividade}
            specificModal=""
        >
            <Input
                label="Nome"
                typeInput="text"
                placeholder={isTarefaMae ? "Ex: Fundação" : "Ex: Estaca Trado"}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}    
            />
            
            {isTarefaMae ? (
                <Dropdown
                    label="Tipo de Atividade"
                    opcoes={['DIRETA', 'INDIRETA']}
                    placeholder="Tipo"
                    onSelect={(valor) => setTipoTarefa(valor)}
                    valorDrop={tipoTarefa}
                />
            ) : (
                <Dropdown
                    label="Unidade de Medida"
                    opcoes={UNIDADES_MEDIDA}
                    placeholder="UM"
                    onSelect={(valor) => setUnidadeMedida(valor)}
                    valorDrop={unidadeMedida}
                />
            )}
        </Modal>
    );
}

export default CreateTarefaModal;