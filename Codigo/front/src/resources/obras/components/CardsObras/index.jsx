import { Link } from "react-router-dom"
import "./CardsObras.css"
import { Building2, FileText, ListTree, MapPin, TrendingUp } from "lucide-react"
import { formatarPorcentagem } from "../../../../utils/formatters";

const CardsObras = ({ obra }) => {
    const isFinalizada = obra.status?.toLowerCase() === 'finalizada';

    return (
        <Link to={`/obras/${obra.id}`} className="card-link">
            <div className={`obra-card ${isFinalizada ? 'finalizada' : ''}`}>
                
                <div className="obra-card-header">
                    <h3><Building2 className="icon-obras-card-header" /> {obra.nome}</h3>
                    <p className="status-obra-p">{obra.status}</p>
                </div>
                <div className="endereco-obra-card">
                    <MapPin size={18} />
                    <p>{obra.endereco}</p>
                </div>
                <div className="obra-card-progress">
                    <div className="progress-labels">
                        <span>Andamento</span>
                        <span>{formatarPorcentagem(obra.porcentagem)}</span>
                    </div>

                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${obra.porcentagem}%` }}
                        ></div>
                    </div>

                    <div className="progress-values">
                        <span>{obra.atividadesConcluidas} concluídas</span>
                        <span className="progress-total">de {obra.atividades} tarefas</span>
                    </div>
                </div>
                <div className="obra-card-footer">
                    <p><ListTree /> Tarefas: {obra.atividades}</p>
                    <p><FileText /> Notas Fiscais: {obra.notasFiscais}</p>
                    <p><TrendingUp /> {obra.centroDeCusto}</p>
                </div>
            </div>
        </Link>
    )
}

export default CardsObras