package amabilis.controle.domain.notaFiscal;

import amabilis.controle.domain.Recurso;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "item_nf")
public class ItemNotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private BigDecimal valorItem;

    @ManyToOne
    @JoinColumn(name = "id_nota_fiscal")
    private NotaFiscal notaFiscal;

    @ManyToOne
    @JoinColumn(name = "id_recurso")
    private Recurso recurso;

}
