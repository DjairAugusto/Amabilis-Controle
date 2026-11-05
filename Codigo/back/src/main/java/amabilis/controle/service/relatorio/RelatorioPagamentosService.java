package amabilis.controle.service.relatorio;

import amabilis.controle.domain.notaFiscal.PagamentoNotaFiscal;
import amabilis.controle.dto.PaginaResponseDTO;
import amabilis.controle.dto.relatorio.FiltroRelatorioPagamentosDTO;
import amabilis.controle.dto.relatorio.RelatorioPagamentoLinhaDTO;
import amabilis.controle.repository.notaFiscal.PagamentoNotaFiscalRepository;
import amabilis.controle.specification.PagamentoNotaFiscalEspecificacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class RelatorioPagamentosService extends RelatorioBaseExcelService {

    private static final Map<String, String> MAPA_SORT = Map.of(
            "emissao",       "notaFiscal.dataEmissao",
            "vencimento",    "notaFiscal.dataVencimento",
            "dataPagamento", "dataPagamento",
            "valorPago",     "valorPago",
            "documento",     "notaFiscal.numeroDocumento"
    );

    @Autowired
    private PagamentoNotaFiscalRepository pagamentoRepository;

    @Transactional(readOnly = true)
    public PaginaResponseDTO<RelatorioPagamentoLinhaDTO> obterRelatorio(
            long obraId,
            FiltroRelatorioPagamentosDTO filtro,
            Pageable pageable) {

        buscarObra(obraId);

        Sort sortRemapeado;
        if (!pageable.getSort().isSorted()) {
            sortRemapeado = Sort.by(Sort.Order.desc("dataPagamento"));
        } else {
            sortRemapeado = Sort.by(
                    pageable.getSort().stream()
                            .map(order -> {
                                String campo = MAPA_SORT.getOrDefault(order.getProperty(), "dataPagamento");
                                return order.isAscending()
                                        ? Sort.Order.asc(campo)
                                        : Sort.Order.desc(campo);
                            })
                            .toList()
            );
        }

        Pageable pageableRemapeado = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortRemapeado);

        Specification<PagamentoNotaFiscal> spec = Specification
                .where(PagamentoNotaFiscalEspecificacao.porObra(obraId))
                .and(PagamentoNotaFiscalEspecificacao.porDataEmissaoInicio(filtro.dataEmissaoInicio()))
                .and(PagamentoNotaFiscalEspecificacao.porDataEmissaoFim(filtro.dataEmissaoFim()))
                .and(PagamentoNotaFiscalEspecificacao.porDataEmissao(filtro.dataEmissao()))
                .and(PagamentoNotaFiscalEspecificacao.porDataVencimento(filtro.dataVencimento()))
                .and(PagamentoNotaFiscalEspecificacao.porNumeroDocumento(filtro.codigoNf()));

        return PaginaResponseDTO.de(
                pagamentoRepository.findAll(spec, pageableRemapeado).map(this::converterParaDTO)
        );
    }

    private RelatorioPagamentoLinhaDTO converterParaDTO(PagamentoNotaFiscal pagamento) {
        return new RelatorioPagamentoLinhaDTO(
                pagamento.getId(),
                pagamento.getNotaFiscal().getNumeroDocumento(),
                pagamento.getNotaFiscal().getDataEmissao(),
                pagamento.getNotaFiscal().getDataVencimento(),
                pagamento.getDataPagamento(),
                pagamento.getValorPago()
        );
    }
}
