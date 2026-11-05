package amabilis.controle.domain.notaFiscal;

import amabilis.controle.domain.Fornecedor;
import amabilis.controle.domain.Obra;
import amabilis.controle.domain.enums.StatusNotaFiscal;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "nota_fiscal")
public class NotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(mappedBy = "notaFiscal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemNotaFiscal> itens = new ArrayList<>();

    @OneToMany(mappedBy = "notaFiscal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PagamentoNotaFiscal> pagamentos = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    @ManyToOne
    @JoinColumn(name = "obra_id")
    private Obra obra;

    @Enumerated(EnumType.STRING)
    private StatusNotaFiscal statusNotaFiscal;

    private String numeroDocumento;
    private LocalDate dataEmissao;
    private LocalDate dataVencimento;
    private BigDecimal valorTotal;
    private BigDecimal valorTotalPago;

}
