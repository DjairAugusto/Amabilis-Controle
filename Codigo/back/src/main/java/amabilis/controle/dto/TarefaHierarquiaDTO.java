package amabilis.controle.dto;

import amabilis.controle.domain.enums.TipoTarefa;
import amabilis.controle.domain.enums.UnidadeMedida;

import java.util.List;

public record TarefaHierarquiaDTO(
        Long id,
        String codigoTarefa,
        String descricao,
        TipoTarefa tipoTarefa,
        UnidadeMedida unidadeMedida,
        List<TarefaHierarquiaDTO> children
) {
}
