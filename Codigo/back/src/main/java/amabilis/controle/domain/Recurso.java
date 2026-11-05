package amabilis.controle.domain;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;

import amabilis.controle.domain.enums.TipoRecurso;
import amabilis.controle.domain.enums.UnidadeMedida;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "recurso")
@CrossOrigin("*")
public class Recurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String codigoHierarquico;

    private String descricao;

    @Enumerated(EnumType.STRING)
    private UnidadeMedida unidadeMedida;

    @Enumerated(EnumType.STRING)
    private TipoRecurso tipoRecurso;

    @ManyToOne
    @JoinColumn(name = "grupo_recurso_id")
    private GrupoRecurso grupoRecurso;

    @ManyToOne
    @JoinColumn(name = "recurso_pai_id")
    private Recurso recursoSuperior;

    @OneToMany(mappedBy = "recursoSuperior", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Recurso> subRecursos = new ArrayList<>();

}
