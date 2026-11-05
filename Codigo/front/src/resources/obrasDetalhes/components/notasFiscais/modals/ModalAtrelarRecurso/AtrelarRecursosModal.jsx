import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../../../../../../components/layout/Modal';
import { useNotasFiscaisContext } from '../../../../hooks/useNotasFiscaisContext';
import { useObrasDetalhesContext } from '../../../../hooks/useObrasDetalhesContext'; // <- IMPORTAMOS O CONTEXTO CERTO
import ModalAtrelarRecursos from './ModalAtrelarRecursos'; 
import { useNotasFiscaisMutations, useItensNotaFiscal } from '../../../../hooks/useNotasFiscais'; 

const AtrelarRecursosModal = () => {
  // Tiramos "tarefas" daqui, pois ele não pertence ao contexto de Notas Fiscais
  const { modalType, notaFiscalInfo, closeAllModals } = useNotasFiscaisContext();
  
  // Puxamos as tarefas do contexto de detalhes da obra
  const { tarefas } = useObrasDetalhesContext();

  const { id } = useParams();
  const obraId = Number(id);
  
  const contentRef = useRef(null);
  const { atrelarRecursosMutation } = useNotasFiscaisMutations(obraId);

  // Agora, como o openAtrelarRecursosModal mandou a nota corretamente, isso vai funcionar!
  const { data: itens, isFetching } = useItensNotaFiscal(
    modalType === 'ATRELAR_RECURSOS' ? notaFiscalInfo?.id : null
  );
  console.log(itens)
  if (modalType !== 'ATRELAR_RECURSOS') return null;

  const handleSave = () => {
    if (!contentRef.current) return;
    const loteAlocacoes = contentRef.current.getAtrelamentos();

    if (loteAlocacoes.length === 0) {
      alert('Selecione pelo menos uma tarefa para atrelar um recurso.');
      return;
    }

    atrelarRecursosMutation.mutate(
      { notaFiscalId: notaFiscalInfo.id, lote: loteAlocacoes },
      { onSuccess: () => closeAllModals() }
    );
  };

  const botaoConcluido = {
    color: "primary-button",
    texto: atrelarRecursosMutation.isPending ? "SALVANDO..." : "SALVAR ALTERAÇÕES",
    aoClicar: handleSave
  };

  return (
    <Modal
      isOpen={modalType === 'ATRELAR_RECURSOS'}
      onClose={closeAllModals}
      title="Atrelar Recursos às Tarefas"
      botao={botaoConcluido}
      specificModal="modal-atrelar-recursos"
    >
      {isFetching ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>Carregando recursos...</p>
      ) : (
        <ModalAtrelarRecursos 
          ref={contentRef}
          itens={itens} 
          numeroNota={notaFiscalInfo?.numeroDocumento} 
          tarefas={tarefas} 
        />
      )}
    </Modal>
  );
};

export default AtrelarRecursosModal;