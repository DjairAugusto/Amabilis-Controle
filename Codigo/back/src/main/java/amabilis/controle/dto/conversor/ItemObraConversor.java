package amabilis.controle.dto.conversor;

import amabilis.controle.domain.ItemObra;
import amabilis.controle.dto.RetornoItemObraDTO;

import java.util.stream.Collectors;

public class ItemObraConversor {

    public static RetornoItemObraDTO converterParaDTO(ItemObra itemObra) {
        if (itemObra == null) {
            return null;
        }

        return new RetornoItemObraDTO(
                itemObra.getId(),
                itemObra.getStatus(),
                TarefaConversor.converterParaDTO(itemObra.getTarefa()),
                itemObra.getRecursosAlocados() != null ?
                        itemObra.getRecursosAlocados().stream()
                                .map(ItemNotaFiscalConversor::converterParaRetornoItemNotaFiscal)
                                .collect(Collectors.toSet())
                        : null
        );
    }
}

