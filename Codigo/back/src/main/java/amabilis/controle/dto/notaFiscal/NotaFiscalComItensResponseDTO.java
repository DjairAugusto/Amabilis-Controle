package amabilis.controle.dto.notaFiscal;

import amabilis.controle.dto.FornecedorDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record NotaFiscalComItensResponseDTO(
        Long id,
        String numeroDocumento,
        LocalDate dataEmissao,
        LocalDate dataVencimento,
        BigDecimal valorTotal,
        FornecedorDTO fornecedor,
        List<ItemNotaFiscalResponseDTO> itens
) {
}
