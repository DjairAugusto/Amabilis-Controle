package amabilis.controle.repository;

import amabilis.controle.domain.enums.TipoTarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import amabilis.controle.domain.Tarefa;

import java.util.List;
import java.util.Optional;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa,Long> {

    Optional<Tarefa> findTopByTipoTarefaAndTarefaPaiIsNullOrderByCodigoTarefaDesc(TipoTarefa tipoTarefa);

    Optional<Tarefa> findTopByTipoTarefaAndTarefaPaiIdOrderByCodigoTarefaDesc(TipoTarefa tipoTarefa, Long tarefaPaiId);

    List<Tarefa> findAllByOrderByCodigoTarefaAsc();

    Optional<Tarefa> findByCodigoTarefaAndTipoTarefa(String codigoTarefa, TipoTarefa tipoTarefa);
}
