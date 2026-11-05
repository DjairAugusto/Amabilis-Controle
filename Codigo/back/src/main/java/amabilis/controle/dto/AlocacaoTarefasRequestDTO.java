package amabilis.controle.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record AlocacaoTarefasRequestDTO(
        @NotEmpty(message = "A lista de ids das tarefas é obrigatória não pode estar vazia")
        List<Long> tarefaIds
) {
}
