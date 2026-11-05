package amabilis.controle.dto.conversor;

import amabilis.controle.domain.GrupoRecurso;
import amabilis.controle.dto.GrupoRecursoDTO;

public class GrupoRecursoConversor {

    public static GrupoRecursoDTO converterParaDTO(GrupoRecurso grupoRecurso) {
        if (grupoRecurso == null) {
            return null;
        }
        return new GrupoRecursoDTO(
                grupoRecurso.getId(),
                grupoRecurso.getNomeGrupo(),
                grupoRecurso.getTipoRecurso()
        );
    }
}

