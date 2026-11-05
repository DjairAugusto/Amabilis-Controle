package amabilis.controle.dto.notaFiscal;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CriarNotaFiscalComItensRequestDTO(
        Long id,
        String numeroDocumento,

        @NotNull(message = "A data de emissão da nota é obrigatória")
        LocalDate dataEmissao,

        @NotNull(message = "A data de vencimento da nota é obrigatória")
        LocalDate dataVencimento,

        BigDecimal valorTotal,

        @NotNull(message = "O fornecedor da nota é obrigatório")
        Long fornecedorId,

        List<CriarItemNotaFiscalRequestDTO> itens
) {
}
