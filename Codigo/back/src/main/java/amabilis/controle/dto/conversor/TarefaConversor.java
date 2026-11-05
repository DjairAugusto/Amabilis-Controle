package amabilis.controle.dto.conversor;

import amabilis.controle.domain.Tarefa;
import amabilis.controle.dto.TarefaDTO;
import amabilis.controle.dto.TarefaHierarquiaDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TarefaConversor {

    public static TarefaDTO converterParaDTO(Tarefa tarefa) {
        if (tarefa == null) {
            return null;
        }
        Long tarefaPaiId = tarefa.getTarefaPai() != null ? tarefa.getTarefaPai().getId() : null;
        return new TarefaDTO(
                tarefa.getId(),
                tarefa.getCodigoTarefa(),
                tarefaPaiId,
                tarefa.getUnidadeMedida(),
                tarefa.getDescricao(),
                tarefa.getTipoTarefa()
        );
    }

    public static TarefaHierarquiaDTO converterParaHierarquiaDTO(Tarefa tarefa, Map<Long, List<Tarefa>> filhosPorPaiId) {
        if (tarefa == null) {
            return null;
        }

        List<Tarefa> filhos = filhosPorPaiId.getOrDefault(tarefa.getId(), new ArrayList<>());

        List<TarefaHierarquiaDTO> subTarefasDTO = filhos.stream()
                .map(filho -> converterParaHierarquiaDTO(filho, filhosPorPaiId))
                .toList();

        return new TarefaHierarquiaDTO(
                tarefa.getId(),
                tarefa.getCodigoTarefa(),
                tarefa.getDescricao(),
                tarefa.getTipoTarefa(),
                tarefa.getUnidadeMedida(),
                subTarefasDTO
        );
    }
}

