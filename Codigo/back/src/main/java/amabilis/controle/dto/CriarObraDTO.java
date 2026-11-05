package amabilis.controle.dto;

import java.math.BigDecimal;
import java.util.List;

import amabilis.controle.domain.Construtora;
import amabilis.controle.domain.Endereco;
import amabilis.controle.domain.enums.StatusObra;

public record CriarObraDTO(
        String centroDeCusto,
        String nomeObra,
        Endereco endereco,
        Construtora construtora,
        StatusObra statusObra,
        BigDecimal orcamento,
        BigDecimal custoReal
) {
}
