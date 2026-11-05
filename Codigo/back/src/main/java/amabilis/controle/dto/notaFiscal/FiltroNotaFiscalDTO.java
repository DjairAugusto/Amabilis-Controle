package amabilis.controle.dto.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;

import java.time.LocalDate;

public record FiltroNotaFiscalDTO(
        StatusNotaFiscal statusNotaFiscal,
        Long fornecedorId,
        String numeroDocumento,
        LocalDate dataEmissao,
        LocalDate dataVencimento
) {}