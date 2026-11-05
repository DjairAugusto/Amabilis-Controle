package amabilis.controle.dto;

import amabilis.controle.domain.enums.TipoRecurso;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record GrupoRecursoDTO(
    Long id,

    @NotBlank(message = "nomeGrupo é obrigatório")
    String nomeGrupo,

    @NotNull(message = "tipoRecurso é obrigatório")
    TipoRecurso tipoRecurso
) {
}
