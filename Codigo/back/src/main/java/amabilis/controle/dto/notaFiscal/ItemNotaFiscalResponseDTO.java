package amabilis.controle.dto.notaFiscal;

import amabilis.controle.dto.RecursoBasicoDTO;
import java.math.BigDecimal;

public record ItemNotaFiscalResponseDTO(
        Long id,
        BigDecimal valorItem,
        RecursoBasicoDTO recurso,
        Long tarefaId
) {
}