package amabilis.controle.dto.notaFiscal;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import amabilis.controle.domain.enums.StatusPagamento;

public record PagamentoNotaFiscalDTO(
        Long id,
        LocalDate dataPagamento,

        @Positive(message = "O valor pago deve ser superior a 0")
        BigDecimal valorPago,
        
        StatusPagamento statusPagamento
) {
}
