package amabilis.controle.specification;

import amabilis.controle.domain.notaFiscal.PagamentoNotaFiscal;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class PagamentoNotaFiscalEspecificacao {

    private PagamentoNotaFiscalEspecificacao() {}

    public static Specification<PagamentoNotaFiscal> porObra(Long obraId) {
        return (raiz, consulta, construtor) ->
                obraId == null ? null : construtor.equal(raiz.get("notaFiscal").get("obra").get("id"), obraId);
    }

    public static Specification<PagamentoNotaFiscal> porDataEmissaoInicio(LocalDate dataEmissaoInicio) {
        return (raiz, consulta, construtor) ->
                dataEmissaoInicio == null ? null : construtor.greaterThanOrEqualTo(
                        raiz.get("notaFiscal").get("dataEmissao"), dataEmissaoInicio);
    }

    public static Specification<PagamentoNotaFiscal> porDataEmissaoFim(LocalDate dataEmissaoFim) {
        return (raiz, consulta, construtor) ->
                dataEmissaoFim == null ? null : construtor.lessThanOrEqualTo(
                        raiz.get("notaFiscal").get("dataEmissao"), dataEmissaoFim);
    }

    public static Specification<PagamentoNotaFiscal> porDataEmissao(LocalDate dataEmissao) {
        return (raiz, consulta, construtor) ->
                dataEmissao == null ? null : construtor.equal(raiz.get("notaFiscal").get("dataEmissao"), dataEmissao);
    }

    public static Specification<PagamentoNotaFiscal> porDataVencimento(LocalDate dataVencimento) {
        return (raiz, consulta, construtor) ->
                dataVencimento == null ? null : construtor.equal(raiz.get("notaFiscal").get("dataVencimento"), dataVencimento);
    }

    public static Specification<PagamentoNotaFiscal> porNumeroDocumento(String codigoNf) {
        return (raiz, consulta, construtor) ->
                codigoNf == null ? null : construtor.equal(raiz.get("notaFiscal").get("numeroDocumento"), codigoNf);
    }
}
