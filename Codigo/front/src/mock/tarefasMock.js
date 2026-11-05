export const mockTarefasAninhadas = [
  {
    id_tarefa: 10,
    codigo_tarefa: "03.",
    descricao: "FUNDAÇÃO",
    unidade_medida: null,
    tipo_tarefa: "DIRETA",
    children: [
      {
        id_tarefa: 11,
        codigo_tarefa: "03.01",
        descricao: "ESTACA TRADO",
        unidade_medida: null,
        tipo_tarefa: "DIRETA",
        children: [
          {
            id_tarefa: 50, // <-- ALINHADO COM A OBRA MOCK
            codigo_tarefa: "03.01.01",
            descricao: "Mobilização e desmobilização de equito - EQ",
            unidade_medida: "VB",
            tipo_tarefa: "DIRETA",
            children: []
          },
          {
            id_tarefa: 51, // <-- ALINHADO COM A OBRA MOCK
            codigo_tarefa: "03.01.02",
            descricao: "Marcação, Locação tabeira - MO",
            unidade_medida: "M",
            tipo_tarefa: "DIRETA",
            children: []
          },
          {
            id_tarefa: 52, // <-- ALINHADO COM A OBRA MOCK
            codigo_tarefa: "03.01.03",
            descricao: "Perfuração Estaca trado ø 300mm - MO",
            unidade_medida: "M",
            tipo_tarefa: "DIRETA",
            children: []
          },
          {
            id_tarefa: 53, // <-- Tarefa extra solta no catálogo para você testar a marcação!
            codigo_tarefa: "03.01.04",
            descricao: "Perfuração Estaca trado ø 400mm - MO",
            unidade_medida: "M",
            tipo_tarefa: "DIRETA",
            children: []
          }
        ]
      }
    ]
  },
  {
    id_tarefa: 20,
    codigo_tarefa: "05.",
    descricao: "ESTRUTURA",
    unidade_medida: null,
    tipo_tarefa: "DIRETA",
    children: [
      {
        id_tarefa: 21,
        codigo_tarefa: "05.01",
        descricao: "CONCRETO ARMADO",
        unidade_medida: null,
        tipo_tarefa: "DIRETA",
        children: [
          {
            id_tarefa: 62,
            codigo_tarefa: "05.01.01",
            descricao: "Lançamento e Adensamento de Concreto - MO",
            unidade_medida: "M3",
            tipo_tarefa: "DIRETA",
            children: []
          }
        ]
      }
    ]
  },
  {
    id_tarefa: 30,
    codigo_tarefa: "99.01",
    descricao: "INSTALAÇÕES PROVISÓRIAS",
    unidade_medida: "-",
    tipo_tarefa: "INDIRETA",
    children: []
  }
];