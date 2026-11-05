package amabilis.controle.repository;

import amabilis.controle.domain.Obra;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ObraRepository extends JpaRepository<Obra, Long>, JpaSpecificationExecutor<Obra> {
    boolean existsByCentroDeCusto(String centroDeCusto);
    List<Obra> findByNomeObraContainingIgnoreCaseOrCentroDeCustoContainingIgnoreCase(String nomeObra, String centroDeCusto);
}
