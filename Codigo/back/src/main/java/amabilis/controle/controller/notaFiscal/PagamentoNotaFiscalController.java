package amabilis.controle.controller.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;
import amabilis.controle.dto.PaginaResponseDTO;
import amabilis.controle.dto.notaFiscal.CardPagamentoNotaFiscalDTO;
import amabilis.controle.dto.notaFiscal.FiltroCardsPagamentoDTO;
import amabilis.controle.dto.notaFiscal.NovoPagamentoNotaFiscalDTO;
import amabilis.controle.dto.notaFiscal.PagamentoNotaFiscalDTO;
import amabilis.controle.dto.notaFiscal.StatusNotaFiscalRequestDTO;
import amabilis.controle.dto.notaFiscal.AgendarPagamentoDTO;
import amabilis.controle.service.notaFiscal.PagamentoNotaFiscalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/nota-fiscal")
public class PagamentoNotaFiscalController {

    @Autowired
    private PagamentoNotaFiscalService pagamentoNotaFiscalService;

    @GetMapping("/pagamentos")
    public ResponseEntity<PaginaResponseDTO<CardPagamentoNotaFiscalDTO>> listarCardsPagamentos(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanhoPagina,
            @RequestParam(defaultValue = "dataVencimento") String ordenarPor,
            @RequestParam(defaultValue = "ASC") String direcao, // ASC para mostrar as mais próximas de vencer primeiro
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) String nomeObra,
            @RequestParam(required = false) StatusNotaFiscal statusNotaFiscal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataVencimentoInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataVencimentoFim
    ) {
        Sort.Direction sentido = Sort.Direction.fromString(direcao);
        Pageable paginacao = PageRequest.of(pagina, tamanhoPagina, Sort.by(sentido, ordenarPor));
        FiltroCardsPagamentoDTO filtro = new FiltroCardsPagamentoDTO(termo, nomeObra, statusNotaFiscal, dataVencimentoInicio, dataVencimentoFim);

        return ResponseEntity.ok(pagamentoNotaFiscalService.listarCardsPagamentos(filtro, paginacao));
    }

    @PostMapping("/{notaFiscalId}/pagamentos")
    public ResponseEntity<PagamentoNotaFiscalDTO> registrarPagamento(@PathVariable Long notaFiscalId, @RequestBody @Valid NovoPagamentoNotaFiscalDTO dto){
        return ResponseEntity.ok(pagamentoNotaFiscalService.registrarPagamento(notaFiscalId, dto));
    }

    @PostMapping("/{notaFiscalId}/pagamentos/agendar")
    public ResponseEntity<List<PagamentoNotaFiscalDTO>> registrarPagamentosAgendados(@PathVariable Long notaFiscalId, @RequestBody @Valid List<AgendarPagamentoDTO> dtos){
        return ResponseEntity.ok(pagamentoNotaFiscalService.registrarPagamentosAgendados(notaFiscalId, dtos));
    }

    @PutMapping("/{notaFiscalId}/status")
    public ResponseEntity<Void> alterarStatus(@PathVariable Long notaFiscalId, @RequestBody @Valid StatusNotaFiscalRequestDTO dto){
        pagamentoNotaFiscalService.alterarStatus(notaFiscalId, dto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/pagamentos/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pagamentoNotaFiscalService.deletar(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
