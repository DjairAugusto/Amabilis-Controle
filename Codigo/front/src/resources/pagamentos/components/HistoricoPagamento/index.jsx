import './HistoricoPagamento.css'
import IconeClicavel from '../../../../components/ui/IconeClicavel';
import { Trash2 } from 'lucide-react';
import { formatarData, formatarMoeda } from '../../../../utils/formatters';
import { usePagamentoContext } from '../../hooks/usePagamentoContext';

const HistoricoPagamento = ({ card }) => {
    const { openModal } = usePagamentoContext();
    const hasHistory = card.pagamentos && card.pagamentos.length > 0;

    // 1. Lógica para separar os pagamentos por data
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas os dias

    const pagamentosRealizados = [];
    const pagamentosAgendados = [];
    let somaTotalRealizado = 0;

    if (hasHistory) {
        card.pagamentos.forEach((pagamento) => {
            // Conversão segura da data que vem do backend (evitando bugs de fuso)
            const partesData = pagamento.dataPagamento.split('T')[0].split('-');
            const dataPgto = new Date(partesData[0], partesData[1] - 1, partesData[2]);
            dataPgto.setHours(0, 0, 0, 0);

            if (dataPgto <= hoje) {
                pagamentosRealizados.push(pagamento);
                somaTotalRealizado += pagamento.valorPago; // Soma apenas os realizados
            } else {
                pagamentosAgendados.push(pagamento);
            }
        });
    }

    // Função auxiliar para renderizar as linhas da tabela repetindo o mesmo estilo
    const renderRow = (pagamento, index) => (
        <tr key={index}>
            <td>{formatarData(pagamento.dataPagamento)}</td>
            <td>
                <div className="valor-com-acao">
                    <span>{formatarMoeda(pagamento.valorPago)}</span>
                    <IconeClicavel
                        Icon={Trash2}
                        color="#CB5544"
                        size={16}
                        onClick={() => openModal('DELETE_PAGAMENTO', pagamento)}
                    />
                </div>
            </td>
        </tr>
    );

    return (
        <div className='historico-pagamentos'>
            <p className='historico-pagamentos-titulo' style={{ alignSelf: 'center', marginBottom: '10px' }}>Histórico de Pagamentos</p>
            
            {hasHistory ? (
                // 2. Tabela com limitação de altura e scroll
                <div className="tabela-scroll-container">
                    <table className="tabela-pagamentos">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Renderiza os Realizados primeiro */}
                            {pagamentosRealizados.map((pagamento, index) => renderRow(pagamento, `realizado-${index}`))}

                            {/* Divisória visual se houver agendamentos */}
                            {pagamentosAgendados.length > 0 && (
                                <tr>
                                    <td colSpan="2" className="tabela-divisor">
                                        Lançamentos Agendados
                                    </td>
                                </tr>
                            )}

                            {/* Renderiza os Agendados depois */}
                            {pagamentosAgendados.map((pagamento, index) => renderRow(pagamento, `agendado-${index}`))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='no-payment-history'>
                    <p>Nenhum Pagamento Registrado</p>
                </div>
            )}

            <div className='historico-pagamentos-footer'>
                <p>Total Pago (Realizado):</p>
                {/* 3. Mostra apenas a soma dos que já passaram da data */}
                <p>{formatarMoeda(somaTotalRealizado)}</p>
            </div>
        </div>
    )
}

export default HistoricoPagamento;