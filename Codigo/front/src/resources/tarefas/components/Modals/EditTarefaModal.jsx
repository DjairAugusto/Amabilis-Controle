import { useState, useEffect } from 'react';
import Modal from '../../../../components/layout/Modal'; 
import Input from '../../../../components/ui/Input';
import Dropdown from '../../../../components/ui/Dropdown';
import { UNIDADES_MEDIDA } from '../../../../data/unidadesDeMedida';
import { useTarefaMutations } from '../../hooks/useTarefas';
import { useTarefaContext } from '../../hooks/useTarefaContext';

const EditTarefaModal = () => {
    const { modalType, closeAllModals, selectedTarefa } = useTarefaContext();
    
    const { updateMutation } = useTarefaMutations(); 

    const [descricao, setDescricao] = useState('');
    const [tipoTarefa, setTipoTarefa] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');

    const isOpen = modalType === 'EDIT';
    
    const isTarefaMae = selectedTarefa?.tarefaPaiId === null || selectedTarefa?.id_tarefa_pai === null;

    useEffect(() => {
        if (selectedTarefa && isOpen) {
            setDescricao(selectedTarefa.descricao || '');
            setTipoTarefa(selectedTarefa.tipoTarefa || selectedTarefa.tipo_tarefa || '');
            setUnidadeMedida(selectedTarefa.unidadeMedida || selectedTarefa.unidade_medida || '');
        }
    }, [selectedTarefa, isOpen]);

    const handleClose = () => {
        setDescricao('');
        setTipoTarefa('');
        setUnidadeMedida('');
        closeAllModals(); 
    };

    const handleSave = () => {
        if (!descricao.trim() || !selectedTarefa) return;

        const dadosAtualizados = {
            descricao: descricao,
            unidadeMedida: isTarefaMae ? null : unidadeMedida,
            tipoTarefa: isTarefaMae ? tipoTarefa : null
        };

        const idTarefa = selectedTarefa.id || selectedTarefa.id_tarefa;

        updateMutation.mutate(
            { id: idTarefa, data: dadosAtualizados }, 
            {
                onSuccess: () => {
                    handleClose();
                }
            }
        );
    };

    const botaoSalvarAtividade = {
        color: "primary-button",
        texto: updateMutation.isPending ? "SALVANDO..." : "SALVAR ALTERAÇÕES",
        aoClicar: handleSave
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isTarefaMae ? "Editar Atividade Mãe" : "Editar Subatividade"}
            botao={botaoSalvarAtividade}
            specificModal=""
        >
            <Input
                label="Nome"
                typeInput="text"
                placeholder="Descrição da tarefa"
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
};

export default EditTarefaModal;