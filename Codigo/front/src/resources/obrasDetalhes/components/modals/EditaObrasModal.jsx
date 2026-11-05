import { useEffect, useState } from "react";
import { useObrasDetalhesContext } from "../../hooks/useObrasDetalhesContext"
import { ESTADOS_BRASIL } from "../../../../data/estadosBrasil";
import Input from "../../../../components/ui/Input";
import Dropdown from "../../../../components/ui/Dropdown";
import Modal from "../../../../components/layout/Modal";
import { useCep } from "../../../../hooks/useCep";

import { useObraMutations } from "../../../obras/hooks/useObras";
import { applyMask } from "../../../../utils/maskConfig";

const EditObrasModal = () => {
    const { modalType, closeAllModals, obraInfo } = useObrasDetalhesContext();

    const { updateMutation } = useObraMutations();

    const isOpen = modalType === 'EDIT';

    const [nomeObra, setNomeObra] = useState('')
    const [centroCusto, setCentroCusto] = useState('')
    const [cep, setCep] = useState('')
    const [logradouro, setLogradouro] = useState('')
    const [numero, setNumero] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [bairro, setBairro] = useState('')
    const [nomeConstrutora, setNomeConstrutora] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [orcamento, setOrcamento] = useState('')

    useEffect(() => {
        if (isOpen && obraInfo) {
            setNomeObra(obraInfo.nome || '')
            setCentroCusto(obraInfo.centroDeCusto || '')

            const cepVindoDoBanco = obraInfo.endereco?.cep ? String(obraInfo.endereco.cep) : '';
            setCep(applyMask(cepVindoDoBanco, 'cep'));

            setLogradouro(obraInfo.endereco?.logradouro || '')
            setNumero(obraInfo.endereco?.numeroEndereco || '')
            setCidade(obraInfo.endereco?.cidade || '')
            setEstado(obraInfo.endereco?.estado || '')
            setBairro(obraInfo.endereco?.bairro || '')

            setNomeConstrutora(obraInfo.construtora?.nome || '')
            setCnpj(obraInfo.construtora?.cnpj || '')

            setOrcamento(obraInfo.orcamento ? String(obraInfo.orcamento) : '')
        }
    }, [obraInfo, isOpen])

    const { isLoadingCep, erroCep } = useCep(cep, (dadosViaCep) => {
        setLogradouro(dadosViaCep.logradouro || '');
        setBairro(dadosViaCep.bairro || '');
        setCidade(dadosViaCep.localidade || '');
        setEstado(dadosViaCep.uf || '');
    });

    const handleClose = () => {
        setBairro('')
        setCentroCusto('')
        setCep('')
        setCidade('')
        setCnpj('')
        setEstado('')
        setLogradouro('')
        setNomeObra('')
        setNomeConstrutora('')
        setNumero('')
        setOrcamento('')

        closeAllModals();
    }

    const handleSave = () => {

        const orcamentoLimpo = orcamento
            ? (typeof orcamento === 'string' ? parseFloat(orcamento.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) : orcamento)
            : 0;

        const endereco = {
            cep: String(cep).replace(/\D/g, ''),
            logradouro: logradouro,
            numeroEndereco: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado
        }

        const construtora = {
            nome: nomeConstrutora,
            cnpj: cnpj
        }
        
        const MAPA_STATUS_BACKEND = {
            "Em Andamento": "EM_ANDAMENTO",
            "Finalizada": "FINALIZADA"
        };

        // 🔴 2. Capturamos o status atual e traduzimos (com fallback de segurança)
        const statusAmigavel = obraInfo.statusObra || obraInfo.status;
        const statusFormatado = MAPA_STATUS_BACKEND[statusAmigavel] || statusAmigavel;

        const obraAtualizada = {
            nomeObra: nomeObra,
            centroDeCusto: centroCusto,
            orcamento: orcamentoLimpo,
            endereco: endereco,
            construtora: construtora,
            statusObra: statusFormatado, // 🔴 3. Enviamos o status formatado para o Spring Boot
            custoReal: obraInfo.custoReal || 0
        }

        updateMutation.mutate(
            { id: obraInfo.id, data: obraAtualizada },
            {
                onSuccess: () => {
                    handleClose();
                }
            }
        )
    }

    const botaoSalvarObra = {
        color: "primary-button",
        texto: updateMutation.isPending ? "SALVANDO ALTERAÇÕES..." : "SALVAR ALTERAÇÕES",
        aoClicar: handleSave
    }

    return (
        <Modal
            isOpen={isOpen}
            specificModal="modal-create-obra"
            onClose={handleClose}
            title="Editar Obra"
            botao={botaoSalvarObra}
        >
            <Input label="Nome Obra" typeInput="text" placeholder="Ex: Amabilis Construção" value={nomeObra} onChange={(e) => setNomeObra(e.target.value)} />
            <Input label="Centro de Custo" typeInput="text" placeholder="Ex: CC_01" value={centroCusto} onChange={(e) => setCentroCusto(e.target.value)} />

            <div className="form-row-address">
                <Input
                    label="CEP"
                    typeInput="text"
                    placeholder="Ex: 99999-999"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    mask="cep"
                />
                <Dropdown label="Estado" opcoes={ESTADOS_BRASIL} placeholder="Estado" onSelect={(valor) => setEstado(valor)} valorDrop={estado} />
            </div>

            <div className="form-row-equal">
                <Input label="Logradouro" typeInput="text" placeholder="Ex: Rua dos Tupis" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
                <Input label="Número" typeInput="text" placeholder="Ex: 342" value={numero} onChange={(e) => setNumero(e.target.value)} />

            </div>

            <div className="form-row-equal">
                <Input label="Bairro" typeInput="text" placeholder={isLoadingCep ? "Carregando" : "Ex: Barroca"} value={bairro} onChange={(e) => setBairro(e.target.value)} />
                <Input label="Cidade" typeInput="text" placeholder={isLoadingCep ? "Carregando" : "Ex: Belo Horizonte"} value={cidade} onChange={(e) => setCidade(e.target.value)} />
            </div>

            <Input label="Nome Construtora" typeInput="text" placeholder="Ex: Amabilis" value={nomeConstrutora} onChange={(e) => setNomeConstrutora(e.target.value)} />

            <div className="form-row-equal">
                <Input label="CNPJ Construtora" typeInput="text" placeholder="Ex: 00.000.000/0001-00" value={cnpj} onChange={(e) => setCnpj(e.target.value)} mask="cnpj" />
                <Input label="Orçamento Esperado" typeInput="text" placeholder="Ex: R$ 1.000.000,00" value={orcamento} onChange={(e) => setOrcamento(e.target.value)} mask="currency" />
            </div>
        </Modal>
    )
}

export default EditObrasModal;