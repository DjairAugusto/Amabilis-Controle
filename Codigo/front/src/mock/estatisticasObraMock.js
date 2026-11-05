export const estatisticasObraMock = {
    // 1. Dados para o componente <DashboardResumo /> 
    // (Jogamos tudo para a RAIZ do objeto para o componente achar direto)
    totalObras: 1,           
    obrasEmAndamento: 1,     
    valorTotalNfs: 540000.00,
    numeroTotalNfs: 45,
    totalPago: 410629.50,
    porcentagemPaga: 76.04, 
    nfVencidas: 3,
    valorFaltanteNFs: 12500.31,

    // 2. Dados para o componente <CustoRecursosChart />
    custoRecursos: [
        { name: 'EQUIPAMENTO', value: 125000 },
        { name: 'SERVIÇOS DE TERCEIROS', value: 85000 },
        { name: 'INDIRETO', value: 45000 },
        { name: 'MÃO DE OBRA DIRETA', value: 150000 },
        { name: 'MATERIAL', value: 135000 },
    ],

    // 3. Dados para o componente <FornecedoresNfsCharts />
    // (O nome TEM que ser esse para o contexto encontrar)
    fornecedorNFChart: [
        { id: 1, nomeFornecedor: 'Gerdau S.A.', numeroNFs: 15 },
        { id: 2, nomeFornecedor: 'Votorantim Cimentos', numeroNFs: 12 },
        { id: 3, nomeFornecedor: 'Leroy Merlin', numeroNFs: 8 },
        { id: 4, nomeFornecedor: 'Amanco Wavin', numeroNFs: 6 },
        { id: 5, nomeFornecedor: 'Sika Brasil', numeroNFs: 4 },
    ],

    // 4. DADOS DA EVOLUÇÃO MENSAL (Novo formato do gráfico)
    evolucaoMensal: [
        {
            id: 901,
            numeroNF: "009001",
            emissao: "2025-12-15",
            valorTotal: 85000.00,
            pagamentos: [{ data: "2025-12-20", valor: 40000.00 }]
        },
        {
            id: 902,
            numeroNF: "009002",
            emissao: "2026-01-10",
            valorTotal: 62000.00,
            pagamentos: [{ data: "2026-01-15", valor: 62000.00 }]
        },
        {
            id: 903,
            numeroNF: "009003",
            emissao: "2026-02-05",
            valorTotal: 120000.00,
            pagamentos: [
                { data: "2026-02-10", valor: 50000.00 },
                { data: "2026-02-28", valor: 70000.00 }
            ]
        }
    ]
};