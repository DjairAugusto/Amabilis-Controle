package amabilis.controle.dto.relatorio;

import java.math.BigDecimal;
import java.util.List;

public record RelatorioCustoObraDTO(
        Long obraId,
        String obraNome,
        BigDecimal custoTotal,
        List<RelatorioCustoLinhaDTO> relatorioSaida
) {
}