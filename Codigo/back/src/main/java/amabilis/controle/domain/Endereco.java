package amabilis.controle.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public record Endereco(
        String logradouro,
        String numeroEndereco,
        String bairro,
        String cidade,
        String estado,
        int cep,
        Double latitude,
        Double longitude
) {}
