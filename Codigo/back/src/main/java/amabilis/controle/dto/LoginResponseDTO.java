package amabilis.controle.dto;

public record LoginResponseDTO(
    String token,
    String tipo,
    String nome,
    String email
) {
}
