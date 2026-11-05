package amabilis.controle.service;

import amabilis.controle.domain.Tarefa;
import amabilis.controle.domain.enums.TipoTarefa;
import amabilis.controle.dto.TarefaDTO;
import amabilis.controle.dto.TarefaHierarquiaDTO;
import amabilis.controle.dto.conversor.TarefaConversor;
import amabilis.controle.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TarefaService {

    @Autowired
    private TarefaRepository tarefaRepository;

    public List<TarefaDTO> listar() {
        return tarefaRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(TarefaConversor::converterParaDTO)
                .toList();
    }

    public TarefaDTO buscarPorId(long id) {
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        return TarefaConversor.converterParaDTO(tarefa);
    }

    public List<TarefaHierarquiaDTO> listarComHierarquiaDeTarefas() {
        List<Tarefa> todasTarefas = tarefaRepository.findAllByOrderByCodigoTarefaAsc();

        Map<Long, List<Tarefa>> filhosPorPaiId = todasTarefas.stream()
                .filter(tarefa -> tarefa.getTarefaPai() != null)
                .collect(Collectors.groupingBy(tarefa -> tarefa.getTarefaPai().getId()));

        List<Tarefa> raizes = todasTarefas.stream()
                .filter(tarefa -> tarefa.getTarefaPai() == null)
                .toList();

        return raizes.stream()
                .map(raiz -> TarefaConversor.converterParaHierarquiaDTO(raiz, filhosPorPaiId))
                .toList();
    }

    @Transactional
    public TarefaDTO criar(TarefaDTO dto){

        if (dto.descricao() == null || dto.descricao().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Descrição da tarefa é obrigatória");
        }

        if (dto.tarefaPaiId() == null && dto.tipoTarefa() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O tipo da tarefa é obrigatório quando não há tarefa pai");
        }

        Tarefa tarefaPai = null;
        if (dto.tarefaPaiId() != null) {
            tarefaPai = tarefaRepository.findById(dto.tarefaPaiId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tarefa pai não encontrada"));
        }

        TipoTarefa tipoTarefa = dto.tipoTarefa() != null ? dto.tipoTarefa() : tarefaPai.getTipoTarefa();

        Tarefa tarefa = new Tarefa();
        tarefa.setDescricao(dto.descricao());
        tarefa.setUnidadeMedida(dto.unidadeMedida());
        tarefa.setTipoTarefa(tipoTarefa);
        tarefa.setTarefaPai(tarefaPai);

        tarefa.setCodigoTarefa(gerarCodigoTarefa(tarefa));
        tarefaRepository.save(tarefa);

        return TarefaConversor.converterParaDTO(tarefa);
    }

    @Transactional
    public TarefaDTO atualizar(Long id, TarefaDTO dto) {
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        if (dto.descricao() != null && !dto.descricao().isBlank()) {
            tarefa.setDescricao(dto.descricao());
        }

        if (dto.unidadeMedida() != null) {
            tarefa.setUnidadeMedida(dto.unidadeMedida());
        }

        tarefaRepository.save(tarefa);
        return TarefaConversor.converterParaDTO(tarefa);
    }

    public void deletar(Long id){
        if (!tarefaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada");
        }

        tarefaRepository.deleteById(id);
    }

    private String gerarCodigoTarefa(Tarefa tarefa){
        if (tarefa.getTipoTarefa() == TipoTarefa.INDIRETA) {
            return gerarCodigoTarefaIndireta(tarefa);
        }
        return gerarCodigoTarefaDireta(tarefa);
    }

    private String gerarCodigoTarefaDireta(Tarefa tarefa){
        Tarefa tarefaPai = tarefa.getTarefaPai();
        long sequencia;

        if(tarefaPai == null){
            Optional<Tarefa> ultimaTarefaPai = tarefaRepository.findTopByTipoTarefaAndTarefaPaiIsNullOrderByCodigoTarefaDesc(tarefa.getTipoTarefa());
            sequencia = obterProximaSequencia(ultimaTarefaPai);
            return String.format("%02d.", sequencia);
        }

        Optional<Tarefa> ultimaTarefa = tarefaRepository.findTopByTipoTarefaAndTarefaPaiIdOrderByCodigoTarefaDesc(tarefa.getTipoTarefa(), tarefaPai.getId());
        sequencia = obterProximaSequencia(ultimaTarefa);

        if(tarefaPai.getTarefaPai() == null){
            return tarefaPai.getCodigoTarefa() + String.format("%02d", sequencia);
        }

        return tarefaPai.getCodigoTarefa() + String.format(".%03d", sequencia);
    }

    private String gerarCodigoTarefaIndireta(Tarefa tarefa){
        Tarefa tarefaPai = tarefa.getTarefaPai();

        if (tarefaPai == null) {
            var ultimaTarefa = tarefaRepository.findTopByTipoTarefaAndTarefaPaiIsNullOrderByCodigoTarefaDesc(tarefa.getTipoTarefa());
            long sequencia = obterProximaSequencia(ultimaTarefa);
            return String.format("99.%02d", sequencia);
        }

        var ultimaTarefa = tarefaRepository.findTopByTipoTarefaAndTarefaPaiIdOrderByCodigoTarefaDesc(tarefa.getTipoTarefa(), tarefaPai.getId());
        long sequencia = obterProximaSequencia(ultimaTarefa);

        return tarefaPai.getCodigoTarefa() + String.format(".%02d", sequencia);
    }

    private long obterProximaSequencia(Optional<Tarefa> ultimaTarefa) {
        if (ultimaTarefa.isEmpty()) {
            return 1L;
        }

        String codigoTarefa = ultimaTarefa.get().getCodigoTarefa();

        if (codigoTarefa.endsWith(".")) {
            codigoTarefa = codigoTarefa.substring(0, codigoTarefa.length() - 1);
        }

        String[] partes = codigoTarefa.split("\\.");

        return Long.parseLong(partes[partes.length - 1]) + 1;
    }
}
