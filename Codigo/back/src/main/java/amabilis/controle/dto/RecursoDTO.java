package amabilis.controle.dto;

import amabilis.controle.domain.enums.TipoRecurso;
import amabilis.controle.domain.enums.UnidadeMedida;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record RecursoDTO(
	
	Long id,

	String codigoHierarquico,

	TipoRecurso tipoRecurso,

	
	Long recursoPaiId,

	@NotBlank(message = "descricao é obrigatória")
	String descricao,

	@NotNull(message = "grupoRecursoId é obrigatório")
	Long grupoRecursoId,

	String grupoRecursoNome,

	@NotNull(message = "unidadeMedida é obrigatória")
	UnidadeMedida unidadeMedida
) {

}
