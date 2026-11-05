package amabilis.controle.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import amabilis.controle.domain.GrupoRecurso;
import amabilis.controle.dto.GrupoRecursoDTO;
import amabilis.controle.repository.GrupoRecursoRepository;

@Service
public class GrupoRecursoService {

    @Autowired
    private GrupoRecursoRepository grupoRecursoRepository;

    public List<GrupoRecursoDTO> listar() {
        return grupoRecursoRepository.findAll().stream()
            .map(this::toDTO)
            .toList();
    }

    public GrupoRecursoDTO criar(GrupoRecursoDTO dto) {
        validar(dto);

        String nomeGrupoNormalizado = dto.nomeGrupo().trim();
        validarDuplicidade(nomeGrupoNormalizado, dto.tipoRecurso(), null);

        GrupoRecurso grupo = new GrupoRecurso();
        grupo.setNomeGrupo(nomeGrupoNormalizado);
        grupo.setTipoRecurso(dto.tipoRecurso());

        return toDTO(grupoRecursoRepository.save(grupo));
    }

    public GrupoRecursoDTO atualizar(Long id, GrupoRecursoDTO dto) {
        validar(dto);

        String nomeGrupoNormalizado = dto.nomeGrupo().trim();
        validarDuplicidade(nomeGrupoNormalizado, dto.tipoRecurso(), id);

        GrupoRecurso grupo = grupoRecursoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo de recurso não encontrado"));

        grupo.setNomeGrupo(nomeGrupoNormalizado);
        grupo.setTipoRecurso(dto.tipoRecurso());

        return toDTO(grupoRecursoRepository.save(grupo));
    }

    private void validar(GrupoRecursoDTO dto) {
        if (dto.nomeGrupo() == null || dto.nomeGrupo().isBlank() || dto.tipoRecurso() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados obrigatórios não informados");
        }
    }

    private void validarDuplicidade(String nomeGrupo, amabilis.controle.domain.enums.TipoRecurso tipoRecurso, Long ignorarId) {
        boolean duplicado = grupoRecursoRepository.existsDuplicado(nomeGrupo, tipoRecurso, ignorarId);
        if (duplicado) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ja existe grupo com este nome para este tipo");
        }
    }

    private GrupoRecursoDTO toDTO(GrupoRecurso grupo) {
        return new GrupoRecursoDTO(
            grupo.getId(),
            grupo.getNomeGrupo(),
            grupo.getTipoRecurso()
        );
    }


    public void deletar(Long id) {
    GrupoRecurso grupo = grupoRecursoRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo de recurso não encontrado"));
    grupoRecursoRepository.delete(grupo);
}
}
