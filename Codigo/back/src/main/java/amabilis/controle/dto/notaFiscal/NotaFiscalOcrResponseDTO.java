package amabilis.controle.dto.notaFiscal;

import amabilis.controle.dto.FornecedorDTO;

import java.math.BigDecimal;
import java.util.List;

public record NotaFiscalOcrResponseDTO(
        String numeroDocumento,
        String dataEmissao,
        String dataVencimento,
        BigDecimal valorTotalNota,
        BigDecimal valorTotalProdutos,
        FornecedorDTO fornecedor,
        List<ItemNotaFiscalOcrResponseDTO> itens
) {
}
