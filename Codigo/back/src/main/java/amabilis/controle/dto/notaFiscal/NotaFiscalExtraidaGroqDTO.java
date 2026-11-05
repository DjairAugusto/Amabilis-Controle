package amabilis.controle.dto.notaFiscal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NotaFiscalExtraidaGroqDTO(
        @JsonProperty("numero_documento") String numeroDocumento,
        @JsonProperty("data_emissao") String dataEmissao,
        @JsonProperty("data_vencimento") String dataVencimento,
        @JsonProperty("fornecedor") String fornecedor,
        @JsonProperty("fornecedor_cnpj") String fornecedorCnpj,
        @JsonProperty("valor_total_nota") BigDecimal valorTotalNota,
        @JsonProperty("valor_total_produtos") BigDecimal valorTotalProdutos,
        @JsonProperty("itens") List<ItemNotaFiscalExtraidoGroqDTO> itens
) {
}
