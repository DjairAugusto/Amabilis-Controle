import CreateTarefaModal from './CreateTarefaModal';
import EditTarefaModal from './EditTarefaModal';
import DeleteTarefaModal from './DeleteTarefaModal';

const TarefaModalManager = () => {
    return (
        <>
            <CreateTarefaModal />
            <EditTarefaModal />
            <DeleteTarefaModal />
        </>
    );
};

export default TarefaModalManager;