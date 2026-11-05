export const notasFiscaisMock = [
  {
    id: 1,
    numeroNF: "001234",
    fornecedor: {
      id: 101,
      nome: "Empresa Nome Fantasia",
      cnpj: "12.345.678/0001-90"
    },
    emissao: "2025-11-15",
    vencimento: "2025-12-15",
    valorTotal: 25000.00,
    status: "ATIVO",
    pagamentos: [
      {
        data: "2025-11-25",
        valor: 10000.00
      }
    ],
    recursos: [
      {
        id: 1,
        descricao: "Cimento CP-II 50 KG",
        tipo: "MA",
        quantidade: 100,
        valorUnitario: 45.50,
        subtotal: 4550.00,
        tarefaId: 50
      },
      {
        id: 2,
        descricao: "Areia para construção",
        tipo: "MA",
        quantidade: 50,
        valorUnitario: 19.00,
        subtotal: 950.00,
        tarefaId: 50
      }
    ]
  },
  {
    id: 2,
    numeroNF: "001235",
    fornecedor: {
      id: 102,
      nome: "Fornecedor de Materiais XYZ",
      cnpj: "98.765.432/0001-11"
    },
    emissao: "2025-12-10",
    vencimento: "2026-01-10",
    valorTotal: 38000.00,
    status: "PARCIAL",
    pagamentos: [
      {
        data: "2025-12-20",
        valor: 15000.00
      }
    ],
    recursos: [
      {
        id: 3,
        descricao: "Brita para fundação",
        tipo: "MA",
        quantidade: 200,
        valorUnitario: 12.00,
        subtotal: 2400.00,
        tarefaId: 51
      }
    ]
  },
  {
    id: 3,
    numeroNF: "001236",
    fornecedor: {
      id: 103,
      nome: "Empreiteiros da Região",
      cnpj: "55.666.777/0001-88"
    },
    emissao: "2025-12-05",
    vencimento: "2026-01-05",
    valorTotal: 42000.00,
    status: "PAGO",
    pagamentos: [
      {
        data: "2025-12-15",
        valor: 42000.00
      }
    ],
    recursos: [
      {
        id: 5,
        descricao: "Obra de perfuração",
        tipo: "MO",
        quantidade: 40,
        valorUnitario: 222.50,
        subtotal: 8900.00,
        tarefaId: 52
      }
    ]
  },
  {
    id: 4,
    numeroNF: "001237",
    fornecedor: {
      id: 101,
      nome: "Empresa Nome Fantasia",
      cnpj: "12.345.678/0001-90"
    },
    emissao: "2026-01-08",
    vencimento: "2026-02-08",
    valorTotal: 31500.00,
    status: "ATIVO",
    pagamentos: [
      {
        data: "2026-01-20",
        valor: 12000.00
      }
    ],
    recursos: []
  },
  {
    id: 5,
    numeroNF: "001238",
    fornecedor: {
      id: 102,
      nome: "Fornecedor de Materiais XYZ",
      cnpj: "98.765.432/0001-11"
    },
    emissao: "2026-01-15",
    vencimento: "2026-02-15",
    valorTotal: 27800.00,
    status: "PAGO",
    pagamentos: [
      {
        data: "2026-01-25",
        valor: 27800.00
      }
    ],
    recursos: []
  },
  {
    id: 6,
    numeroNF: "001239",
    fornecedor: {
      id: 103,
      nome: "Empreiteiros da Região",
      cnpj: "55.666.777/0001-88"
    },
    emissao: "2026-02-03",
    vencimento: "2026-03-03",
    valorTotal: 50000.00,
    status: "ATIVO",
    pagamentos: [
      {
        data: "2026-02-10",
        valor: 25000.00
      }
    ],
    recursos: []
  },
  {
    id: 7,
    numeroNF: "001240",
    fornecedor: {
      id: 101,
      nome: "Empresa Nome Fantasia",
      cnpj: "12.345.678/0001-90"
    },
    emissao: "2026-02-12",
    vencimento: "2026-03-12",
    valorTotal: 35200.00,
    status: "PAGO",
    pagamentos: [
      {
        data: "2026-02-20",
        valor: 35200.00
      }
    ],
    recursos: []
  }
];
