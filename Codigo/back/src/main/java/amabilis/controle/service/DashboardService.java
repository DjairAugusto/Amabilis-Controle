package amabilis.controle.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import amabilis.controle.domain.Obra;
import amabilis.controle.domain.Recurso;
import amabilis.controle.domain.enums.StatusNotaFiscal;
import amabilis.controle.domain.enums.StatusObra;
import amabilis.controle.domain.notaFiscal.ItemNotaFiscal;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import amabilis.controle.domain.notaFiscal.PagamentoNotaFiscal;
import amabilis.controle.dto.dashboard.DashboardResumoDTO;
import amabilis.controle.dto.dashboard.GraficoDTO;
import amabilis.controle.repository.ObraRepository;
import amabilis.controle.repository.notaFiscal.ItemNotaFiscalRepository;
import amabilis.controle.repository.notaFiscal.NotaFiscalRepository;

@Service
public class DashboardService {

    private static final DateTimeFormatter MONTH_LABEL_FORMATTER =
            DateTimeFormatter.ofPattern("MMM/yy", Locale.forLanguageTag("pt-BR"));

    private final ObraRepository obraRepository;
    private final NotaFiscalRepository notaFiscalRepository;
    private final ItemNotaFiscalRepository itemNotaFiscalRepository;

    public DashboardService(ObraRepository obraRepository,
                            NotaFiscalRepository notaFiscalRepository,
                            ItemNotaFiscalRepository itemNotaFiscalRepository) {
        this.obraRepository = obraRepository;
        this.notaFiscalRepository = notaFiscalRepository;
        this.itemNotaFiscalRepository = itemNotaFiscalRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getResumo() {
        List<Obra> obras = obraRepository.findAll();
        List<NotaFiscal> notas = notaFiscalRepository.findAll();

        int totalObras = obras.size();
        int obrasEmAndamento = (int) obras.stream()
                .map(Obra::getStatusObra)
                .filter(StatusObra.EM_ANDAMENTO::equals)
                .count();

        BigDecimal valorTotalNfs = notas.stream()
                .map(NotaFiscal::getValorTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int numeroTotalNfs = notas.size();

        BigDecimal totalPago = notas.stream()
                .flatMap(nf -> safeList(nf.getPagamentos()).stream())
                .map(PagamentoNotaFiscal::getValorPago)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double porcentagemPaga = BigDecimal.ZERO.compareTo(valorTotalNfs) == 0
                ? 0.0
                : totalPago.multiply(BigDecimal.valueOf(100)).divide(valorTotalNfs, 2, RoundingMode.HALF_UP).doubleValue();

        int nfVencidas = (int) notas.stream()
                .map(NotaFiscal::getStatusNotaFiscal)
                .filter(StatusNotaFiscal.VENCIDA::equals)
                .count();

        BigDecimal valorFaltanteNFs = notas.stream()
                .filter(nf -> StatusNotaFiscal.VENCIDA.equals(nf.getStatusNotaFiscal()))
                .map(nf -> {
                    BigDecimal faltante = safeAmount(nf.getValorTotal()).subtract(safeAmount(nf.getValorTotalPago()));
                    return faltante.max(BigDecimal.ZERO);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> resumo = new LinkedHashMap<>();
        resumo.put("totalObras", totalObras);
        resumo.put("obrasEmAndamento", obrasEmAndamento);
        resumo.put("valorTotalNfs", valorTotalNfs);
        resumo.put("numeroTotalNfs", numeroTotalNfs);
        resumo.put("totalPago", totalPago);
        resumo.put("porcentagemPaga", porcentagemPaga);
        resumo.put("nfVencidas", nfVencidas);
        resumo.put("valorFaltanteNFs", valorFaltanteNFs);
        return resumo;
    }

    @Transactional(readOnly = true)
    public GraficoDTO getPagamentosGrafico() {
        Map<YearMonth, BigDecimal> acumuladoPorMes = new LinkedHashMap<>();

        for (NotaFiscal nf : notaFiscalRepository.findAll()) {
            for (PagamentoNotaFiscal pagamento : safeList(nf.getPagamentos())) {
                if (pagamento.getDataPagamento() == null) {
                    continue;
                }

                YearMonth month = YearMonth.from(pagamento.getDataPagamento());
                acumuladoPorMes.merge(month, safeAmount(pagamento.getValorPago()), BigDecimal::add);
            }
        }

        List<YearMonth> meses = acumuladoPorMes.keySet().stream().sorted().toList();
        List<String> labels = meses.stream()
                .map(month -> month.format(MONTH_LABEL_FORMATTER))
                .collect(Collectors.toCollection(ArrayList::new));
        List<BigDecimal> data = meses.stream()
                .map(acumuladoPorMes::get)
                .collect(Collectors.toCollection(ArrayList::new));

        return new GraficoDTO(labels, data);
    }

    @Transactional(readOnly = true)
    public GraficoDTO getFornecedoresGrafico() {
        Map<String, BigDecimal> totalPorFornecedor = new LinkedHashMap<>();

        for (NotaFiscal nf : notaFiscalRepository.findAll()) {
            String nomeFornecedor = nf.getFornecedor() != null
                    ? firstNonBlank(nf.getFornecedor().getNomeFantasia(), nf.getFornecedor().getRazaoSocial())
                    : "Sem fornecedor";
            totalPorFornecedor.merge(nomeFornecedor, BigDecimal.ONE, BigDecimal::add);
        }

        List<Map.Entry<String, BigDecimal>> top = totalPorFornecedor.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue(Comparator.reverseOrder()))
                .limit(10)
                .toList();

        List<String> labels = top.stream().map(Map.Entry::getKey).collect(Collectors.toCollection(ArrayList::new));
        List<BigDecimal> data = top.stream().map(Map.Entry::getValue).collect(Collectors.toCollection(ArrayList::new));

        return new GraficoDTO(labels, data);
    }

    @Transactional(readOnly = true)
    public GraficoDTO getRecursosGrafico() {
        Map<String, BigDecimal> totalPorRecurso = new LinkedHashMap<>();

        for (ItemNotaFiscal item : itemNotaFiscalRepository.findAll()) {
            String categoria = recursoCategoria(item.getRecurso());
            totalPorRecurso.merge(categoria, safeAmount(item.getValorItem()), BigDecimal::add);
        }

        List<Map.Entry<String, BigDecimal>> top = totalPorRecurso.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue(Comparator.reverseOrder()))
                .limit(10)
                .toList();

        List<String> labels = top.stream().map(Map.Entry::getKey).collect(Collectors.toCollection(ArrayList::new));
        List<BigDecimal> data = top.stream().map(Map.Entry::getValue).collect(Collectors.toCollection(ArrayList::new));

        return new GraficoDTO(labels, data);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getEvolucaoMensal(LocalDate dataInicio, LocalDate dataFim) {
        return notaFiscalRepository.findAll().stream()
                .filter(nf -> inRange(nf.getDataEmissao(), dataInicio, dataFim))
                .sorted(Comparator.comparing(NotaFiscal::getDataEmissao))
                .map(this::toEvolucaoMensalMap)
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getEstatisticasObra(Long obraId) {
        Obra obra = obraRepository.findById(obraId).orElse(null);
        List<NotaFiscal> notas = notaFiscalRepository.findByObraId(obraId);

        DashboardResumoDTO resumo = buildResumo(obra == null ? List.of() : List.of(obra), notas);

        Map<String, Object> estatisticas = new LinkedHashMap<>();
        estatisticas.put("totalObras", resumo.getTotalObras());
        estatisticas.put("obrasEmAndamento", resumo.getObrasEmAndamento());
        estatisticas.put("valorTotalNfs", resumo.getValorTotalNfs());
        estatisticas.put("numeroTotalNfs", resumo.getNumeroTotalNfs());
        estatisticas.put("totalPago", resumo.getTotalPago());
        estatisticas.put("porcentagemPaga", resumo.getPorcentagemPaga());
        estatisticas.put("nfVencidas", resumo.getNfVencidas());
        estatisticas.put("valorFaltanteNFs", resumo.getValorFaltanteNFs());
        estatisticas.put("custoRecursos", aggregateCustoRecursos(notas));
        estatisticas.put("fornecedorNFChart", aggregateFornecedores(notas));
        List<Map<String, Object>> evolucaoMensal = new ArrayList<>();
        notas.stream()
            .sorted(Comparator.comparing(NotaFiscal::getDataEmissao))
            .map(this::toEvolucaoMensalMap)
            .forEach(evolucaoMensal::add);
        estatisticas.put("evolucaoMensal", evolucaoMensal);
        return estatisticas;
    }

    private DashboardResumoDTO buildResumo(List<Obra> obras, List<NotaFiscal> notas) {
        int totalObras = obras.size();
        int obrasEmAndamento = (int) obras.stream()
                .map(Obra::getStatusObra)
                .filter(StatusObra.EM_ANDAMENTO::equals)
                .count();

        BigDecimal valorTotalNfs = notas.stream()
                .map(NotaFiscal::getValorTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int numeroTotalNfs = notas.size();

        BigDecimal totalPago = notas.stream()
                .flatMap(nf -> safeList(nf.getPagamentos()).stream())
                .map(PagamentoNotaFiscal::getValorPago)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double porcentagemPaga = BigDecimal.ZERO.compareTo(valorTotalNfs) == 0
                ? 0.0
                : totalPago.multiply(BigDecimal.valueOf(100)).divide(valorTotalNfs, 2, RoundingMode.HALF_UP).doubleValue();

        int nfVencidas = (int) notas.stream()
                .map(NotaFiscal::getStatusNotaFiscal)
                .filter(StatusNotaFiscal.VENCIDA::equals)
                .count();

        BigDecimal valorFaltanteNFs = notas.stream()
                .filter(nf -> StatusNotaFiscal.VENCIDA.equals(nf.getStatusNotaFiscal()))
                .map(nf -> {
                    BigDecimal faltante = safeAmount(nf.getValorTotal()).subtract(safeAmount(nf.getValorTotalPago()));
                    return faltante.max(BigDecimal.ZERO);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardResumoDTO(
                totalObras,
                obrasEmAndamento,
                valorTotalNfs,
                numeroTotalNfs,
                totalPago,
                porcentagemPaga,
                nfVencidas,
                valorFaltanteNFs
        );
    }

    private List<Map<String, Object>> aggregateCustoRecursos(List<NotaFiscal> notas) {
        Map<String, BigDecimal> acumulado = new LinkedHashMap<>();

        for (NotaFiscal nf : notas) {
            for (ItemNotaFiscal item : safeList(nf.getItens())) {
                String categoria = recursoCategoria(item.getRecurso());
                acumulado.merge(categoria, safeAmount(item.getValorItem()), BigDecimal::add);
            }
        }

        List<Map<String, Object>> resultado = new ArrayList<>();
        acumulado.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue(Comparator.reverseOrder()))
                .forEach(entry -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("name", entry.getKey());
                    item.put("value", entry.getValue());
                    resultado.add(item);
                });
        return resultado;
    }

    private List<Map<String, Object>> aggregateFornecedores(List<NotaFiscal> notas) {
        Map<Long, Map<String, Object>> acumulado = new LinkedHashMap<>();

        for (NotaFiscal nf : notas) {
            if (nf.getFornecedor() == null) {
                continue;
            }

            long fornecedorId = nf.getFornecedor().getId();
            String nomeFornecedor = firstNonBlank(nf.getFornecedor().getNomeFantasia(), nf.getFornecedor().getRazaoSocial());

            Map<String, Object> atual = acumulado.get(fornecedorId);
            if (atual == null) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", fornecedorId);
                item.put("nomeFornecedor", nomeFornecedor);
                item.put("numeroNFs", 1);
                acumulado.put(fornecedorId, item);
            } else {
                Integer atualNumero = (Integer) atual.get("numeroNFs");
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", fornecedorId);
                item.put("nomeFornecedor", nomeFornecedor);
                item.put("numeroNFs", atualNumero + 1);
                acumulado.put(fornecedorId, item);
            }
        }

        List<Map<String, Object>> resultado = new ArrayList<>(acumulado.values());
        resultado.sort((a, b) -> ((Integer) b.get("numeroNFs")).compareTo((Integer) a.get("numeroNFs")));
        return resultado;
    }

    private Map<String, Object> toEvolucaoMensalMap(NotaFiscal nf) {
        List<Map<String, Object>> pagamentos = new ArrayList<>();
        safeList(nf.getPagamentos()).forEach(p -> {
            Map<String, Object> pagamento = new LinkedHashMap<>();
            pagamento.put("data", p.getDataPagamento());
            pagamento.put("valor", p.getValorPago());
            pagamentos.add(pagamento);
        });

        Map<String, Object> nota = new LinkedHashMap<>();
        nota.put("id", nf.getId());
        nota.put("numeroNF", nf.getNumeroDocumento());
        nota.put("emissao", nf.getDataEmissao());
        nota.put("valorTotal", nf.getValorTotal());
        nota.put("pagamentos", pagamentos);
        return nota;
    }

    private boolean inRange(LocalDate date, LocalDate start, LocalDate end) {
        return date != null
                && (start == null || !date.isBefore(start))
                && (end == null || !date.isAfter(end));
    }

    private String recursoCategoria(Recurso recurso) {
        if (recurso == null || recurso.getTipoRecurso() == null) {
            return "OUTROS";
        }

        return switch (recurso.getTipoRecurso()) {
            case MATERIAL -> "MATERIAL";
            case EQUIPAMENTO -> "EQUIPAMENTO";
            case SERVICO_DE_TERCEIRO -> "SERVIÇOS DE TERCEIROS";
            case MAO_DE_OBRA_DIRETO -> "MÃO DE OBRA DIRETA";
            case INDIRETO -> "INDIRETO";
        };
    }

    private BigDecimal safeAmount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private <T> List<T> safeList(List<T> list) {
        return list == null ? List.of() : list;
    }

    private String firstNonBlank(String first, String second) {
        if (first != null && !first.isBlank()) {
            return first;
        }
        if (second != null && !second.isBlank()) {
            return second;
        }
        return "Sem fornecedor";
    }
}
