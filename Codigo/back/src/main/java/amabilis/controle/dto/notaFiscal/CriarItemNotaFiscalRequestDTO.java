package amabilis.controle.dto.notaFiscal;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CriarItemNotaFiscalRequestDTO(
        Long id,

        @NotNull(message = "O valor do item é obrigatório")
        BigDecimal valorItem,

        @NotNull(message = "O id do recurso é obrigatório")
        Long recursoId
) {
}
