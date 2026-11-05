package amabilis.controle.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public record Construtora(
        String nome,
        String cnpj
) {
}
