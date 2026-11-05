package amabilis.controle.dto.relatorio;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RelatorioCustoLinhaDTO(
        Long id,
        LocalDate emissao,
        LocalDate vencimento,
        LocalDate pagto,
        String documento,
        String fornecedor,
        String codTarefa,
        String descricaoTarefa,
        String codRecurso,
        String descricaoRecurso,
        BigDecimal valorItem
) {
}