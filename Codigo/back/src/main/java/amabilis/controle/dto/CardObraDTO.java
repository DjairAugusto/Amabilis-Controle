package amabilis.controle.dto;

import amabilis.controle.domain.enums.StatusObra;

public record CardObraDTO(
    Long id,
    String nome,
    String status,
    String endereco,
    long atividades,
    long atividadesConcluidas,
    double porcentagem,
    long notasFiscais,
    String centroDeCusto
) {
    
}
