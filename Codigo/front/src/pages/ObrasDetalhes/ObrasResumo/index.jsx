import { useNavigate, useParams } from 'react-router-dom';
import ObrasHeader from '../../../resources/obras/components/ObrasHeader';
import { Building2, DollarSign, Edit, FileText, ListTree, MapPin, MoveLeft, Trash } from 'lucide-react';
import IconeClicavel from '../../../components/ui/IconeClicavel';
import "./ObrasResumo.css"
import { useObrasDetalhesContext } from '../../../resources/obrasDetalhes/hooks/useObrasDetalhesContext';
import { formatarEndereco, formatarMoeda } from '../../../utils/formatters';

const ObraResumo = ({obra}) => {

    const navigate = useNavigate();
    
    const { openEditModal, openDeleteModal } = useObrasDetalhesContext();

    return (
        <>
            <div className="obra-detalhes-header">
                <div className='obras-detalhes-header-top-left'>
                    <IconeClicavel
                        Icon={MoveLeft}
                        color="grey"
                        size={24}
                        onClick={() => navigate(-1)}
                    />
                    <Building2 className="icon-obras-detalhes-header" />
                    <div className='obras-detalhes-header-text'>
                        <h1> {obra.nome}</h1>
                        <p>{obra.construtora.nome}</p>
                        <div className="endereco-obra-detalhes">
                            <MapPin size={24} />
                            <p>{formatarEndereco(obra?.endereco)}</p>
                        </div>

                    </div>
                    <IconeClicavel Icon={Edit} color="grey" size={24} onClick={() => openEditModal(obra)} />
                    <IconeClicavel Icon={Trash} color="red" size={24} onClick={() => openDeleteModal(obra)}/>
                </div>
                <p className="status-obra-p">{obra.status}</p>
            </div>

            <div className='container-cards-obra-dados-gerais'>
                <div className='card-obra-dados-gerais'>
                    <div>
                        <h2 className='nome-dado-obra'>Orçamento</h2>
                        <h2 className='valor-dado-obra'>{formatarMoeda(obra.orcamento)}</h2>
                    </div>
                    <DollarSign className='icone-dado-obra' color='grey' size={24} />
                </div>
                <div className='card-obra-dados-gerais'>
                    <div>
                        <h2 className='nome-dado-obra'>Custo Real</h2>
                        <h2 className='valor-dado-obra'>{formatarMoeda(obra.custoReal)}</h2>
                    </div>
                    <DollarSign className='icone-dado-obra' color='grey' size={24} />
                </div>
                <div className='card-obra-dados-gerais'>
                    <div>
                        <h2 className='nome-dado-obra'>Notas Fiscais</h2>
                        <h2 className='valor-dado-obra'>{obra.notasFiscais==null? '0' : obra.notasFiscais}</h2>
                    </div>
                    <FileText className='icone-dado-obra' color='grey' size={24} />
                </div>
                <div className='card-obra-dados-gerais'>
                    <div>
                        <h2 className='nome-dado-obra'>Tarefas</h2>
                        <h2 className='valor-dado-obra'>{obra.totalAtividades==null? '0' : obra.totalAtividades}</h2>
                    </div>
                    <ListTree className='icone-dado-obra' color='grey' size={24} />
                </div>
            </div>
        </>
    )
};

export default ObraResumo;