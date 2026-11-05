import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, Timer } from 'lucide-react';
import { formatarMoeda } from '../../../../utils/formatters';
import './CustoRecursosChart.css';
import { useDashboardContext } from '../../hooks/useDashboardContext';

const COLORS = {
    MATERIAL: '#E3B746',
    EQUIPAMENTO: '#4A90D9',
    INDIRETO: '#E57373',
    'MÃO DE OBRA DIRETA': '#F0A040',
    'SERVIÇOS DE TERCEIROS': '#66BB6A',
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="tooltip-recurso-container">
                <p className="tooltip-recurso-title">{data.name}</p>
                <p className="tooltip-recurso-text">
                    Custo de <span style={{ color: COLORS[data.name] }}>{data.name}</span>:
                </p>
                <p className="tooltip-recurso-value">{formatarMoeda(data.value)}</p>
            </div>
        );
    }
    return null;
};

const renderLegend = (props) => {
    const { payload } = props;
    return (
        <ul className="recurso-legend">
            {payload.map((entry, index) => (
                <li key={index} className="recurso-legend-item">
                    <span
                        className="recurso-legend-dot"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="recurso-legend-label">{entry.value}</span>
                </li>
            ))}
        </ul>
    );
};

const CustoRecursosChart = () => {
    const { dadosRecursos, isLoadingRecursos } = useDashboardContext();

    if (isLoadingRecursos) {
        return (
            <div className='recurso-card loading-state' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <Loader2 className="animate-spin" size={50} color="#E3B746" />
                <p style={{ marginLeft: '10px', color: '#64748B' }}>Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="recurso-card">
            <div className="recurso-header">
                <div className="titulo-recurso">
                    <Timer size={20} className="icon-recurso" />
                    <h3>Custo Por Recurso</h3>
                </div>
            </div>
            <div className="recurso-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dadosRecursos}
                            cx="40%"
                            cy="50%"
                            innerRadius="50%"
                            outerRadius="75%"
                            paddingAngle={0.2}
                            dataKey="value"
                            labelLine={false}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        fill="white"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fontSize={12}
                                        fontWeight={600}
                                    >
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                );
                            }}
                        >
                            {dadosRecursos.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={renderLegend} layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CustoRecursosChart;