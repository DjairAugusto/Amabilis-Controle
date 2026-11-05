package amabilis.controle.dto;

import amabilis.controle.domain.enums.TipoRecurso;
import amabilis.controle.domain.enums.UnidadeMedida;

public record RecursoBasicoDTO(
    Long id,
    String codigoHierarquico,
    TipoRecurso tipoRecurso,
    String descricao,
    GrupoRecursoDTO grupoRecurso,
    UnidadeMedida unidadeMedida
) {}

