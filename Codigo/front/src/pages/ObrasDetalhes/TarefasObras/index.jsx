import { Link } from "lucide-react";
import "./TarefasObras.css";
import LinhaItemObra from "../../../resources/obrasDetalhes/components/tarefas/LinhaItemObra";
import { useObrasDetalhesContext } from "../../../resources/obrasDetalhes/hooks/useObrasDetalhesContext";

const TarefasObra = ({ obra }) => {
    const { openAlocarTarefasModal } = useObrasDetalhesContext();

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #D9DEE4' }}>
            <div className="tarefas-obras-button">
                <button onClick={() => openAlocarTarefasModal(obra)}>
                    <Link /> Vincular atividades ao Catálogo
                </button>
            </div>
            
            <div className="lista-tarefas-execucao">
                {obra?.itensObra?.length > 0 ? (
                    obra.itensObra.map((item) => (
                        <LinhaItemObra key={item.id} item={item} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', padding: '20px', color: 'grey' }}>
                        Nenhuma tarefa vinculada a esta obra ainda.
                    </p>
                )}
            </div>
        </div>
    );
};

export default TarefasObra;