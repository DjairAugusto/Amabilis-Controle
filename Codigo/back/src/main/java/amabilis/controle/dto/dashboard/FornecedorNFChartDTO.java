package amabilis.controle.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FornecedorNFChartDTO {
    private Long id;
    private String nomeFornecedor;
    private Integer numeroNFs;
}
