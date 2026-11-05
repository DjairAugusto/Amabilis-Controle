package amabilis.controle.dto.notaFiscal;

import amabilis.controle.dto.RecursoBasicoDTO;

import java.math.BigDecimal;

public record RetornoItemNotaFiscalDTO(
        long id,
        BigDecimal valorItem,
        RecursoBasicoDTO recurso,
        String numeroNotaFiscal
) {
}
