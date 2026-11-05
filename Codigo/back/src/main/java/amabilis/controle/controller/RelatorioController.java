package amabilis.controle.controller;

import amabilis.controle.dto.PaginaResponseDTO;
import amabilis.controle.dto.relatorio.FiltroRelatorioCustosDTO;
import amabilis.controle.dto.relatorio.FiltroRelatorioPagamentosDTO;
import amabilis.controle.dto.relatorio.RelatorioCustoLinhaDTO;
import amabilis.controle.dto.relatorio.RelatorioPagamentoLinhaDTO;
import amabilis.controle.service.relatorio.RelatorioCustosExcelService;
import amabilis.controle.service.relatorio.RelatorioCustosService;
import amabilis.controle.service.relatorio.RelatorioPagamentosExcelService;
import amabilis.controle.service.relatorio.RelatorioPagamentosService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/obra/{obraId}/relatorio")
public class RelatorioController {

    @Autowired
    private RelatorioCustosExcelService relatorioCustosExcelService;

    @Autowired
    private RelatorioCustosService relatorioCustosService;

    @Autowired
    private RelatorioPagamentosExcelService relatorioPagamentosExcelService;

    @Autowired
    private RelatorioPagamentosService relatorioPagamentosService;

    @GetMapping("/custos")
    public ResponseEntity<PaginaResponseDTO<RelatorioCustoLinhaDTO>> obterRelatorioCustos(
            @PathVariable Long obraId,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanhoPagina,
            @RequestParam(defaultValue = "emissao") String ordenarPor,
            @RequestParam(defaultValue = "DESC") String direcao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEmissaoInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEmissaoFim,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEmissao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataVencimento,
            @RequestParam(required = false) Long fornecedorId,
            @RequestParam(required = false) String codigoTarefa,
            @RequestParam(required = false) String codigoRecurso,
            @RequestParam(required = false) String codigoNf) {

        Pageable pageable = PageRequest.of(pagina, tamanhoPagina,
                Sort.by(Sort.Direction.fromString(direcao), ordenarPor));
        FiltroRelatorioCustosDTO filtro = new FiltroRelatorioCustosDTO(
                dataEmissaoInicio, dataEmissaoFim, dataEmissao, dataVencimento,
                fornecedorId, codigoTarefa, codigoRecurso, codigoNf);

        return ResponseEntity.ok(relatorioCustosService.obterRelatorio(obraId, filtro, pageable));
    }

    @GetMapping("/pagamentos")
    public ResponseEntity<PaginaResponseDTO<RelatorioPagamentoLinhaDTO>> obterRelatorioPagamentos(
            @PathVariable Long obraId,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanhoPagina,
            @RequestParam(defaultValue = "dataPagamento") String ordenarPor,
            @RequestParam(defaultValue = "DESC") String direcao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEmissaoInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEmissaoFim,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEmissao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataVencimento,
            @RequestParam(required = false) String codigoNf) {

        Pageable pageable = PageRequest.of(pagina, tamanhoPagina,
                Sort.by(Sort.Direction.fromString(direcao), ordenarPor));
        FiltroRelatorioPagamentosDTO filtro = new FiltroRelatorioPagamentosDTO(
                dataEmissaoInicio, dataEmissaoFim, dataEmissao, dataVencimento, codigoNf);

        return ResponseEntity.ok(relatorioPagamentosService.obterRelatorio(obraId, filtro, pageable));
    }

    @GetMapping("/custos/excel")
    public void gerarRelatorioCustosExcel(@PathVariable Long obraId, HttpServletResponse response) {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=relatorio-custos.xlsx");
        relatorioCustosExcelService.gerarRelatorio(obraId, response);
    }

    @GetMapping("/pagamentos/excel")
    public void gerarRelatorioPagamentosExcel(@PathVariable Long obraId, HttpServletResponse response) {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=relatorio-pagamentos.xlsx");
        relatorioPagamentosExcelService.gerarRelatorio(obraId, response);
    }
}
