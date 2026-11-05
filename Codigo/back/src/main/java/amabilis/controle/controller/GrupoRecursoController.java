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

import amabilis.controle.dto.GrupoRecursoDTO;
import amabilis.controle.service.GrupoRecursoService;

@RestController
@RequestMapping("/grupo-recurso")
public class GrupoRecursoController {

    @Autowired
    private GrupoRecursoService grupoRecursoService;

    @GetMapping
    public ResponseEntity<List<GrupoRecursoDTO>> listar() {
        return ResponseEntity.ok(grupoRecursoService.listar());
    }

    @PostMapping
    public ResponseEntity<GrupoRecursoDTO> criar(@RequestBody @Valid GrupoRecursoDTO dto) {
        GrupoRecursoDTO grupoCriado = grupoRecursoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(grupoCriado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GrupoRecursoDTO> atualizar(@PathVariable Long id, @RequestBody @Valid GrupoRecursoDTO dto) {
        return ResponseEntity.ok(grupoRecursoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        grupoRecursoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}