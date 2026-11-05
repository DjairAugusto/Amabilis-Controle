package amabilis.controle.dto;

import org.springframework.data.domain.Page;

import java.util.List;

public record PaginaResponseDTO<T>(
        List<T> conteudo,
        int paginaAtual,
        int totalPaginas,
        int quantidadeElementos,
        long totalElementos,
        int tamanhoPagina
) {
    public static <T> PaginaResponseDTO<T> de(Page<T> pagina) {
        return new PaginaResponseDTO<>(
                pagina.getContent(),
                pagina.getNumber(),
                pagina.getTotalPages(),
                pagina.getContent().size(),
                pagina.getTotalElements(),
                pagina.getSize()
        );
    }
}
