package amabilis.controle.dto.conversor;

import amabilis.controle.domain.Recurso;
import amabilis.controle.dto.RecursoBasicoDTO;

public class RecursoConversor {

    public static RecursoBasicoDTO converterParaSemPaiDTO(Recurso recurso) {
        if (recurso == null) {
            return null;
        }
        return new RecursoBasicoDTO(
                recurso.getId(),
                recurso.getCodigoHierarquico(),
                recurso.getTipoRecurso(),
                recurso.getDescricao(),
                GrupoRecursoConversor.converterParaDTO(recurso.getGrupoRecurso()),
                recurso.getUnidadeMedida()
        );
    }
}
