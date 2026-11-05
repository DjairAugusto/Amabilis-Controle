import IconeClicavel from '../../../../components/ui/IconeClicavel';
import './TarefaNode.css'
import { Plus, Trash, Edit, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTarefaContext } from '../../hooks/useTarefaContext'; // Importando o Contexto

const TarefaNode = ({ node, level = 0 }) => {
    const tarefaId = node.id_tarefa ?? node.id;

    const [childrenIsOpen, setchildrenIsOpen] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    const { expandirGlobal, openCreateModal, openEditModal, openDeleteModal, searchTerm } = useTarefaContext();

    useEffect(() => {
        if (searchTerm && searchTerm.trim().length > 0) {
            setchildrenIsOpen(true);
        }
        else if (expandirGlobal !== null) {
            setchildrenIsOpen(expandirGlobal);
        }
        else {
            setchildrenIsOpen(false);
        }
    }, [searchTerm, expandirGlobal]);

    useEffect(() => {
        if (expandirGlobal !== null) setchildrenIsOpen(expandirGlobal);
    }, [expandirGlobal]);

    return (
        <div className={`tarefa-node level-${level}`}>
            <div
                className='linha-tarefa'
                style={{ paddingLeft: `${(level + 1) * 20}px` }}
                onClick={() => { setchildrenIsOpen(!childrenIsOpen) }}
            >
                <div className='linha-tarefa-texto'>
                    <p>{node.codigoTarefa}</p>
                    <p>{node.descricao}</p>
                    <p>{node.unidadeMedida || '-'}</p>
                </div>

                <div className='linha-tarefa-icones'>
                    {level < 2 ? (
                        <IconeClicavel Icon={Plus} color="grey" onClick={(e) => {
                            e.stopPropagation();
                            openCreateModal(tarefaId);
                        }} />
                    ) : " "}

                    <IconeClicavel Icon={Edit} color="grey" onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(node);
                    }} />

                    <IconeClicavel Icon={Trash} color="red" onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(node);
                    }} />

                    {hasChildren && (
                        <IconeClicavel
                            Icon={childrenIsOpen ? ChevronDown : ChevronRight}
                            color="grey"
                            onClick={(e) => {
                                e.stopPropagation();
                                setchildrenIsOpen(!childrenIsOpen);
                            }}
                        />
                    )}
                </div>
            </div>

            <div className={`children-wrapper ${childrenIsOpen && hasChildren ? 'is-open' : ''}`}>
                <div className="children-content">
                    {hasChildren && node.children.map((child) => (
                        <TarefaNode
                            key={child.id_tarefa ?? child.id} // Garantindo a Key correta
                            node={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TarefaNode;