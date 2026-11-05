package amabilis.controle.controller;

import java.util.List;

import amabilis.controle.dto.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import amabilis.controle.service.ObraService;

@RestController
@RequestMapping("/obra")
public class ObraController {

    @Autowired
    private ObraService obraService;

    @PostMapping
    public ResponseEntity<RetornoObraDTO> criar(@RequestBody CriarObraDTO dto) {
        return ResponseEntity.ok(obraService.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<RetornoObraDTO>> listarTodas(){
        return ResponseEntity.ok(obraService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RetornoObraDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(obraService.buscarPorId(id));    
    }

    @PutMapping("/{id}")
    public ResponseEntity<RetornoObraDTO> atualizar(@PathVariable Long id, @RequestBody CriarObraDTO dto) {
        return ResponseEntity.ok(obraService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        obraService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/atribuir-tarefas")
    public ResponseEntity<Void> atribuirTarefa(@PathVariable Long id, @RequestBody AlocacaoTarefasRequestDTO dto) {
        obraService.atribuirTarefa(id, dto);
        return ResponseEntity.ok().build();

    }

    @GetMapping("/cards")
    public ResponseEntity<PaginaResponseDTO<CardObraDTO>> listarCards(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "9") int tamanhoPagina, // 🟢 Padrão será 9 cards por página
            @RequestParam(defaultValue = "nomeObra") String ordenarPor,
            @RequestParam(defaultValue = "ASC") String direcao,
            @RequestParam(required = false) String termo
    ) {
        Sort.Direction sentido = Sort.Direction.fromString(direcao);
        Pageable paginacao = PageRequest.of(pagina, tamanhoPagina, Sort.by(sentido, ordenarPor));

        return ResponseEntity.ok(obraService.listarCardsPaginados(termo, paginacao));
    }

    @GetMapping("/maps")
        public ResponseEntity<List<CardObraMapsDTO>> listarCardsMaps() {
        return ResponseEntity.ok(obraService.listarCardsMaps());
    }

    @PutMapping("/itens/{itemId}/atualizar-status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long itemId, @Valid @RequestBody StatusItemObraRequestDTO dto) {
        obraService.atualizarStatus(itemId, dto);
        return ResponseEntity.ok().build();
    }

    

}
