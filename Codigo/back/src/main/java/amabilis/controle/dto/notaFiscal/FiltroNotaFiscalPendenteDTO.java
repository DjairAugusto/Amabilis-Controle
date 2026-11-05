package amabilis.controle.dto.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;

import java.time.LocalDate;

public record FiltroNotaFiscalPendenteDTO(
        LocalDate dataEmissaoInicio,
        LocalDate dataEmissaoFim,
        String numeroNf,
        LocalDate dataEmissao,
        LocalDate dataVencimento,
        Long fornecedorId,
        StatusNotaFiscal status
) {}
