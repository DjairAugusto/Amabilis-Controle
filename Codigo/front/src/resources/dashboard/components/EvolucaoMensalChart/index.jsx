import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, Calendar as CalendarIcon, RotateCcw, Inbox, Loader2 } from 'lucide-react';
import { formatarMoeda } from '../../../../utils/formatters';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { evolucaoMensalMock } from '../../../../mock/evolucaoMensalMock';
import './EvolucaoMensalChart.css';

const EvolucaoMensalChart = () => {
    const { dateFrom, setDateFrom, dateTo, setDateTo, resetPeriod, dadosEvolucao, isLoadingEvolucao } = useDashboardContext();
    const [selectedMonth, setSelectedMonth] = useState(null);

    const calculateMonthlyData = () => {
        const from = new Date(dateFrom);
        from.setDate(1);
        const to = new Date(dateTo);

        const months = eachMonthOfInterval({ start: from, end: to });
        const monthlyMap = {};

        months.forEach(month => {
            const key = format(month, 'yyyy-MM');
            monthlyMap[key] = { emitido: 0, pago: 0 };
        });

        (dadosEvolucao || []).forEach(nf => {
            const emissaoKey = nf.emissao.substring(0, 7);
            if (monthlyMap[emissaoKey] && nf.emissao >= dateFrom && nf.emissao <= dateTo) {
                monthlyMap[emissaoKey].emitido += nf.valorTotal;
            }

            nf.pagamentos?.forEach(p => {
                const pagamentoKey = p.data.substring(0, 7);
                if (monthlyMap[pagamentoKey] && p.data >= dateFrom && p.data <= dateTo) {
                    monthlyMap[pagamentoKey].pago += p.valor;
                }
            });
        });

        return Object.entries(monthlyMap).map(([k, v]) => ({
            mes: format(parseISO(k + '-01'), 'MMM', { locale: ptBR }),
            mesAbrev: k,
            Emitido: v.emitido,
            Pago: v.pago,
        }));
    };

    const monthlyData = calculateMonthlyData();

    const hasData = monthlyData.some(m => m.Emitido > 0 || m.Pago > 0);

    const handleDateFromChange = (e) => {
        setDateFrom(e.target.value);
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
    };

    const handleReset = () => {
        resetPeriod();
        setSelectedMonth(null);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload;
            return (
                <div className="tooltip-container">
                    <p className="tooltip-title">{data.mesAbrev}</p>
                    <p className="tooltip-emitido">
                        Emitido: <span>{formatarMoeda(data.Emitido)}</span>
                    </p>
                    <p className="tooltip-pago">
                        Pago: <span>{formatarMoeda(data.Pago)}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (isLoadingEvolucao) {
        return (
            <div className='evolucao-mensal-card loading-state' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <Loader2 className="animate-spin" size={50} color="#E3B746" />
                <p style={{ marginLeft: '10px', color: '#64748B' }}>Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="evolucao-mensal-card">
            <div className="card-header">
                <div className="title-section">
                    <TrendingUp size={20} className="icon-trending" />
                    <h3>Evolução Mensal — Emitido vs Pago</h3>
                </div>

                <div className="filters-container">
                    <div className="date-filter">
                        <label>De</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            className="date-input"
                        />
                    </div>

                    <span className="arrow">→</span>

                    <div className="date-filter">
                        <label>Até</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={handleDateToChange}
                            className="date-input"
                        />
                    </div>

                    <button className="reset-button" onClick={handleReset}>
                        <RotateCcw size={16} />
                        <span>6 meses</span>
                    </button>
                </div>
            </div>

            <div className="chart-wrapper">
                {hasData ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="gEmit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="hsl(45, 75%, 58%)" stopOpacity={0.6} />
                                    <stop offset="100%" stopColor="hsl(45, 75%, 58%)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gPago" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="hsl(142, 71%, 40%)" stopOpacity={0.6} />
                                    <stop offset="100%" stopColor="hsl(142, 71%, 40%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 89%)" />
                            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                            <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Area type="monotone" dataKey="Emitido" stroke="hsl(45, 75%, 58%)" fill="url(#gEmit)" strokeWidth={2} />
                            <Area type="monotone" dataKey="Pago" stroke="hsl(142, 71%, 40%)" fill="url(#gPago)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="empty-state">
                        <Inbox size={48} className="empty-icon" />
                        <p className="empty-title">Sem dados disponíveis</p>
                        <p className="empty-description">Não há notas fiscais no período selecionado</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvolucaoMensalChart;
