package amabilis.controle.dto.notaFiscal;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record AtualizarNotaFiscalComItensRequestDTO(
        Long id,
        String numeroDocumento,
        LocalDate dataEmissao,
        LocalDate dataVencimento,
        BigDecimal valorTotal,
        Long fornecedorId,

        List<CriarItemNotaFiscalRequestDTO> itens
){
}
