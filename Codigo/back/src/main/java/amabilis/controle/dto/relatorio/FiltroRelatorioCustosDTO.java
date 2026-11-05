package amabilis.controle.dto.relatorio;

import java.time.LocalDate;

public record FiltroRelatorioCustosDTO(
        LocalDate dataEmissaoInicio,
        LocalDate dataEmissaoFim,
        LocalDate dataEmissao,
        LocalDate dataVencimento,
        Long fornecedorId,
        String codigoTarefa,
        String codigoRecurso,
        String codigoNf
) {}
