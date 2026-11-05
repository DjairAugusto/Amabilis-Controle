package amabilis.controle.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraficoDTO {
    private List<String> labels;
    private List<BigDecimal> data;

    @JsonProperty("valores")
    public List<BigDecimal> getValores() {
        return data;
    }
}
