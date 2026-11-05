import { useState } from 'react';
import './TarefaSelectNode.css'
import IconeClicavel from '../../../../../components/ui/IconeClicavel';
import { CheckSquare, ChevronDown, ChevronRight, Square, SquareCheckBig } from 'lucide-react';

const TarefaSelectNode = ({node, level = 0, tarefasSelecionadas, handleToggleSelect}) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const hasChildren = node.children && node.children.length > 0;

    // Adaptação crucial para o Back-end: O DTO retorna 'id' e 'codigoTarefa'
    const nodeId = node.id ?? node.id_tarefa;
    const nodeCodigo = node.codigoTarefa ?? node.codigo_tarefa;

    const isSelected = tarefasSelecionadas.includes(nodeId);

    return(
        <div className={`tarefa-select-node level-${level}`}>
            <div 
                className={`linha-tarefa-select ${isSelected ? 'selecionada' : ''}`}
                style={{ paddingLeft: `${(level + 1) * 20}px` }}
                onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
            >
                <div className="linha-tarefa-texto-select">
                    {!hasChildren ? <IconeClicavel 
                        Icon={isSelected ? SquareCheckBig : Square} 
                        color={isSelected ? "#E3B746" : "grey"} 
                        size={22}
                        onClick={(e) => {
                            e.stopPropagation();
                            // Passamos o nodeId corrigido para o handler
                            handleToggleSelect(nodeId, !isSelected, node);
                        }}
                    /> : ''}
                    
                    <span className="codigo-select">{nodeCodigo}</span>
                    <span className="descricao-select">{node.descricao}</span>
                </div>

                <div className="linha-tarefa-acoes">
                    {hasChildren && (
                        <IconeClicavel
                            Icon={isExpanded ? ChevronDown : ChevronRight}
                            color="grey"
                            size={20}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                        />
                    )}
                </div>
            </div>

            <div className={`children-wrapper-select ${isExpanded && hasChildren ? 'is-open' : ''}`}>
                <div className="children-content-select">
                    {hasChildren && node.children.map((child) => (
                        <TarefaSelectNode
                            key={child.id ?? child.id_tarefa} // Key atualizada
                            node={child}
                            level={level + 1}
                            tarefasSelecionadas={tarefasSelecionadas}
                            handleToggleSelect={handleToggleSelect}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
} 

export default TarefaSelectNode;