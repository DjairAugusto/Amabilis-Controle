package amabilis.controle.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import amabilis.controle.domain.GrupoRecurso;
import amabilis.controle.domain.enums.TipoRecurso;

@Repository
public interface GrupoRecursoRepository extends JpaRepository<GrupoRecurso, Long> {

		@Query("""
				select (count(g) > 0)
				from GrupoRecurso g
				where lower(trim(g.nomeGrupo)) = lower(trim(:nomeGrupo))
					and g.tipoRecurso = :tipoRecurso
					and (:ignorarId is null or g.id <> :ignorarId)
		""")
		boolean existsDuplicado(@Param("nomeGrupo") String nomeGrupo,
														@Param("tipoRecurso") TipoRecurso tipoRecurso,
														@Param("ignorarId") Long ignorarId);

														Optional<GrupoRecurso> findByNomeGrupoAndTipoRecurso(String nomeGrupo, TipoRecurso tipoRecurso);

}
