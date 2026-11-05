package amabilis.controle.dto;

public record CardObraMapsDTO(
    Long id,
    String nomeObra,
    String statusObra,
    String endereco,
    Double latitude,
    Double longitude
) {
    
}
