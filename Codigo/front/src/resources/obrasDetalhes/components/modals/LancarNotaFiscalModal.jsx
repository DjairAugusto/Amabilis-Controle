import { useContext, useRef } from 'react';
import Modal from '../../../../components/layout/Modal';
import FormularioNotaFiscal from '../notasFiscais/FormularioNotaFiscal';
import { ObrasDetalhesContext } from '../../contexts/ObrasDetalhesContext';

// 1. Importar o novo hook em vez da API manual
import { useNotasFiscaisMutations } from '../../hooks/useNotasFiscais'; 

const LancarNotaFiscalModal = () => {
  // 2. Trazer a obraInfo real do contexto
  const { modalType, closeAllModals, obraInfo } = useContext(ObrasDetalhesContext);
  const formRef = useRef(null);

  // 3. Instanciar a mutação passando o ID da obra
  const { createMutation } = useNotasFiscaisMutations(obraInfo?.id);

  if (modalType !== 'LANCAR_NF') {
    return null;
  }

  const handleSave = () => {
    if (formRef.current) {
      formRef.current.salvarFormulario();
    }
  };

  const handleSaveNotaFiscal = (notaFiscal) => {
    // 4. Usar o mutate em vez do try/catch manual
    createMutation.mutate(notaFiscal, {
      onSuccess: () => {
        closeAllModals();
      },
      onError: (error) => {
        console.error('Erro ao criar nota fiscal:', error);
        alert('Erro ao lançar nota fiscal. Verifique os dados e tente novamente.');
      }
    });
  };

  const botaoSalvar = {
    color: "primary-button",
    texto: createMutation.isPending ? "LANÇANDO..." : "LANÇAR NOTA",
    aoClicar: handleSave
  };

  return (
    <Modal
      isOpen={modalType === 'LANCAR_NF'}
      onClose={closeAllModals}
      title={`Lançar Nota Fiscal`} 
      botao={botaoSalvar}
      specificModal="modal-lancar-nf"
    >
      <FormularioNotaFiscal 
        ref={formRef}
        onSave={handleSaveNotaFiscal}
        isModal={true}
      />
    </Modal>
  );
};

export default LancarNotaFiscalModal;