package amabilis.controle.dto.relatorio;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RelatorioPagamentoLinhaDTO(
        Long id,
        String numeroDocumento,
        LocalDate emissao,
        LocalDate vencimento,
        LocalDate pagto,
        BigDecimal valorPago
) {
}