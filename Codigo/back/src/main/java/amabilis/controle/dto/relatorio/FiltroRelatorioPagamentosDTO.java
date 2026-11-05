package amabilis.controle.dto.relatorio;

import java.time.LocalDate;

public record FiltroRelatorioPagamentosDTO(
        LocalDate dataEmissaoInicio,
        LocalDate dataEmissaoFim,
        LocalDate dataEmissao,
        LocalDate dataVencimento,
        String codigoNf
) {}
