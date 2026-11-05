package amabilis.controle.dto.notaFiscal;

import jakarta.validation.constraints.NotNull;

public record AlocacaoItensRequestDTO(
        @NotNull(message = "O id do item é obrigatório")
        Long itemNotaFiscalId,

        @NotNull(message = "O id da tarefa é obrigatório")
        Long tarefaId
) {
}
