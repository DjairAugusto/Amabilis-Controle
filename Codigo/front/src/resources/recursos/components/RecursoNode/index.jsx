import React from 'react';
import IconeClicavel from '../../../../components/ui/IconeClicavel';
import { Plus, Trash, Edit, ChevronDown, ChevronRight } from 'lucide-react';
import { useRecursoContext } from '../../hooks/useRecursoContext'; 
import './RecursoNode.css';

const RecursoNode = ({ tipo, isTipoAberto, toggleTipo, gruposAbertos, toggleGrupo }) => {
    
    const { abrirModal, excluirItem } = useRecursoContext();

    const getTipoBadgeClass = (nomeTipo) => {
        const tipoNormalizado = nomeTipo.toUpperCase().trim();
        if (tipoNormalizado === 'INDIRETO') return 'tipo-badge tipo-material-indireto';
        if (tipoNormalizado === 'MATERIAL') return 'tipo-badge tipo-material';
        if (tipoNormalizado === 'EQUIPAMENTO') return 'tipo-badge tipo-equipamento';
        if (tipoNormalizado === 'MAO_DE_OBRA_DIRETO') return 'tipo-badge tipo-mao-obra-direto';
        if (tipoNormalizado === 'SERVICO_DE_TERCEIRO') return 'tipo-badge tipo-servicos-terceiros';
        return 'tipo-badge tipo-default';
    };

    const formatarNomeTipo = (nomeTipo) => {
        if (nomeTipo === 'INDIRETO') return 'INDIRETO';
        if (nomeTipo === 'MAO_DE_OBRA_DIRETO') return 'MÃO DE OBRA DIRETO';
        if (nomeTipo === 'SERVICO_DE_TERCEIRO') return 'SERVIÇOS DE TERCEIROS';
        return nomeTipo;
    };

    return (
        <div className='grupo-wrapper'>
            <div className='linha-grupo nivel-tipo'>
                <span className={getTipoBadgeClass(tipo.nome_tipo)}>
                    {formatarNomeTipo(tipo.nome_tipo)}
                </span>
                <div className='grupo-acoes'>
                    <IconeClicavel 
                        Icon={Plus} 
                        color="grey" 
                        onClick={() => abrirModal('novo_grupo', { tipoRecurso: tipo.nome_tipo })} 
                    />
                    <IconeClicavel 
                        Icon={isTipoAberto ? ChevronDown : ChevronRight} 
                        color="grey" 
                        onClick={() => toggleTipo(tipo.id_tipo)}
                    />
                </div>
            </div>

            <div className={`tipos-wrapper ${isTipoAberto ? 'is-open' : ''}`}>
                <div className="tipos-content">
                    {tipo.grupos.map((grupo) => {
                        const isGrupoAberto = gruposAbertos.includes(grupo.id_grupo);

                        return (
                            <div key={`grupo-${grupo.id_grupo}`} className='subgrupo-container'>
                                
                                <div className='linha-grupo nivel-grupo'>
                                    <span className='grupo-nome'>{grupo.nome_grupo}</span>
                                    <div className='grupo-acoes'>
                                        <IconeClicavel 
                                            Icon={Plus} 
                                            color="grey" 
                                            onClick={() => abrirModal('novo_recurso', { tipo, grupo })} 
                                        />
                                        <IconeClicavel 
                                            Icon={Edit} 
                                            color="grey" 
                                            onClick={() => abrirModal('editar_grupo', {
                                                id: grupo.id_grupo,
                                                nomeGrupo: grupo.nome_grupo,
                                                tipoRecurso: grupo.tipoRecurso
                                            })} 
                                        />
                                        <IconeClicavel 
                                            Icon={Trash} 
                                            color="red" 
                                            onClick={() => excluirItem('grupo', grupo.id_grupo)} 
                                        />
                                        <IconeClicavel 
                                            Icon={isGrupoAberto ? ChevronDown : ChevronRight} 
                                            color="grey" 
                                            onClick={() => toggleGrupo(grupo.id_grupo)}
                                        />
                                    </div>
                                </div>

                                <div className={`recursos-wrapper ${isGrupoAberto ? 'is-open' : ''}`}>
                                    <div className="recursos-content">
                                        {grupo.recursos.map((recurso) => (
                                            <div key={`recurso-${recurso.id_recurso}`} className='linha-recurso'>
                                                <span className='recurso-nome'>
                                                    <strong>{recurso.codigo_recurso}</strong> - {recurso.descricao} ({recurso.unidade_medida})
                                                </span>
                                                <div className='recurso-acoes'>
                                                    <IconeClicavel 
                                                        Icon={Edit} 
                                                        color="grey" 
                                                        onClick={() => abrirModal('editar_recurso', recurso)} 
                                                    />
                                                    <IconeClicavel 
                                                        Icon={Trash} 
                                                        color="red" 
                                                        onClick={() => excluirItem('recurso', recurso.id_recurso)} 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RecursoNode;