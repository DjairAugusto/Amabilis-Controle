export const mockRecursos = [
  {
    id_tipo: 1, 
    nome_tipo: "MATERIAL",
    grupos: [
      {
        id_grupo: 10,
        nome_grupo: "AGLUTINANTES",
        recursos: [
          {
            id_recurso: 100, 
            codigo_recurso: "1.00.00.001",
            descricao: "CIMENTO CP-II",
            unidade_medida: "SC"
          }
        ]
      },
      {
        id_grupo: 11,
        nome_grupo: "AGREGADOS",
        recursos: [
          {
            id_recurso: 101,
            codigo_recurso: "1.01.00.004", 
            descricao: "AREIA GROSSA",
            unidade_medida: "M3"
          }
        ]
      }
    ]
  },
  {
    id_tipo: 2,
    nome_tipo: "EQUIPAMENTO",
    grupos: [
      {
        id_grupo: 20,
        nome_grupo: "MÁQUINAS LEVES",
        recursos: [
          {
            id_recurso: 200,
            codigo_recurso: "2.00.00.001",
            descricao: "BETONEIRA 400L",
            unidade_medida: "UN"
          }
        ]
      }
    ]
  },
  {
    id_tipo: 3,
    nome_tipo: "MATERIAL INDIRETO",
    grupos: [
      {
        id_grupo: 15,
        nome_grupo: "MATERIAIS DE CONSUMO",
        recursos: [
          {
            id_recurso: 150,
            codigo_recurso: "3.00.00.001",
            descricao: "PREGOS",
            unidade_medida: "KG"
          }
        ]
      }
    ]
  },
  {
    id_tipo: 4,
    nome_tipo: "MÃO DE OBRA DIRETO",
    grupos: [
      {
        id_grupo: 30,
        nome_grupo: "TRABALHADORES DIRETOS",
        recursos: [
          {
            id_recurso: 300,
            codigo_recurso: "MO-001",
            descricao: "PEDREIRO",
            unidade_medida: "H"
          },
          {
            id_recurso: 301,
            codigo_recurso: "MO-002",
            descricao: "SERVENTE",
            unidade_medida: "H"
          }
        ]
      }
    ]
  },
  {
    id_tipo: 5,
    nome_tipo: "SERVIÇOS DE TERCEIROS",
    grupos: [
      {
        id_grupo: 40,
        nome_grupo: "SERVIÇOS ESPECIALIZADOS",
        recursos: [
          {
            id_recurso: 400,
            codigo_recurso: "ST-001",
            descricao: "LOCAÇÃO DE EQUIPAMENTO",
            unidade_medida: "DIA"
          }
        ]
      }
    ]
  }
];