package amabilis.controle.specification;

import amabilis.controle.domain.Obra;
import org.springframework.data.jpa.domain.Specification;

public class ObraEspecificacao {

    private ObraEspecificacao() {}

    public static Specification<Obra> porTermo(String termo) {
        return (raiz, consulta, construtor) -> {
            if (termo == null || termo.trim().isEmpty()) return null;

            String termoBusca = "%" + termo.toLowerCase() + "%";

            return construtor.or(
                    construtor.like(construtor.lower(raiz.get("nomeObra")), termoBusca),
                    construtor.like(construtor.lower(raiz.get("centroDeCusto")), termoBusca)
            );
        };
    }
}