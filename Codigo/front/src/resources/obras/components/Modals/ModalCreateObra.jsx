import { useState } from "react"
import { useCep } from "../../../../hooks/useCep"
import Input from "../../../../components/ui/Input"
import Dropdown from "../../../../components/ui/Dropdown"
import SearchBar from "../../../../components/ui/SearchBar"
import Modal from "../../../../components/layout/Modal"
import { ESTADOS_BRASIL } from "../../../../data/estadosBrasil"
import { useObraMutations } from "../../hooks/useObras"
import { obterCoordenadasPorEndereco } from "../../../../services/geocodingAPI"

const ModalCreateObra = ({ modalCreateObraIsOpen, setModalCreateObraIsOpen }) => {

    const { createMutation } = useObraMutations();

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
        setModalCreateObraIsOpen(!modalCreateObraIsOpen);
    }

    const handleSave = async () => {

        const orcamentoLimpo = orcamento
            ? parseFloat(orcamento.replace('R$ ', '').replace(/\./g, '').replace(',', '.'))
            : 0;


        const stringBuscaCoordenadas = `${logradouro}, ${numero}, ${bairro}, ${cidade}, ${cidade}, Brasil, ${cep}`

        const coordenadas = await obterCoordenadasPorEndereco(stringBuscaCoordenadas)
        console.log(coordenadas)
        
        const endereco = {
            cep: cep.replace(/\D/g, ''),
            logradouro: logradouro,
            numeroEndereco: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado,
            latitude: coordenadas? coordenadas.lat : null,
            longitude: coordenadas? coordenadas.lng : null
        }

        const construtora = {
            nome: nomeConstrutora,
            cnpj: cnpj
        }

        const novaObra = {
            nomeObra: nomeObra,
            centroDeCusto: centroCusto,
            orcamento: orcamentoLimpo,
            endereco: endereco,
            construtora: construtora,
            statusObra: "EM_ANDAMENTO"
        }

        createMutation.mutate(novaObra, {
            onSuccess: () => { 
                handleClose();
            }
        })

        console.log(novaObra);
        
    }

    const botaoCriarObra = {
        color: "primary-button",
        texto: createMutation.isPending? "SALVANDO..." : "CADASTRAR",
        aoClicar: handleSave
    }

    return (
        <Modal
            isOpen={modalCreateObraIsOpen}
            specificModal="modal-create-obra"
            onClose={handleClose}
            title="Cadastrar Nova Obra"
            botao={botaoCriarObra}
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

export default ModalCreateObra