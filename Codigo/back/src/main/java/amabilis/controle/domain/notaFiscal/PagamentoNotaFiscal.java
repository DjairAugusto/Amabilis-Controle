package amabilis.controle.domain.notaFiscal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import amabilis.controle.domain.enums.StatusPagamento;

@Getter
@Setter
@Entity
@Table(name = "pagamento_nf")
public class PagamentoNotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "id_nota_fiscal")
    private NotaFiscal notaFiscal;

    private LocalDate dataPagamento;
    private BigDecimal valorPago;

    @Enumerated(EnumType.STRING)
    private StatusPagamento statusPagamento;
}
