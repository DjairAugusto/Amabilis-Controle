import { Edit, Trash2, Link } from 'lucide-react';
import './LinhaNotaFiscal.css';
import IconeClicavel from '../../../../../components/ui/IconeClicavel';
import { useNotasFiscaisContext } from '../../../hooks/useNotasFiscaisContext';
import { MAPA_STATUS_FRONTEND } from '../../../../../resources/pagamentos/utils/statusNotaFiscal';

const LinhaNotaFiscal = ({ notaFiscal }) => {
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);
  };

  const { 
    openDeleteNFModal, 
    openEditarNotaFiscalModal, 
    openAtrelarRecursosModal 
  } = useNotasFiscaisContext();

  const nomeFornecedor = notaFiscal.fornecedor?.nomeFantasia || notaFiscal.fornecedor?.razaoSocial || 'Sem Fornecedor';
  const classeStatus = (notaFiscal.statusNotaFiscal || '').toLowerCase();
  const labelStatus = MAPA_STATUS_FRONTEND[notaFiscal.statusNotaFiscal] || notaFiscal.statusNotaFiscal || '-';

  return (
    <tr className="linha-nota-fiscal">
      <td>{notaFiscal.numeroDocumento}</td> 
      <td>{nomeFornecedor}</td>
      <td>{notaFiscal.dataEmissao}</td>
      <td>{notaFiscal.dataVencimento}</td>
      <td>{formatarMoeda(notaFiscal.valorTotal)}</td>
      <td>
        <span className={`status-badge-nf ${classeStatus}`}>
          {labelStatus}
        </span>
      </td>
      <td className="acoes-col">
        <IconeClicavel
          Icon={Link}
          color="#000000"
          size={18}
          // Chamamos a função do contexto passando a nota atual!
          onClick={() => openAtrelarRecursosModal(notaFiscal)}
          title="Atrelar recursos às atividades"
        />
        <IconeClicavel
          Icon={Edit}
          color="#000000"
          size={18}
          // Chamamos a função do contexto passando a nota atual!
          onClick={() => openEditarNotaFiscalModal(notaFiscal)}
          title="Editar nota fiscal"
        />
        <IconeClicavel
          Icon={Trash2}
          color="#CB5544"
          size={18}
          onClick={() => openDeleteNFModal(notaFiscal)}
          title="Deletar nota fiscal"
        />
      </td>
    </tr>
  );
};

export default LinhaNotaFiscal;