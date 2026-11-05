package amabilis.controle.dto.notaFiscal;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CardPagamentoNotaFiscalDTO(
        Long id,
        String codigoNf,
        String nomeFornecedor,
        String nomeObra,
        LocalDate dataVencimento,
        BigDecimal valorTotalPago,
        BigDecimal valorNota,
        BigDecimal saldo,
        String statusNf,
        List<PagamentoNotaFiscalDTO> pagamentos
) {
}

