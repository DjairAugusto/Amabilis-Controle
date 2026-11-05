package amabilis.controle.controller.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;
import amabilis.controle.dto.PaginaResponseDTO;
import amabilis.controle.dto.notaFiscal.*;
import amabilis.controle.service.notaFiscal.NotaFiscalService;
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

@RestController
@RequestMapping("/nota-fiscal")
public class NotaFiscalController {

    @Autowired
    private NotaFiscalService notaFiscalService;

    @GetMapping("/{id}")
    public ResponseEntity<NotaFiscalComItensResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(notaFiscalService.buscarPorId(id));
    }

    @GetMapping("/obra/{obraId}")
    public ResponseEntity<PaginaResponseDTO<NotaFiscalResponseDTO>> listarPorObra(
            @PathVariable Long obraId,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanhoPagina,
            @RequestParam(defaultValue = "dataEmissao") String ordenarPor,
            @RequestParam(defaultValue = "DESC") String direcao,
            @RequestParam(required = false) StatusNotaFiscal statusNotaFiscal,
            @RequestParam(required = false) Long fornecedorId,
            @RequestParam(required = false) String numeroDocumento,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEmissao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataVencimento) {

        Sort.Direction sentido = Sort.Direction.fromString(direcao);
        Pageable paginacao = PageRequest.of(pagina, tamanhoPagina, Sort.by(sentido, ordenarPor));
        FiltroNotaFiscalDTO filtro = new FiltroNotaFiscalDTO(
                statusNotaFiscal, fornecedorId, numeroDocumento, dataEmissao, dataVencimento);

        return ResponseEntity.ok(notaFiscalService.listarPorObraComFiltros(obraId, filtro, paginacao));
    }

    @PostMapping("/obra/{obraId}")
    public ResponseEntity<NotaFiscalComItensResponseDTO> criar(
            @PathVariable Long obraId,
            @RequestBody @Valid CriarNotaFiscalComItensRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(notaFiscalService.criar(obraId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotaFiscalComItensResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid AtualizarNotaFiscalComItensRequestDTO dto) {
        return ResponseEntity.ok(notaFiscalService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        notaFiscalService.deletar(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
