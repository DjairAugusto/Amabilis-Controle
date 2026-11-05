import { useState } from 'react'
import './FormsPagamentoParcelado.css'
import Dropdown from '../../../../components/ui/Dropdown';
import Input from '../../../../components/ui/Input';
import Botao from '../../../../components/ui/Botao';
import { Plus } from 'lucide-react';
import { gerarArrayParcelas } from '../../utils/geradorParcelas';
import { usePagamentoMutations } from '../../hooks/usePagamentos';

const FormsPagamentoParcelado = ({ card }) => {

    const [valor, setValor] = useState('');
    const [dia, setDia] = useState('');
    const [parcelas, setParcelas] = useState('')

    const { lancarPagamentoParceladoMutation } = usePagamentoMutations();

    const handleLancarParcelado = () => {
        // Validação básica
        if (!valor || !dia || !parcelas) {
            alert("Preencha todos os campos para gerar o parcelamento.");
            return;
        }

        // 1. Limpa o valor monetário (Tira 'R$', pontos e troca vírgula por ponto)
        const stringValor = String(valor);
        const valorLimpo = stringValor.includes('R$')
            ? parseFloat(stringValor.replace('R$', '').replace(/\./g, '').replace(',', '.'))
            : parseFloat(stringValor);


        const numParcelas = parseInt(parcelas, 10);
        const diaLimpo = parseInt(dia, 10);
        if (numParcelas <= 0) {
            alert("O número de parcelas deve ser maior que zero.");
            return;
        }

        // 3. Usa o nosso novo Service!
        const payloadParcelado = gerarArrayParcelas(valorLimpo, diaLimpo, numParcelas);

        console.log("Payload gerado para o Backend:", payloadParcelado);

        lancarPagamentoParceladoMutation.mutate(
            { id: card.id, data: payloadParcelado },
            {
                onSuccess: () => {
                    setValor('');
                    setDia('');
                    setParcelas('');
                },
                onError: (error) => {
                    console.error("Erro ao lançar parcelamento:", error);
                    alert("Ocorreu um erro ao registrar as parcelas.");
                }
            }
        );
    };

    const opcoesDias = Array.from({ length: 31 }, (_, i) => String(i + 1));

    const handleParcelasChange = (e) => {
        const apenasNumeros = e.target.value.replace(/\D/g, '');
        setParcelas(apenasNumeros);
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
                placeholder='Ex: 5'
                label='Número de Parcelas'
                value={parcelas}
                onChange={handleParcelasChange}
            />
            <Dropdown
                label='Dia de Cobrança'
                placeholder='Selecione o dia...'
                opcoes={opcoesDias}
                onSelect={(valor) => setDia(valor)}
                valorDrop={dia}
            />
            <Botao color='primary-button' aoClicar={handleLancarParcelado}>
                {lancarPagamentoParceladoMutation.isPending ? "LANÇANDO..." : <><Plus /> Lançar Pagamento</>}
            </Botao>
        </>
    )
}


export default FormsPagamentoParcelado