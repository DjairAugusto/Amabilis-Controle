package amabilis.controle.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardObraEstatisticasDTO {
    private Integer totalObras;
    private Integer obrasEmAndamento;
    private BigDecimal valorTotalNfs;
    private Integer numeroTotalNfs;
    private BigDecimal totalPago;
    private Double porcentagemPaga;
    private Integer nfVencidas;
    private BigDecimal valorFaltanteNFs;
    private List<CustoRecursoDTO> custoRecursos;
    private List<FornecedorNFChartDTO> fornecedorNFChart;
    private List<EvolucaoMensalNotaFiscalDTO> evolucaoMensal;
}
