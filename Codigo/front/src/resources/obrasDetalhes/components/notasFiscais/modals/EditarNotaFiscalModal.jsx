import { useContext, useRef } from 'react';

import { useNotasFiscaisMutations, useNotaFiscalDetalhes } from '../../../hooks/useNotasFiscais';
import Modal from '../../../../../components/layout/Modal';
import FormularioNotaFiscal from '../FormularioNotaFiscal';
import { useNotasFiscaisContext } from '../../../hooks/useNotasFiscaisContext';
import { useParams } from 'react-router-dom';

const EditarNotaFiscalModal = () => {
  const { modalType, notaFiscalInfo, closeAllModals } = useNotasFiscaisContext();
  const formRef = useRef(null);

  const { id } = useParams();
  const obraId = Number(id);

  const { updateMutation } = useNotasFiscaisMutations(obraId);

  const { data: notaFiscalCompleta, isLoading } = useNotaFiscalDetalhes(
    modalType === 'EDITAR_NF' ? notaFiscalInfo?.id : null
  );

  if (modalType !== 'EDITAR_NF') {
    return null;
  }

  const handleSave = () => {
    if (formRef.current) {
      formRef.current.salvarFormulario();
    }
  };

  const handleSaveNotaFiscal = (notaFiscalAtualizada) => {
    updateMutation.mutate(
      { id: notaFiscalInfo.id, data: notaFiscalAtualizada },
      {
        onSuccess: () => {
          closeAllModals();
        },
        onError: (error) => {
          console.error('Erro ao atualizar nota fiscal:', error);
          alert('Erro ao atualizar nota fiscal. Verifique os dados e tente novamente.');
        }
      }
    );
  };

  const botaoSalvar = {
    color: "primary-button",
    texto: updateMutation.isPending ? "ATUALIZANDO..." : "ATUALIZAR NOTA",
    aoClicar: handleSave
  };

  return (
    <Modal
      isOpen={modalType === 'EDITAR_NF'}
      onClose={closeAllModals}
      title={`Editar Nota Fiscal: ${notaFiscalInfo?.numeroDocumento}`}
      botao={botaoSalvar}
      specificModal="modal-lancar-nf"
    >
      {isLoading ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>Carregando dados completos da nota...</p>
      ) : (
        <FormularioNotaFiscal
          ref={formRef}
          notaFiscal={notaFiscalCompleta}
          onSave={handleSaveNotaFiscal}
          isModal={true}
        />
      )}
    </Modal>
  );
};

export default EditarNotaFiscalModal;