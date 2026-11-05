package amabilis.controle.dto.notaFiscal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AgendarPagamentoDTO(
        @NotNull(message = "A data de pagamento é obrigatória")
        LocalDate dataPagamento,

        @Positive(message = "O valor pago deve ser superior a 0")
        @NotNull(message = "O valor pago é obrigatório")
        BigDecimal valorPago
) {
}
