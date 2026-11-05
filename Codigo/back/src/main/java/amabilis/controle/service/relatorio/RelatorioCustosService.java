package amabilis.controle.service.relatorio;

import amabilis.controle.dto.PaginaResponseDTO;
import amabilis.controle.dto.relatorio.FiltroRelatorioCustosDTO;
import amabilis.controle.dto.relatorio.RelatorioCustoLinhaDTO;
import amabilis.controle.repository.ItemObraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class RelatorioCustosService extends RelatorioBaseExcelService {

    private static final Map<String, String> MAPA_SORT = Map.of(
            "emissao",    "nf.dataEmissao",
            "vencimento", "nf.dataVencimento",
            "valorItem",  "infs.valorItem",
            "documento",  "nf.numeroDocumento"
    );

    @Autowired
    private ItemObraRepository itemObraRepository;

    @Transactional(readOnly = true)
    public PaginaResponseDTO<RelatorioCustoLinhaDTO> obterRelatorio(
            long obraId,
            FiltroRelatorioCustosDTO filtro,
            Pageable pageable) {

        buscarObra(obraId);

        Sort sortRemapeado = Sort.by(
                pageable.getSort().stream()
                        .map(order -> {
                            String alias = MAPA_SORT.getOrDefault(order.getProperty(), "nf.dataEmissao");
                            return order.isAscending()
                                    ? Sort.Order.asc(alias)
                                    : Sort.Order.desc(alias);
                        })
                        .toList()
        );

        if (!pageable.getSort().isSorted()) {
            sortRemapeado = Sort.by(Sort.Order.desc("nf.dataEmissao"));
        }

        Pageable pageableRemapeado = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortRemapeado);

        var resultado = itemObraRepository.buscarRelatorioCustos(
                obraId,
                filtro.dataEmissaoInicio(),
                filtro.dataEmissaoFim(),
                filtro.dataEmissao(),
                filtro.dataVencimento(),
                filtro.fornecedorId(),
                filtro.codigoTarefa(),
                filtro.codigoRecurso(),
                filtro.codigoNf(),
                pageableRemapeado
        );

        return PaginaResponseDTO.de(resultado);
    }
}
