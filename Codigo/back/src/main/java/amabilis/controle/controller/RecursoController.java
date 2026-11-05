package amabilis.controle.controller;

import java.util.List;

import jakarta.validation.Valid; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import amabilis.controle.dto.RecursoDTO;
import amabilis.controle.dto.RecursoHierarquiaDTO;
import amabilis.controle.dto.DescricaoRequestDTO;
import amabilis.controle.service.RecursoService;

@RestController
@RequestMapping("/recurso")
public class RecursoController {

    @Autowired
    private RecursoService recursoService;

    @GetMapping
    public ResponseEntity<List<RecursoDTO>> listar() {
        return ResponseEntity.ok(recursoService.listar());
    }

    @GetMapping("/hierarquia")
    public ResponseEntity<List<RecursoHierarquiaDTO>> listarHierarquia() {
        return ResponseEntity.ok(recursoService.listarComHierarquia());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecursoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(recursoService.buscarPorId(id));
    }

    @PostMapping("/obter-descricao")
    public ResponseEntity<List<RecursoDTO>> buscarPorDescricao(@Valid @RequestBody DescricaoRequestDTO dto) {
        return ResponseEntity.ok(recursoService.buscarPorDescricao(dto));
    }

    @PostMapping
    public ResponseEntity<RecursoDTO> criar(@Valid @RequestBody RecursoDTO dto) {
        RecursoDTO recursoCriado = recursoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(recursoCriado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecursoDTO> atualizar(@PathVariable Long id, @Valid @RequestBody RecursoDTO dto) {
        return ResponseEntity.ok(recursoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        recursoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

}