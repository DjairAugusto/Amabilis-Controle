import { useState } from 'react';
import { ChevronDown, ChevronUp, PackageOpen } from 'lucide-react';
import './LinhaItemObra.css'; // Vamos criar esse CSS a seguir
import IconeClicavel from '../../../../../components/ui/IconeClicavel';
import Dropdown from '../../../../../components/ui/Dropdown';
import { useItensObraMutations } from '../../../hooks/useItensObra';

const MAPA_FRONTEND = {
    PENDENTE: "Pendente",
    EM_ANDAMENTO: "Em Andamento",
    FINALIZADO: "Finalizado"
};

const MAPA_BACKEND = {
    "Pendente": "PENDENTE",
    "Em Andamento": "EM_ANDAMENTO",
    "Finalizado": "FINALIZADO"
};

const LinhaItemObra = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [statusLocal, setStatusLocal] = useState(item.status);

    const { atualizarStatusMutation } = useItensObraMutations();

    const opcoesStatus = Object.values(MAPA_FRONTEND);

    const handleStatusChange = (statusAmigavelClicado) => {
        const novoStatusBackend = MAPA_BACKEND[statusAmigavelClicado];
        setStatusLocal(novoStatusBackend);

        atualizarStatusMutation.mutate(
            {
                itemId: item.id,
                data: { status: novoStatusBackend } 
            },
            {
                onError: (error) => {
                    console.error("Erro ao atualizar o status no servidor:", error);
                    setStatusLocal(item.status);
                }
            }
        );
    };

    return (
        <div className="linha-item-container">
            <div className={`linha-item-principal ${isExpanded ? 'expandida' : ''}`}>
                <div className="item-info-tarefa">
                    <span className="item-codigo">{item.tarefa.codigoTarefa}</span>
                    <span className="item-descricao">{item.tarefa.descricao}</span>
                </div>

                <div className="item-acoes">
                    <div className={`status-wrapper ${statusLocal.toLowerCase()}`}>
                        <Dropdown
                            opcoes={opcoesStatus}
                            valorDrop={MAPA_FRONTEND[statusLocal]}
                            onSelect={handleStatusChange}
                            placeholder="Selecione o Status"
                        />
                    </div>

                    {/* Botão de Expandir/Recolher Recursos */}
                    <button
                        className="btn-expandir-recursos"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        Recursos
                    </button>
                </div>
            </div>

            <div className={`recursos-wrapper ${isExpanded ? 'is-open' : ''}`}>
                <div className="recursos-content">

                    <div className="item-recursos-dropdown">
                        <div className="recursos-header">
                            <PackageOpen size={20} />
                            <span>Recursos Alocados</span>
                        </div>

                        <table className="tabela-recursos-interna">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Descrição</th>
                                    <th>Unidade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.recursos.map((itemAlocado) => {
                                    const recursoReal = itemAlocado.recurso; 
                                    
                                    return(
                                    <tr key={itemAlocado.id}>
                                        <td>{recursoReal.codigoHierarquico}</td>
                                        <td>{recursoReal.descricao}</td>
                                        <td>{recursoReal.unidadeMedida}</td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LinhaItemObra;