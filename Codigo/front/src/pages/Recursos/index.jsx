import './Recursos.css';
import Botao from '../../components/ui/Botao';
import SearchBar from '../../components/ui/SearchBar'; // <- Trazendo a barra de volta
import RecursoNode from '../../resources/recursos/components/RecursoNode';
import RecursoModal from '../../resources/recursos/components/RecursoModal'; 
import { RecursoProvider } from '../../resources/recursos/contexts/RecursoContext';
import { useRecursoContext } from '../../resources/recursos/hooks/useRecursoContext';

const RecursosContent = () => {
    const { 
        expandirTudo, 
        recolherTudo, 
        tiposAbertos, 
        gruposAbertos, 
        toggleTipo, 
        toggleGrupo,
        recursosFiltrados,
        searchTerm,
        setSearchTerm
    } = useRecursoContext();

    return (
        <section className='recursos-section'>
            <div className='recursos-header'> 
                <div className='recursos-header-texto'>
                    <h1 className='recursos-titulo'>Gestão de Recursos</h1>
                    <p className='recursos-subtitulo'>Controle e listagem de recursos</p>
                    
                    {/* A BARRA DE BUSCA RENDERIZADA AQUI */}
                    <div style={{ marginTop: '16px' }}>
                        <SearchBar 
                            placeholder="Busque um Recurso Específico"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className='recursos-header-botoes'>
                    <Botao color="secondary-button" aoClicar={expandirTudo}>Expandir Tudo</Botao>
                    <Botao color="secondary-button" aoClicar={recolherTudo}>Recolher Tudo</Botao>
                </div>
            </div>

            <div className='recursos-lista-container'>
                {recursosFiltrados?.length === 0 && searchTerm ? (
                    <div className='recursos-vazios'>
                        <p>Nenhum recurso correspondente encontrado para "{searchTerm}".</p>
                    </div>
                ) : (
                    recursosFiltrados?.map((tipo) => (
                        <RecursoNode 
                            key={`tipo-${tipo.id_tipo}`}
                            tipo={tipo}
                            // ARMADURA ANTI-QUEBRA APLICADA AQUI
                            isTipoAberto={tiposAbertos?.includes(tipo.id_tipo)}
                            toggleTipo={toggleTipo}
                            gruposAbertos={gruposAbertos || []}
                            toggleGrupo={toggleGrupo}
                        />
                    ))
                )}
            </div>

            <RecursoModal />
            
        </section>
    );
};

const Recursos = () => {
    return (
        <RecursoProvider>
            <RecursosContent />
        </RecursoProvider>
    );
};

export default Recursos;