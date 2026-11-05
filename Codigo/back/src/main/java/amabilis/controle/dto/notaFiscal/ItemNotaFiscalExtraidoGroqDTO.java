package amabilis.controle.dto.notaFiscal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ItemNotaFiscalExtraidoGroqDTO(
        @JsonProperty("descricao") String descricao,
        @JsonProperty("unidade_medida") String unidadeMedida,
        @JsonProperty("valor_total") BigDecimal valorTotal
) {
}
