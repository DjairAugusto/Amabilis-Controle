package amabilis.controle.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import amabilis.controle.domain.Recurso;

@Repository
public interface RecursoRepository extends JpaRepository<Recurso, Long> {

	List<Recurso> findByRecursoSuperiorIsNullOrderByIdAsc();

	List<Recurso> findByRecursoSuperiorIdOrderByIdAsc(Long recursoSuperiorId);

	List<Recurso> findByRecursoSuperiorIdOrderByCodigoHierarquicoAsc(Long recursoSuperiorId);

	List<Recurso> findByRecursoSuperiorIsNullOrderByCodigoHierarquicoAsc();

	boolean existsByCodigoHierarquicoIsNull();

	@Query("""
		select (count(r) > 0)
		from Recurso r
		where lower(trim(r.descricao)) = lower(trim(:descricao))
		  and r.grupoRecurso.id = :grupoRecursoId
		  and ((:recursoSuperiorId is null and r.recursoSuperior is null) or r.recursoSuperior.id = :recursoSuperiorId)
		  and (:ignorarId is null or r.id <> :ignorarId)
	""")
	boolean existsDuplicado(@Param("descricao") String descricao,
						   @Param("grupoRecursoId") Long grupoRecursoId,
						   @Param("recursoSuperiorId") Long recursoSuperiorId,
						   @Param("ignorarId") Long ignorarId);
						   Optional<Recurso> findByCodigoHierarquico(String codigoHierarquico);

	Recurso findByDescricaoContainingIgnoreCase(String descricao);
}
