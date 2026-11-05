import { useState } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Building2,
  ListTree,
  AlignVerticalJustifyEnd,
  Truck,
  HandCoins,
  BarChart3,
  Map,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import './Tutorial.css';

const sections = [
  {
    id: 'dashboard',
    icon: <LayoutDashboard size={20} />,
    title: 'Dashboard',
    description:
      'A tela inicial do sistema. Apresenta um painel consolidado com os principais indicadores das obras em andamento, permitindo uma visão rápida da saúde financeira e operacional dos projetos.',
    features: [
      'Resumo geral com total de obras ativas, concluídas e pausadas.',
      'Gráfico de evolução mensal de custos ao longo do tempo.',
      'Distribuição de despesas por fornecedor em gráfico de pizza.',
      'Custo por grupo de recursos para identificar onde o orçamento está sendo consumido.',
    ],
  },
  {
    id: 'obras',
    icon: <Building2 size={20} />,
    title: 'Obras',
    description:
      'Módulo central de cadastro e acompanhamento dos empreendimentos. Registre novas obras, defina orçamentos, prazos e monitore o andamento de cada projeto individualmente.',
    features: [
      'Cadastre uma nova obra informando nome, descrição, data de início e prazo estimado.',
      'Defina o orçamento inicial e acompanhe o custo acumulado em tempo real.',
      'Altere o status da obra entre "Em Andamento", "Concluída" ou "Pausada".',
      'Acesse a página de detalhes de cada obra para ver tarefas, notas fiscais e resumo financeiro.',
      'Utilize a barra de pesquisa para filtrar obras pelo nome rapidamente.',
    ],
  },
  {
    id: 'tarefas',
    icon: <ListTree size={20} />,
    title: 'Tarefas',
    description:
      'Gerencie o cronograma das obras dividindo cada empreendimento em etapas menores. Controle prazos individuais e vincule custos diretamente a cada fase do projeto.',
    features: [
      'Crie tarefas associadas a uma obra específica, com prazo e status próprios.',
      'Acompanhe o percentual de conclusão de cada etapa do projeto.',
      'Vincule despesas e notas fiscais diretamente a uma tarefa para rastreabilidade.',
      'Filtre tarefas por obra, status ou período para facilitar o gerenciamento.',
      'Atualize o status para "Pendente", "Em Andamento" ou "Concluída".',
    ],
  },
  {
    id: 'recursos',
    icon: <AlignVerticalJustifyEnd size={20} />,
    title: 'Recursos',
    description:
      'Cadastro e categorização de todos os insumos, maquinários e mão de obra utilizados nas obras. Organize os recursos em grupos para facilitar o controle e a geração de relatórios.',
    features: [
      'Crie Grupos de Recursos (ex: Mão de Obra, Materiais, Maquinário).',
      'Cadastre recursos individualmente vinculando-os a um grupo.',
      'Consulte quais recursos estão alocados em quais obras.',
      'Use os grupos para filtrar custos nos relatórios financeiros.',
    ],
  },
  {
    id: 'fornecedores',
    icon: <Truck size={20} />,
    title: 'Fornecedores',
    description:
      'Mantenha o catálogo atualizado de todos os fornecedores de materiais e serviços. Controle a origem dos insumos e facilite a emissão de notas fiscais.',
    features: [
      'Cadastre fornecedores com CNPJ, nome, contato e endereço.',
      'Vincule fornecedores às notas fiscais lançadas no sistema.',
      'Pesquise e filtre o cadastro de fornecedores por nome ou CNPJ.',
      'Edite ou inative fornecedores conforme necessário.',
    ],
  },
  {
    id: 'pagamentos',
    icon: <HandCoins size={20} />,
    title: 'Pagamentos e Notas Fiscais',
    description:
      'Módulo financeiro para lançamento de notas fiscais, controle de despesas e pagamentos vinculados diretamente às obras. Garanta rastreabilidade total dos gastos do canteiro.',
    features: [
      'Lance notas fiscais com valor, data, fornecedor e obra/tarefa associada.',
      'Registre o status de pagamento: "Pendente", "Pago" ou "Vencido".',
      'Consulte o histórico completo de movimentações financeiras por obra.',
      'Exporte os dados financeiros para arquivos Excel para análise externa.',
      'Filtre lançamentos por período, obra, fornecedor ou status de pagamento.',
    ],
  },
  {
    id: 'relatorios',
    icon: <BarChart3 size={20} />,
    title: 'Relatórios',
    description:
      'Geração de relatórios consolidados e auditorias financeiras. Obtenha uma visão analítica e detalhada dos dados do sistema para tomada de decisão.',
    features: [
      'Gere relatórios de despesas agrupados por obra, tarefa ou fornecedor.',
      'Exporte relatórios para Excel com um clique.',
      'Aplique filtros por período para análises mensais ou anuais.',
      'Acompanhe desvios entre o orçamento planejado e o custo realizado.',
    ],
  },
  {
    id: 'mapa',
    icon: <Map size={20} />,
    title: 'Mapa',
    description:
      'Visualização geográfica interativa das obras cadastradas no sistema. Ideal para otimização logística e gestão espacial dos empreendimentos.',
    features: [
      'Visualize todas as obras ativas em um mapa interativo.',
      'Clique em um marcador para ver o resumo rápido da obra.',
      'Identifique a concentração geográfica dos projetos para otimizar rotas.',
      'Navegue, aproxime e afaste o mapa para diferentes níveis de detalhe.',
    ],
  },
];

const Tutorial = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const activeSection = sections.find((s) => s.id === activeTab);

  return (
    <section className="tutorial-section">
      <div className="tutorial-header">
        <div className="tutorial-header-icon">
          <BookOpen size={28} />
        </div>
        <div>
          <h1 className="tutorial-title">Como Usar o Sistema</h1>
          <p className="tutorial-subtitle">
            Guia completo das funcionalidades do Amabilis Controle
          </p>
        </div>
      </div>

      <div className="tutorial-layout">
        <aside className="tutorial-tabs">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`tutorial-tab-btn ${activeTab === section.id ? 'active' : ''}`}
              onClick={() => setActiveTab(section.id)}
            >
              <span className="tutorial-tab-icon">{section.icon}</span>
              <span className="tutorial-tab-text">{section.title}</span>
              {activeTab === section.id && (
                <ChevronRight size={16} className="tutorial-tab-arrow" />
              )}
            </button>
          ))}
        </aside>

        <div className="tutorial-content">
          {activeSection && (
            <div className="tutorial-card">
              <div className="tutorial-card-header">
                <span className="tutorial-card-icon">{activeSection.icon}</span>
                <h2 className="tutorial-card-title">{activeSection.title}</h2>
              </div>
              <p className="tutorial-card-description">{activeSection.description}</p>

              <div className="tutorial-features-title">Funcionalidades principais</div>
              <ul className="tutorial-features-list">
                {activeSection.features.map((feature, index) => (
                  <li key={index} className="tutorial-feature-item">
                    <CheckCircle2 size={18} className="tutorial-feature-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Tutorial;
