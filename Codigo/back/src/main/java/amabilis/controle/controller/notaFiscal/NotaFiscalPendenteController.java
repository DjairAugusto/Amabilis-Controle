package amabilis.controle.controller.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;
import amabilis.controle.dto.PaginaResponseDTO;
import amabilis.controle.dto.notaFiscal.FiltroNotaFiscalPendenteDTO;
import amabilis.controle.dto.notaFiscal.NotaFiscalPendenteDTO;
import amabilis.controle.service.notaFiscal.NotaFiscalPendenteService;
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
@RequestMapping("/nota-fiscal")
public class NotaFiscalPendenteController {

    @Autowired
    private NotaFiscalPendenteService notaFiscalPendenteService;

    @GetMapping("/obra/{obraId}/pendentes")
    public ResponseEntity<PaginaResponseDTO<NotaFiscalPendenteDTO>> listarPendentes(
            @PathVariable Long obraId,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanhoPagina,
            @RequestParam(defaultValue = "dataVencimento") String ordenarPor,
            @RequestParam(defaultValue = "ASC") String direcao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEmissaoInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEmissaoFim,
            @RequestParam(required = false) String numeroNf,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEmissao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataVencimento,
            @RequestParam(required = false) Long fornecedorId,
            @RequestParam(required = false) StatusNotaFiscal status
    ) {
        Pageable pageable = PageRequest.of(pagina, tamanhoPagina,
                Sort.by(Sort.Direction.fromString(direcao), ordenarPor));

        FiltroNotaFiscalPendenteDTO filtro = new FiltroNotaFiscalPendenteDTO(
                dataEmissaoInicio, dataEmissaoFim, numeroNf, dataEmissao, dataVencimento, fornecedorId, status);

        return ResponseEntity.ok(notaFiscalPendenteService.listarNFsPendentes(obraId, filtro, pageable));
    }
}
