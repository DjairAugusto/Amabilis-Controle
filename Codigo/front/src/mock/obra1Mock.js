// src/mock/obra1Mock.js

export const obra1Mock = {
    id: 1,
    nome: "Residencial Amabilis",
    statusObra: "EM_ANDAMENTO",
    orcamento: 15000000.00,
    custoReal: 5500000.00,
    centroDeCusto: "CC-01",
    endereco: {
        logradouro: "Rua das Flores",
        numero: "123",
        bairro: "Jardim Primavera",
        cidade: "Belo Horizonte",
        estado: "MG",
        cep: "30000-000",
        formatado: "Rua das Flores, 123 - Jardim Primavera" 
    },
    construtora: {
        nome: "Construtora Amabilis S.A.",
        cnpj: "12.345.678/0001-90"
    },
    totalAtividades: 150,
    notasFiscaisTotal: 3,
    
    notasFiscais: [
      {
        id: 1,
        numeroNF: "001234",
        fornecedor: {
          id: 101,
          nome: "Empresa Nome Fantasia",
          cnpj: "12.345.678/0001-90"
        },
        emissao: "15/02/2026",
        vencimento: "15/03/2026",
        valorTotal: 5500.00,
        status: "ATIVO",
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
        emissao: "10/02/2026",
        vencimento: "10/03/2026",
        valorTotal: 3200.00,
        status: "ATIVO",
        recursos: [
          {
            id: 3,
            descricao: "Brita para fundação",
            tipo: "MA",
            quantidade: 200,
            valorUnitario: 12.00,
            subtotal: 2400.00,
            tarefaId: 51
          },
          {
            id: 4,
            descricao: "Pedra britada gdo",
            tipo: "MA",
            quantidade: 80,
            valorUnitario: 10.00,
            subtotal: 800.00,
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
        emissao: "08/02/2026",
        vencimento: "08/03/2026",
        valorTotal: 8900.00,
        status: "PAGO",
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
      }
    ],
    
    itensObra: [
        {
            id: 101, 
            status: "FINALIZADO", 
            tarefa: {
                id: 50, // <-- O Mágico ID que vai pintar a caixinha de verde no Modal!
                codigoTarefa: "03.01.01",
                descricao: "Mobilização e desmobilização de equito - EQ", 
                unidadeMedida: "VB"
            },
            recursos: [
                {
                    id: 201,
                    codigoRecurso: "2.00.00.005", 
                    descricao: "equipamento alugado - betoneira",
                    unidadeMedida: "h"
                },
                {
                    id: 202,
                    codigoRecurso: "3.00.00.215", 
                    descricao: "empreiteiro de carga e descarga caminhão",
                    unidadeMedida: "uni"
                }
            ]
        },
        {
            id: 102,
            status: "EM_ANDAMENTO",
            tarefa: {
                id: 51, // <-- O Mágico ID que vai pintar a caixinha de verde no Modal!
                codigoTarefa: "03.01.02",
                descricao: "Marcação, Locação tabeira - MO",
                unidadeMedida: "M"
            },
            recursos: [
                {
                    id: 205,
                    codigoRecurso: "4.00.00.001", 
                    descricao: "mod - oficial",
                    unidadeMedida: "dia"
                },
                {
                    id: 206,
                    codigoRecurso: "1.11.00.002", 
                    descricao: "madeira pinus - 0,30",
                    unidadeMedida: "m"
                }
            ]
        },
        {
            id: 103,
            status: "PENDENTE",
            tarefa: {
                id: 52, // <-- O Mágico ID que vai pintar a caixinha de verde no Modal!
                codigoTarefa: "03.01.03",
                descricao: "Perfuração Estaca trado ø 300mm - MO",
                unidadeMedida: "M"
            },
            recursos: [
                {
                    id: 208,
                    codigoRecurso: "4.00.00.001", 
                    descricao: "mod - oficial",
                    unidadeMedida: "dia"
                },
                {
                    id: 209,
                    codigoRecurso: "4.00.00.002", 
                    descricao: "mod - ajudante",
                    unidadeMedida: "dia"
                },
                {
                    id: 210,
                    codigoRecurso: "3.00.00.008", 
                    descricao: "empreiteiro topografia",
                    unidadeMedida: "vb"
                }
            ]
        }
    ]
};