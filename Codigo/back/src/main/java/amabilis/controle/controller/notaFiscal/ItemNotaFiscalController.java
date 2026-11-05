package amabilis.controle.controller.notaFiscal;

import amabilis.controle.dto.notaFiscal.AlocacaoItensRequestDTO;
import amabilis.controle.dto.notaFiscal.ItemNotaFiscalResponseDTO;
import amabilis.controle.service.notaFiscal.ItemNotaFiscalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nota-fiscal/{notaFiscalId}")
public class ItemNotaFiscalController {

    @Autowired
    private ItemNotaFiscalService itemNotaFiscalService;

    @GetMapping("/itens")
    public ResponseEntity<List<ItemNotaFiscalResponseDTO>> listar(@PathVariable Long notaFiscalId) {
        return ResponseEntity.ok(itemNotaFiscalService.listarPorNotaFiscal(notaFiscalId));
    }

    @PostMapping("/atribuir-itens")
    public ResponseEntity<Void> atribuirItens(@PathVariable Long notaFiscalId, @RequestBody @Valid List<AlocacaoItensRequestDTO> lote) {
        itemNotaFiscalService.processarLote(notaFiscalId, lote);
        return ResponseEntity.ok().build();
    }
}