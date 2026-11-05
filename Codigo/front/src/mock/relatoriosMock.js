export const relatoriosMock = [
  {
    id: 1,
    obraId: 1,
    obraNome: "Obra X",
    custoObra: [
      {
        id: 1,
        documento: "NF-001",
        emissao: "10/01/2026",
        vencimento: "10/02/2026",
        pagamento: "09/02/2026",
        valorPago: 1500.00
      },
      {
        id: 2,
        documento: "NF-002",
        emissao: "15/01/2026",
        vencimento: "15/02/2026",
        pagamento: "14/02/2026",
        valorPago: 2300.50
      },
      {
        id: 3,
        documento: "NF-003",
        emissao: "20/01/2026",
        vencimento: "20/02/2026",
        pagamento: "19/02/2026",
        valorPago: 950.00
      }
    ],
    relatorioSaida: [
      {
        id: 1,
        emissao: "10/01/2026",
        vencimento: "10/02/2026",
        pagto: "09/02/2026",
        documento: "NF-001",
        fornecedor: "Empresa Nome Fantasia",
        codTarefa: "T001",
        descricaoTarefa: "Escavação e Preparação",
        codRecurso: "R001",
        descricaoRecurso: "Pá Mecânica",
        valor: 1500.00
      },
      {
        id: 2,
        emissao: "15/01/2026",
        vencimento: "15/02/2026",
        pagto: "14/02/2026",
        documento: "NF-002",
        fornecedor: "Fornecedor de Materiais XYZ",
        codTarefa: "T002",
        descricaoTarefa: "Fundação",
        codRecurso: "R002",
        descricaoRecurso: "Concreto Usinado",
        valor: 2300.50
      },
      {
        id: 3,
        emissao: "20/01/2026",
        vencimento: "20/02/2026",
        pagto: "19/02/2026",
        documento: "NF-003",
        fornecedor: "Fornecedor C",
        codTarefa: "T003",
        descricaoTarefa: "Alvenaria",
        codRecurso: "R003",
        descricaoRecurso: "Tijolos",
        valor: 950.00
      }
    ]
  },
  {
    id: 2,
    obraId: 2,
    obraNome: "Obra XX",
    custoObra: [
      {
        id: 4,
        documento: "NF-004",
        emissao: "05/02/2026",
        vencimento: "05/03/2026",
        pagamento: "03/03/2026",
        valorPago: 3200.00
      },
      {
        id: 5,
        documento: "NF-005",
        emissao: "12/02/2026",
        vencimento: "12/03/2026",
        pagamento: "11/03/2026",
        valorPago: 1800.00
      }
    ],
    relatorioSaida: [
      {
        id: 4,
        emissao: "05/02/2026",
        vencimento: "05/03/2026",
        pagto: "03/03/2026",
        documento: "NF-004",
        fornecedor: "Empresa Nome Fantasia",
        codTarefa: "T004",
        descricaoTarefa: "Cobertura",
        codRecurso: "R004",
        descricaoRecurso: "Telhas Cerâmicas",
        valor: 3200.00
      },
      {
        id: 5,
        emissao: "12/02/2026",
        vencimento: "12/03/2026",
        pagto: "11/03/2026",
        documento: "NF-005",
        fornecedor: "Fornecedor de Materiais XYZ",
        codTarefa: "T005",
        descricaoTarefa: "Acabamento",
        codRecurso: "R005",
        descricaoRecurso: "Tinta",
        valor: 1800.00
      }
    ]
  },
  {
    id: 3,
    obraId: 3,
    obraNome: "Obra XXX",
    custoObra: [
      {
        id: 6,
        documento: "NF-006",
        emissao: "01/02/2026",
        vencimento: "01/03/2026",
        pagamento: "28/02/2026",
        valorPago: 2500.75
      }
    ],
    relatorioSaida: [
      {
        id: 6,
        emissao: "01/02/2026",
        vencimento: "01/03/2026",
        pagto: "28/02/2026",
        documento: "NF-006",
        fornecedor: "Fornecedor C",
        codTarefa: "T006",
        descricaoTarefa: "Instalações Elétricas",
        codRecurso: "R006",
        descricaoRecurso: "Fiação Elétrica",
        valor: 2500.75
      }
    ]
  }
];
