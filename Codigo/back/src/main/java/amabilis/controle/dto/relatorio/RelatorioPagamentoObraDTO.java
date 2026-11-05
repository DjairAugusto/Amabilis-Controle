package amabilis.controle.dto.relatorio;

import java.math.BigDecimal;
import java.util.List;

public record RelatorioPagamentoObraDTO(
        Long obraId,
        String obraNome,
        BigDecimal totalPago,
        List<RelatorioPagamentoLinhaDTO> relatorioSaida
) {
}