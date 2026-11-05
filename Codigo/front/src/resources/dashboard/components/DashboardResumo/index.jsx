import { Building2, FileText, HandCoins, Loader2, OctagonAlert } from "lucide-react"
import "./DashboardResumo.css"
import { formatarMoeda, formatarPorcentagem } from "../../../../utils/formatters"
import { dashboardResumoMock } from "../../../../mock/dashboardResumomock"
import { useDashboardResumo } from "../../hooks/useDashboard"
import { useObrasTodas } from "../../../obras/hooks/useObras"
import Dropdown from "../../../../components/ui/Dropdown"
import { useDashboardContext } from "../../hooks/useDashboardContext"

const DashboardResumo = () => {

    const { dadosResumo, setObraSelecionadaId, obraSelecionadaId, isLoadingResumo } = useDashboardContext();
    
    // 🔴 2. Troque o hook para a lista completa
    const { data: obrasData } = useObrasTodas();

    // 🔴 3. O map funciona direto porque é um Array do RetornoObraDTO (que possui a propriedade 'nome')
    const nomesObras = obrasData ? obrasData.map(obra => obra.nome) : [];
    const opcoesDropdown = ['Todas as Obras', ...nomesObras];

    const handleSelectObra = (nomeSelecionado) => {
        if (nomeSelecionado === 'Todas as Obras') {
            setObraSelecionadaId(null);
        } else {
            const obraEncontrada = obrasData?.find(obra => obra.nome === nomeSelecionado);
            if (obraEncontrada) {
                setObraSelecionadaId(obraEncontrada.id);
            }
        }
    };

    const valorDropAtual = obraSelecionadaId && obrasData
        ? obrasData.find(o => o.id === obraSelecionadaId)?.nome
        : 'Todas as Obras';

    const resumo = dadosResumo;

    if (!resumo) return null;

    return (
        <div className="dashboard-resumo">
            <div className="dashboard-header">
                <div className="dashboard-header-text">
                    <h1>Dashboard</h1>
                    <p>Visão Geral</p>
                </div>
                <div className="dashboard-header-filter">
                    <Dropdown
                        placeholder="Todas as Obras"
                        opcoes={opcoesDropdown}
                        onSelect={handleSelectObra}
                        valorDrop={valorDropAtual}
                    />
                </div>
            </div>
            <div className="container-cards-dashboard-resumo">
                <div className='card-resumo-dashboard'>
                    {isLoadingResumo ? (
                        <div className="card-loader-container"><Loader2 className="animate-spin" size={24} color="#E3B746"/></div>
                    ) : (
                        <>
                            <div className="texto-card-dashboard-resumo">
                                <h2 className='nome-dado-dashboard'>Obras</h2>
                                <h2 className='valor-dado-dashboard'>{resumo.totalObras}</h2>
                                <h2 className='subtexto-dashboard'>{resumo.obrasEmAndamento} em Andamento</h2>
                            </div>

                            <div className='icone-wrapper obra'>
                                <Building2 size={28} />
                            </div>
                        </>
                    )}
                </div>

                <div className='card-resumo-dashboard'>
                    {isLoadingResumo ? (
                        <div className="card-loader-container"><Loader2 className="animate-spin" size={24} color="#E3B746"/></div>
                    ) : (
                        <>
                            <div className="texto-card-dashboard-resumo">
                                <h2 className='nome-dado-dashboard'>Total NFs</h2>
                                <h2 className='valor-dado-dashboard'>
                                    {formatarMoeda(resumo.valorTotalNfs)}
                                </h2>
                                <h2 className='subtexto-dashboard'>{resumo.numeroTotalNfs} notas</h2>
                            </div>

                            <div className='icone-wrapper nf'>
                                <FileText size={28} />
                            </div>
                        </>
                    )}
                </div>

                <div className='card-resumo-dashboard'>
                    {isLoadingResumo ? (
                        <div className="card-loader-container"><Loader2 className="animate-spin" size={24} color="#E3B746"/></div>
                    ) : (
                        <>
                            <div className="texto-card-dashboard-resumo">
                                <h2 className='nome-dado-dashboard'>Total Pago</h2>
                                <h2 className='valor-dado-dashboard'>
                                    {formatarMoeda(resumo.totalPago)}
                                </h2>
                                <h2 className='subtexto-dashboard'>{formatarPorcentagem(resumo.porcentagemPaga)} total</h2>
                            </div>

                            <div className='icone-wrapper pago'>
                                <HandCoins size={28} />
                            </div>
                        </>
                    )}
                </div>

                <div className='card-resumo-dashboard'>
                    {isLoadingResumo ? (
                        <div className="card-loader-container"><Loader2 className="animate-spin" size={24} color="#E3B746"/></div>
                    ) : (
                        <>
                            <div className="texto-card-dashboard-resumo">
                                <h2 className='nome-dado-dashboard'>Nfs Vencidas</h2>
                                <h2 className='valor-dado-dashboard'>{resumo.nfVencidas}</h2>
                                <h2 className='subtexto-dashboard'>
                                    {formatarMoeda(resumo.valorFaltanteNFs)}
                                </h2>
                            </div>

                            <div className='icone-wrapper vencida'>
                                <OctagonAlert size={28} />
                            </div>
                        </>
                    )}
                </div>
            </div >
        </div >
    )
}

export default DashboardResumo