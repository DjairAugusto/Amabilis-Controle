package amabilis.controle.dto;

import java.math.BigDecimal;
import java.util.List;

import amabilis.controle.domain.Construtora;
import amabilis.controle.domain.Endereco;

public record RetornoObraDTO(Long id,
        String centroDeCusto,
        String nome,
        Endereco endereco,
        Construtora construtora,
        String statusObra,
        BigDecimal orcamento,
        BigDecimal custoReal,
        int totalAtividades,
        int notasFiscais,
        List<RetornoItemObraDTO> itensObra) {
    
}
