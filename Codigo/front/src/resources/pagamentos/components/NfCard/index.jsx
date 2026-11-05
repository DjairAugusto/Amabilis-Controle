import './NfCard.css'
import IconeClicavel from '../../../../components/ui/IconeClicavel'
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import Dropdown from '../../../../components/ui/Dropdown'
import { useState } from 'react'
import HistoricoPagamento from '../HistoricoPagamento'
import FormsLancarPagamento from '../FormsLancarPagamento'
import FormsPagamentoParcelado from '../FormsPagamentoParcelado'
import { OPCOES_STATUS_DROPDOWN, MAPA_STATUS_FRONTEND, MAPA_STATUS_BACKEND, STATUS_NF_BACKEND } from '../../utils/statusNotaFiscal'
import { formatarData, formatarMoeda } from '../../../../utils/formatters'
import { usePagamentoMutations } from '../../hooks/usePagamentos'
import Botao from '../../../../components/ui/Botao'

const NfCard = ({ card }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tipoForm, setTipoForm] = useState(null);

    const { updateStatusNfMutation } = usePagamentoMutations()

    const [statusLocal, setStatusLocal] = useState(card.statusNf);

    const handleStatusChange = (statusAmigavelClicado) => {
        const novoStatusBackend = MAPA_STATUS_BACKEND[statusAmigavelClicado];

        const statusAnterior = statusLocal;
        setStatusLocal(novoStatusBackend);
        updateStatusNfMutation.mutate(
            {
                id: card.id,
                data: { status: novoStatusBackend }
            },
            {
                onError: (error) => {
                    setStatusLocal(statusAnterior);
                    alert("Não foi possível alterar o status. A alteração visual foi desfeita.");
                }
            }
        );
    };

    const classeCorStatus = (statusLocal || '').toLowerCase();

    return (
        <div className='nf-card'>
            <div className={`nf-info ${isOpen ? 'is-open' : ''}`}>
                <div className='nf-card-top-left'>
                    <IconeClicavel
                        Icon={isOpen ? ChevronUp : ChevronDown}
                        color='grey'
                        size={20}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    <h2 className='nf-card-codigo'>{card.codigoNf}</h2>
                    <div className='nf-card-text'>
                        <h2>{card.nomeFornecedor}</h2>
                        <div className='nf-card-subtitulo'>
                            <p>{card.nomeObra} - </p>
                            <Calendar color='grey' size={14} />
                            <p>{formatarData(card.dataVencimento)}</p>
                        </div>
                    </div>
                </div>
                <div className='nf-card-top-right'>
                    <div className='nf-cards-values'>
                        <p>Pago / Total:</p>
                        <p>{formatarMoeda(card.valorTotalPago)} / {formatarMoeda(card.valorNota)}</p>
                    </div>
                    <div className='nf-cards-values'>
                        <p>Saldo: </p>
                        <p>{formatarMoeda(card.saldo)}</p>
                    </div>
                    <div className={`nf-cards-status-container ${classeCorStatus}`}>
                        <Dropdown
                            valorDrop={MAPA_STATUS_FRONTEND[statusLocal] || statusLocal}
                            placeholder={MAPA_STATUS_FRONTEND[card.statusNf] || card.statusNf}
                            opcoes={OPCOES_STATUS_DROPDOWN}
                            onSelect={handleStatusChange} />
                    </div>
                </div>
            </div>

            <div className={`pagamentos-animacao-wrapper ${isOpen ? 'is-open' : ''}`}>
                <div className="pagamentos-content">
                    <div className="pagamentos-padding-interno">
                        <HistoricoPagamento card={card} />
                        {card.statusNF === STATUS_NF_BACKEND.QUITADA ?
                            (
                                <div className="nota-quitada-mensagem">
                                    <p>✅ Esta Nota Fiscal já foi totalmente quitada.</p>
                                </div>
                            )
                            : (<div className='container-formularios-pagamento'>
                                {/* 3. Lógica de Renderização Dinâmica */}
                                {tipoForm === null ? (
                                    <div className='botoes-fluxo-pagamento'>
                                        <Botao color='primary-button' aoClicar={() => setTipoForm('individual')}>
                                            Lançar Pagamento Individual
                                        </Botao>
                                        <Botao color='primary-button' aoClicar={() => setTipoForm('parcelado')}>
                                            Lançar Pagamento Parcelado
                                        </Botao>
                                    </div>
                                ) : (
                                    <div className='form-ativo-container'>
                                        <div className='form-pagamento-header' >
                                            <h4 style={{ margin: 0 }}>
                                                {tipoForm === 'individual' ? 'Pagamento Individual' : 'Pagamento Parcelado'}
                                            </h4>
                                            <span
                                                onClick={() => setTipoForm(null)}
                                            >
                                                ✕ Voltar
                                            </span>
                                        </div>

                                        <div className='forms-lancar-pagamento'>
                                            {tipoForm === 'individual' && <FormsLancarPagamento card={card} />}
                                            {tipoForm === 'parcelado' && <FormsPagamentoParcelado card={card} />}
                                        </div>
                                    </div>
                                )}
                            </div>)
                        }
                        {/* <FormsLancarPagamento card={card} /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NfCard