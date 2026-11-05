import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import './ModalAtrelarRecursos.css';

const ModalAtrelarRecursos = forwardRef(({ itens, numeroNota, tarefas }, ref) => {
  const [vincularEstado, setVincularEstado] = useState([]);

  useEffect(() => {
    if (itens && Array.isArray(itens)) {
      setVincularEstado(
        itens.map(item => ({
          itemNotaFiscalId: item.id,
          descricao: item.recurso?.descricao || 'Sem descrição',
          tipo: item.recurso?.tipoRecurso || '-',
          tarefaId: item.tarefaId !== null && item.tarefaId !== undefined ? String(item.tarefaId) : '' 
        }))
      );
    } else {
      setVincularEstado([]);
    }
  }, [itens]);

  const handleSelectTarefa = (itemNotaFiscalId, tarefaId) => {
    setVincularEstado(prev =>
      prev.map(item =>
        item.itemNotaFiscalId === itemNotaFiscalId
          ? { ...item, tarefaId: tarefaId }
          : item
      )
    );
  };

  useImperativeHandle(ref, () => ({
    getAtrelamentos: () => {
      // Nota: Mantemos o filtro para enviar apenas os que têm tarefa preenchida,
      // ou você pode alterar se o back-end aceitar o envio de desvinculações.
      return vincularEstado
        .filter(item => item.tarefaId !== '')
        .map(item => ({
          itemNotaFiscalId: item.itemNotaFiscalId,
          tarefaId: Number(item.tarefaId)
        }));
    }
  }));

  return (
    <div className="container-modal-atrelar-recursos">
      <div className="header-atrelar-recursos">
        <p>Número da NF: <strong>{numeroNota}</strong></p>
      </div>

      <div className="recursos-atrelar">
        {vincularEstado.length > 0 ? (
          vincularEstado.map((item) => (
            <div key={item.itemNotaFiscalId} className="recurso-atrelar-item">
              <div className="recurso-info">
                <span className="recurso-desc" title={item.descricao}>
                  {item.descricao}
                </span>
                <span className="recurso-tipo">{item.tipo.substring(0, 3).toUpperCase()}</span>
              </div>
              
              <select
                value={item.tarefaId} // 👈 O select vai carregar automaticamente a tarefa correta
                onChange={(e) => handleSelectTarefa(item.itemNotaFiscalId, e.target.value)}
                className="select-tarefa"
              >
                <option value="">Selecione a Atividade da Obra...</option>
                {tarefas?.map((tarefa) => (
                  <option key={tarefa.id} value={tarefa.id}>
                    {tarefa.codigoTarefa} - {tarefa.descricao}
                  </option>
                ))}
              </select>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>
            Nenhum item encontrado nesta nota fiscal.
          </p>
        )}
      </div>
    </div>
  );
});

export default ModalAtrelarRecursos;