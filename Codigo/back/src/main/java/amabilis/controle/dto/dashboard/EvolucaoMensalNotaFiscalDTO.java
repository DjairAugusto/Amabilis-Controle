package amabilis.controle.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvolucaoMensalNotaFiscalDTO {
    private Long id;
    private String numeroNF;
    private LocalDate emissao;
    private BigDecimal valorTotal;
    private List<PagamentoEvolucaoDTO> pagamentos;
}
