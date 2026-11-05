package amabilis.controle.dto.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;

import java.math.BigDecimal;
import java.time.LocalDate;

public record NotaFiscalPendenteDTO(
        Long id,
        String numeroDocumento,
        String fornecedor,
        LocalDate dataEmissao,
        LocalDate dataVencimento,
        BigDecimal valorRestante,
        StatusNotaFiscal status
) {}