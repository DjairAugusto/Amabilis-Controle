package amabilis.controle.domain;

import amabilis.controle.domain.enums.Documento;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name = "fornecedor")
@Entity
public class Fornecedor {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;

    private String codigoFornecedor;
    private String razaoSocial;
    private String nomeFantasia;
    private String documento;
    private boolean statusFornecedor;
    private String inscricaoEstadual;
    private String inscricaoMunicipal;

    @Enumerated(EnumType.STRING)
    private Documento tipoDocumento;

    @Embedded
    private Endereco endereco;
}
