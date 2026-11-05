import { Plus } from 'lucide-react'
import Botao from '../../../../components/ui/Botao'
import Input from '../../../../components/ui/Input'
import './FormsLancarPagamento.css'
import { STATUS_NF_BACKEND } from '../../utils/statusNotaFiscal'
import { useState } from 'react'
import { usePagamentoMutations } from '../../hooks/usePagamentos'

const FormsLancarPagamento = ({ card }) => {
    const [valor, setValor] = useState('');
    const [data, setData] = useState('');

    const { lancarPagamentoMutation } = usePagamentoMutations();

    const handleQuitarSaldo = () => {
        if (card.saldo) {
            setValor(String(card.saldo));
        }
    };

    const handleLancarNota = () => {
        if (!valor || !data) {
            alert("Preencha o valor e a data para lançar o pagamento.");
            return;
        }

        const stringValor = String(valor);
        const valorLimpo = stringValor.includes('R$')
            ? parseFloat(stringValor.replace('R$', '').replace(/\./g, '').replace(',', '.'))
            : parseFloat(stringValor);

        const payload = {
            valorPago: valorLimpo,
            dataPagamento: data
        }

        lancarPagamentoMutation.mutate({ id: card.id, data: payload }, {
            onSuccess: () => {
                setValor('');
                setData('');
            },
            onError: (error) => {
                console.error("Erro ao lançar pagamento:", error);
                alert("Ocorreu um erro ao registrar o pagamento.");
            }
        });
    };

    return (
        <>
            <Input
                placeholder='Ex: R$XXX.XXX.XX'
                label='Valor'
                mask="currency"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
            />
            <Input
                typeInput='date'
                placeholder='dd/mm/yyyy'
                label='Data'
                value={data}
                onChange={(e) => setData(e.target.value)}
            />

            <Botao color='secondary-button' aoClicar={handleQuitarSaldo}>
                Quitar Saldo
            </Botao>
            <Botao color='primary-button' aoClicar={handleLancarNota}>
                {lancarPagamentoMutation.isPending ? "LANÇANDO..." : <><Plus /> Lançar Pagamento</>}
            </Botao>
        </>

    )
}

export default FormsLancarPagamento