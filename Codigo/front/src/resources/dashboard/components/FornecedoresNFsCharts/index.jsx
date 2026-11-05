import { ChartColumn, Loader2 } from 'lucide-react'
import './FornecedoresNFsCharts.css'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fornecedorNFChart } from '../../../../mock/fornecedorNFChartMock';
import { useDashboardContext } from '../../hooks/useDashboardContext';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="tooltip-fornecedor-container">
                <p className="tooltip-fornecedor-title">{data.nomeFornecedor}</p>
                <p className="tooltip-fornecedor-text">
                    Quantidade de <span>Notas Fiscais</span> <br></br>atrelados a este <span>Fornecedor</span>:
                </p>
                <p className='tooltip-fornecedor-number'>{data.numeroNFs}</p>
            </div>
        );
    }
    return null;
};

const FornecedoresNfsCharts = () => {

    const { dadosFornecedores, isLoadingFornecedores } = useDashboardContext();

    if (isLoadingFornecedores) {
        return (
            <div className='fornecedor-nf-card loading-state' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <Loader2 className="animate-spin" size={50} color="#E3B746" />
                <p style={{ marginLeft: '10px', color: '#64748B' }}>Carregando fornecedores...</p>
            </div>
        );
    }

    if (!dadosFornecedores || dadosFornecedores.length === 0) {
        return <div className="fornecedor-nf-card">Nenhum dado encontrado para o período.</div>;
    }

    return (
        <div className='fornecedor-nf-card'>
            <div className='fornecedor-nf-header'>
                <div className="titulo-fornecedor-nf">
                    <ChartColumn size={20} className="icon-trending" />
                    <h3>Top Fornecedores</h3>
                </div>
            </div>
            <div className="fornecedor-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                        responsive
                        data={dadosFornecedores}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5,
                        }}>

                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nomeFornecedor" />
                        <YAxis />
                        <Tooltip content={CustomTooltip} />
                        <Legend />
                        <Bar name="Notas Fiscais" dataKey="numeroNFs" fill="#E3B746" activeBar={{ fill: '#f9b50a' }} radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div >
    )
}

export default FornecedoresNfsCharts;