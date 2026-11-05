package amabilis.controle.domain;

import amabilis.controle.domain.enums.TipoRecurso;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "grupo_recurso")
public class GrupoRecurso {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long  id;
    private String nomeGrupo;

    @Enumerated(EnumType.STRING)
    private TipoRecurso tipoRecurso;

    public long getId() {
        return id;
    }
}
