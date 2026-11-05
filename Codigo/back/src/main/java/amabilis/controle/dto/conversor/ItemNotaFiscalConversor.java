package amabilis.controle.dto.conversor;

import amabilis.controle.domain.notaFiscal.ItemNotaFiscal;
import amabilis.controle.dto.RecursoBasicoDTO;
import amabilis.controle.dto.RecursoDTO;
import amabilis.controle.dto.notaFiscal.ItemNotaFiscalResponseDTO;
import amabilis.controle.dto.notaFiscal.RetornoItemNotaFiscalDTO;

public class ItemNotaFiscalConversor {

    public static ItemNotaFiscalResponseDTO converterParaDTO(ItemNotaFiscal itemNotaFiscal, Long tarefaId) {
        if (itemNotaFiscal == null) {
            return null;
        }

        RecursoBasicoDTO recurso = RecursoConversor.converterParaSemPaiDTO(itemNotaFiscal.getRecurso());

        return new ItemNotaFiscalResponseDTO(
                itemNotaFiscal.getId(),
                itemNotaFiscal.getValorItem(),
                recurso,
                tarefaId
        );
    }

    public static RetornoItemNotaFiscalDTO converterParaRetornoItemNotaFiscal(ItemNotaFiscal item) {
        if (item == null) {
            return null;
        }
        return new RetornoItemNotaFiscalDTO(
                item.getId(),
                item.getValorItem(),
                RecursoConversor.converterParaSemPaiDTO(item.getRecurso()),
                item.getNotaFiscal().getNumeroDocumento()
        );
    }
}
