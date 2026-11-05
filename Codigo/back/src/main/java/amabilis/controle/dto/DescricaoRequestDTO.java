package amabilis.controle.dto;

import jakarta.validation.constraints.NotNull;

public record DescricaoRequestDTO(
        @NotNull(message = "Descrições é obrigatório")
        String[] descricoes
) {
}

