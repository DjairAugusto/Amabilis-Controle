package amabilis.controle.domain;

import amabilis.controle.domain.notaFiscal.ItemNotaFiscal;
import amabilis.controle.domain.enums.StatusItemObra;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "item_obra")
public class ItemObra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "id_tarefa")
    private Tarefa tarefa;

    @ManyToOne
    @JoinColumn(name = "obra_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Obra obra;

    @Enumerated(EnumType.STRING)
    private StatusItemObra status;

    @ManyToMany
    @JoinTable(
            name = "item_obra_recursos",
            joinColumns = @JoinColumn(name = "id_item_obra"),
            inverseJoinColumns = @JoinColumn(name = "id_item_nf")
    )
    private Set<ItemNotaFiscal> recursosAlocados = new HashSet<>();

}