package amabilis.controle.dto;

import java.util.Set;

import amabilis.controle.domain.enums.StatusItemObra;
import amabilis.controle.dto.notaFiscal.RetornoItemNotaFiscalDTO;

public record RetornoItemObraDTO(
        Long id,
        StatusItemObra status,
        TarefaDTO tarefa,
        Set<RetornoItemNotaFiscalDTO> recursos
) {
}
