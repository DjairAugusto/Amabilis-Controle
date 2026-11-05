package amabilis.controle.dto;

import amabilis.controle.domain.enums.StatusItemObra;
import jakarta.validation.constraints.NotNull;

public record StatusItemObraRequestDTO(
        @NotNull(message = "O status do item é obrigatório")
        StatusItemObra status
) {
}
