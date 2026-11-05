package amabilis.controle.domain;

import amabilis.controle.domain.enums.TipoTarefa;
import amabilis.controle.domain.enums.UnidadeMedida;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
public class Tarefa {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;
    private String codigoTarefa;
    private String descricao;

    @Enumerated(EnumType.STRING)
    private UnidadeMedida unidadeMedida;

    @Enumerated(EnumType.STRING)
    private TipoTarefa tipoTarefa;

    @ManyToOne
    @JoinColumn(name = "tarefa_pai_id")
    private Tarefa tarefaPai;

    @OneToMany(mappedBy = "tarefaPai", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tarefa> tarefasFilhas = new ArrayList<>();
}
