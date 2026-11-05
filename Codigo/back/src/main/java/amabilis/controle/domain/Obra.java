package amabilis.controle.domain;

import amabilis.controle.domain.enums.StatusObra;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "obra")
public class Obra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String centroDeCusto;
    private String nomeObra;

    @Embedded
    private Endereco endereco;

    @Embedded
    private Construtora construtora;

    @Enumerated(EnumType.STRING)
    private StatusObra statusObra;

    @OneToMany(mappedBy = "obra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemObra> itens;

    private BigDecimal orcamento;
    private BigDecimal custoReal;
}
