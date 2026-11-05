package amabilis.controle.dto.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;
import amabilis.controle.dto.FornecedorDTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public record NotaFiscalResponseDTO(
        Long id,
        String numeroDocumento,
        LocalDate dataEmissao,
        LocalDate dataVencimento,
        BigDecimal valorTotal,
        BigDecimal valorTotalPago,
        StatusNotaFiscal statusNotaFiscal,
        FornecedorDTO fornecedor
) {
}
