package amabilis.controle.dto.notaFiscal;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record NovoPagamentoNotaFiscalDTO(
        Long id,
        LocalDate dataPagamento,
        LocalDate proximaDataPagamento,

        @Positive(message = "O valor pago deve ser superior a 0")
        BigDecimal valorPago
) {
}

