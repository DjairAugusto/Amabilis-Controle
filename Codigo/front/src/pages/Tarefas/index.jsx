import './Tarefas.css'
import { useTarefas } from '../../resources/tarefas/hooks/useTarefas';
import TarefaHeader from '../../resources/tarefas/components/TarefaHeader';
import TarefaNode from '../../resources/tarefas/components/TarefaNode';
import { TarefaProvider } from '../../resources/tarefas/contexts/TarefaContext';
import { useTarefaContext } from '../../resources/tarefas/hooks/useTarefaContext';
import { filtrarArvoreTarefas } from '../../resources/tarefas/utils/tarefasFilters';
import TarefaModalManager from '../../resources/tarefas/components/Modals/TarefaModalManager';

const TarefasContent = () => {
    const { data: tarefas, isLoading, error } = useTarefas();
    const { searchTerm } = useTarefaContext();

    const tarefasFiltradas = filtrarArvoreTarefas(tarefas || [], searchTerm);

    return (
        <>
            <section className='tarefa-section'>
                <TarefaHeader />

                <div className='container-tarefas'>
                    {isLoading ? (
                        <p>Loading tarefas...</p>
                    ) : error ? (
                        <p>Error loading tarefas: {error.message}</p>
                    ) : tarefasFiltradas.length === 0 ? (
                        <div className='tarefas-vazias'>
                            <p>Nenhuma tarefa correspondente encontrada para "{searchTerm}".</p>
                        </div>
                    ) : (
                        tarefasFiltradas.map((tarefa) => {
                            const tarefaId = tarefa.id_tarefa ?? tarefa.id;
                            return (
                                <TarefaNode key={tarefaId} node={tarefa} />
                            )
                        })
                    )}
                </div>
            </section>

            <TarefaModalManager />
        </>
    )
}

const Tarefas = () => {
    return (
        <TarefaProvider>
            <TarefasContent />
        </TarefaProvider>
    )
}

export default Tarefas;