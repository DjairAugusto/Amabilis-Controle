package amabilis.controle.dto;

import amabilis.controle.domain.enums.TipoTarefa;
import amabilis.controle.domain.enums.UnidadeMedida;

public record TarefaDTO(
        Long id,
        String codigoTarefa,
        Long tarefaPaiId,
        UnidadeMedida unidadeMedida,
        String descricao,
        TipoTarefa tipoTarefa
) {}
