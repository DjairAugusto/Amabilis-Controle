package amabilis.controle.specification;

import amabilis.controle.domain.enums.StatusNotaFiscal;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class NotaFiscalEspecificacao {

    private NotaFiscalEspecificacao() {}

    public static Specification<NotaFiscal> porObra(Long obraId) {
        return (raiz, consulta, construtor) ->
                obraId == null ? null : construtor.equal(raiz.get("obra").get("id"), obraId);
    }

    public static Specification<NotaFiscal> porStatus(StatusNotaFiscal status) {
        return (raiz, consulta, construtor) ->
                status == null ? null : construtor.equal(raiz.get("statusNotaFiscal"), status);
    }

    public static Specification<NotaFiscal> porFornecedor(Long fornecedorId) {
        return (raiz, consulta, construtor) ->
                fornecedorId == null ? null : construtor.equal(raiz.get("fornecedor").get("id"), fornecedorId);
    }

    public static Specification<NotaFiscal> porNumeroDocumento(String numeroDocumento) {
        return (raiz, consulta, construtor) ->
                numeroDocumento == null ? null : construtor.like(
                        construtor.lower(raiz.get("numeroDocumento")),
                        "%" + numeroDocumento.toLowerCase() + "%"
                );
    }

    public static Specification<NotaFiscal> porDataEmissao(LocalDate dataEmissao) {
        return (raiz, consulta, construtor) ->
                dataEmissao == null ? null : construtor.equal(raiz.get("dataEmissao"), dataEmissao);
    }

    public static Specification<NotaFiscal> porDataVencimento(LocalDate dataVencimento) {
        return (raiz, consulta, construtor) ->
                dataVencimento == null ? null : construtor.equal(raiz.get("dataVencimento"), dataVencimento);
    }

    public static Specification<NotaFiscal> porTermo(String termo) {
        return (raiz, consulta, construtor) -> {
            if (termo == null || termo.trim().isEmpty()) return null;
            String termoLike = "%" + termo.toLowerCase() + "%";

            // Procura tanto no número do documento quanto no nome fantasia ou razão social
            return construtor.or(
                    construtor.like(construtor.lower(raiz.get("numeroDocumento")), termoLike),
                    construtor.like(construtor.lower(raiz.get("fornecedor").get("nomeFantasia")), termoLike),
                    construtor.like(construtor.lower(raiz.get("fornecedor").get("razaoSocial")), termoLike)
            );
        };
    }

    public static Specification<NotaFiscal> porNomeObra(String nomeObra) {
        return (raiz, consulta, construtor) ->
                (nomeObra == null || nomeObra.trim().isEmpty() || nomeObra.equals("Todas as Obras")) ? null :
                        construtor.equal(raiz.get("obra").get("nomeObra"), nomeObra);
    }

    public static Specification<NotaFiscal> porDataVencimentoEntre(LocalDate inicio, LocalDate fim) {
        return (raiz, consulta, construtor) -> {
            if (inicio != null && fim != null) return construtor.between(raiz.get("dataVencimento"), inicio, fim);
            if (inicio != null) return construtor.greaterThanOrEqualTo(raiz.get("dataVencimento"), inicio);
            if (fim != null) return construtor.lessThanOrEqualTo(raiz.get("dataVencimento"), fim);
            return null;
        };
    }

    public static Specification<NotaFiscal> porStatusIn(List<StatusNotaFiscal> statuses) {
        return (raiz, consulta, construtor) ->
                (statuses == null || statuses.isEmpty()) ? null : raiz.get("statusNotaFiscal").in(statuses);
    }

    public static Specification<NotaFiscal> porDataEmissaoInicio(LocalDate dataEmissaoInicio) {
        return (raiz, consulta, construtor) ->
                dataEmissaoInicio == null ? null : construtor.greaterThanOrEqualTo(raiz.get("dataEmissao"), dataEmissaoInicio);
    }

    public static Specification<NotaFiscal> porDataEmissaoFim(LocalDate dataEmissaoFim) {
        return (raiz, consulta, construtor) ->
                dataEmissaoFim == null ? null : construtor.lessThanOrEqualTo(raiz.get("dataEmissao"), dataEmissaoFim);
    }

    public static Specification<NotaFiscal> comValorRestanteSuperiorA(BigDecimal minimo) {
        return (raiz, consulta, construtor) -> {
            Expression<BigDecimal> valorTotal = construtor.coalesce(raiz.get("valorTotal"), BigDecimal.ZERO);
            Expression<BigDecimal> valorPago  = construtor.coalesce(raiz.get("valorTotalPago"), BigDecimal.ZERO);
            return construtor.gt(construtor.diff(valorTotal, valorPago), minimo);
        };
    }
}
