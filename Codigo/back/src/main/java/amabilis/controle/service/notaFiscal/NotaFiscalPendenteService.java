package amabilis.controle.service.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import amabilis.controle.dto.PaginaResponseDTO;
import amabilis.controle.dto.notaFiscal.FiltroNotaFiscalPendenteDTO;
import amabilis.controle.dto.notaFiscal.NotaFiscalPendenteDTO;
import amabilis.controle.repository.notaFiscal.NotaFiscalRepository;
import amabilis.controle.specification.NotaFiscalEspecificacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;


@Service
public class NotaFiscalPendenteService {

    private static final List<StatusNotaFiscal> STATUS_PENDENTES = List.of(
            StatusNotaFiscal.VENCIDA,
            StatusNotaFiscal.PENDENTE,
            StatusNotaFiscal.PAGA_PARCIALMENTE
    );

    private static final BigDecimal VALOR_RESTANTE_MINIMO = new BigDecimal("0.01");

    private static final Map<String, String> MAPA_SORT = Map.of(
            "emissao",        "dataEmissao",
            "vencimento",     "dataVencimento",
            "documento",      "numeroDocumento",
            "status",         "statusNotaFiscal"
    );

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @Transactional(readOnly = true)
    public PaginaResponseDTO<NotaFiscalPendenteDTO> listarNFsPendentes(
            Long obraId,
            FiltroNotaFiscalPendenteDTO filtro,
            Pageable pageable) {

        Pageable pageableRemapeado = remapearOrdenacao(pageable);

        Specification<NotaFiscal> spec = Specification
                .where(NotaFiscalEspecificacao.porObra(obraId))
                .and(NotaFiscalEspecificacao.porStatusIn(STATUS_PENDENTES))
                .and(NotaFiscalEspecificacao.comValorRestanteSuperiorA(VALOR_RESTANTE_MINIMO))
                .and(NotaFiscalEspecificacao.porStatus(filtro.status()))
                .and(NotaFiscalEspecificacao.porDataEmissaoInicio(filtro.dataEmissaoInicio()))
                .and(NotaFiscalEspecificacao.porDataEmissaoFim(filtro.dataEmissaoFim()))
                .and(NotaFiscalEspecificacao.porNumeroDocumento(filtro.numeroNf()))
                .and(NotaFiscalEspecificacao.porDataEmissao(filtro.dataEmissao()))
                .and(NotaFiscalEspecificacao.porDataVencimento(filtro.dataVencimento()))
                .and(NotaFiscalEspecificacao.porFornecedor(filtro.fornecedorId()));

        return PaginaResponseDTO.de(
                notaFiscalRepository.findAll(spec, pageableRemapeado).map(this::converterParaDTO)
        );
    }

    private Pageable remapearOrdenacao(Pageable pageable) {
        Sort sort = pageable.getSort().isSorted()
                ? Sort.by(pageable.getSort().stream()
                        .map(order -> {
                            String campo = MAPA_SORT.getOrDefault(order.getProperty(), order.getProperty());
                            return order.isAscending() ? Sort.Order.asc(campo) : Sort.Order.desc(campo);
                        })
                        .toList())
                : Sort.by(Sort.Order.asc("dataVencimento"));

        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
    }

    private NotaFiscalPendenteDTO converterParaDTO(NotaFiscal nf) {
        BigDecimal valorPago = nf.getValorTotalPago() != null
                ? nf.getValorTotalPago()
                : BigDecimal.ZERO;

        BigDecimal valorTotal = nf.getValorTotal() != null
                ? nf.getValorTotal()
                : BigDecimal.ZERO;

        String nomeFornecedor = nf.getFornecedor() != null
                ? obterNomeFornecedor(nf)
                : "-";

        return new NotaFiscalPendenteDTO(
                nf.getId(),
                nf.getNumeroDocumento(),
                nomeFornecedor,
                nf.getDataEmissao(),
                nf.getDataVencimento(),
                valorTotal.subtract(valorPago),
                nf.getStatusNotaFiscal()
        );
    }

    private String obterNomeFornecedor(NotaFiscal nf) {
        String nomeFantasia = nf.getFornecedor().getNomeFantasia();
        String razaoSocial  = nf.getFornecedor().getRazaoSocial();
        return (nomeFantasia != null && !nomeFantasia.isBlank()) ? nomeFantasia : razaoSocial;
    }
}
