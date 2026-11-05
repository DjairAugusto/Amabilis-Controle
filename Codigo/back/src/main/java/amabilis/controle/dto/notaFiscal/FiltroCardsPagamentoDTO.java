package amabilis.controle.dto.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;
import java.time.LocalDate;

public record FiltroCardsPagamentoDTO(
        String termo,
        String nomeObra,
        StatusNotaFiscal statusNotaFiscal,
        LocalDate dataVencimentoInicio,
        LocalDate dataVencimentoFim
) {}