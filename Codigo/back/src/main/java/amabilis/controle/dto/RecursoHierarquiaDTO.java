package amabilis.controle.dto;

import java.util.List;

import amabilis.controle.domain.enums.TipoRecurso;
import amabilis.controle.domain.enums.UnidadeMedida;

public record RecursoHierarquiaDTO(
    Long id,
    String codigoHierarquico,
    TipoRecurso tipoRecurso,
    String descricao,
    Long grupoRecursoId,
    String grupoRecursoNome,
    UnidadeMedida unidadeMedida,
    List<RecursoHierarquiaDTO> children
) {
}
