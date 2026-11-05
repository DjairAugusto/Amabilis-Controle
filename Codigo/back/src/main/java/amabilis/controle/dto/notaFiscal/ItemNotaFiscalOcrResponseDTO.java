package amabilis.controle.dto.notaFiscal;

import amabilis.controle.dto.RecursoBasicoDTO;

import java.math.BigDecimal;

public record ItemNotaFiscalOcrResponseDTO(
        String descricao,
        String unidadeMedida,
        BigDecimal valorTotal,
        RecursoBasicoDTO recurso
) {
}
