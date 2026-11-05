package amabilis.controle.dto.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;
import jakarta.validation.constraints.NotNull;

public record StatusNotaFiscalRequestDTO(
        @NotNull(message = "O status é obrigatório")
        StatusNotaFiscal status
) {
}