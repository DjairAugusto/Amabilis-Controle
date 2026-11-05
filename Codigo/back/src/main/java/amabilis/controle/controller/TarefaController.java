package amabilis.controle.controller;

import amabilis.controle.dto.TarefaDTO;
import amabilis.controle.dto.TarefaHierarquiaDTO;
import amabilis.controle.service.TarefaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tarefa")
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

    @GetMapping
    public ResponseEntity<List<TarefaDTO>> listar() {
        return ResponseEntity.ok(tarefaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TarefaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tarefaService.buscarPorId(id));
    }

    @GetMapping("/hierarquia")
    public ResponseEntity<List<TarefaHierarquiaDTO>> listarHierarquia() {
        return ResponseEntity.ok(tarefaService.listarComHierarquiaDeTarefas());
    }

    @PostMapping
    public ResponseEntity<TarefaDTO> criar(@RequestBody @Valid TarefaDTO dto) {
        TarefaDTO tarefaCriada = tarefaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(tarefaCriada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarefaDTO> atualizar(@PathVariable Long id, @RequestBody @Valid TarefaDTO dto) {
        return ResponseEntity.ok(tarefaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        tarefaService.deletar(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
