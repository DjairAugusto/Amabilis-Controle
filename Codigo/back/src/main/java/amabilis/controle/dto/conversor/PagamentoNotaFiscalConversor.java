package amabilis.controle.dto.conversor;

import amabilis.controle.domain.notaFiscal.PagamentoNotaFiscal;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import amabilis.controle.dto.notaFiscal.CardPagamentoNotaFiscalDTO;
import amabilis.controle.dto.notaFiscal.PagamentoNotaFiscalDTO;

import java.math.BigDecimal;
import java.util.List;

public class PagamentoNotaFiscalConversor {

    public static PagamentoNotaFiscalDTO converterParaDTO(PagamentoNotaFiscal pagamentoNotaFiscal) {
        if (pagamentoNotaFiscal == null) {
            return null;
        }

        return new PagamentoNotaFiscalDTO(
                pagamentoNotaFiscal.getId(),
                pagamentoNotaFiscal.getDataPagamento(),
                pagamentoNotaFiscal.getValorPago(),
                pagamentoNotaFiscal.getStatusPagamento()
        );
    }

    public static CardPagamentoNotaFiscalDTO converterParaCardDTO(NotaFiscal notaFiscal) {
        if (notaFiscal == null) {
            return null;
        }

        List<PagamentoNotaFiscalDTO> pagamentos = notaFiscal.getPagamentos() == null 
                ? List.of() 
                : notaFiscal.getPagamentos().stream()
                        .map(PagamentoNotaFiscalConversor::converterParaDTO)
                        .toList();

        BigDecimal valorNota = notaFiscal.getValorTotal() != null ? notaFiscal.getValorTotal() : BigDecimal.ZERO;

        BigDecimal totalPago = notaFiscal.getValorTotalPago() != null ? notaFiscal.getValorTotalPago() : BigDecimal.ZERO;
        BigDecimal saldo = valorNota.subtract(totalPago);

        return new CardPagamentoNotaFiscalDTO(
                notaFiscal.getId(),
                notaFiscal.getNumeroDocumento(),
                notaFiscal.getFornecedor() != null ? (notaFiscal.getFornecedor().getNomeFantasia() != null ? notaFiscal.getFornecedor().getNomeFantasia() : notaFiscal.getFornecedor().getRazaoSocial()) : null,
                notaFiscal.getObra() != null ? notaFiscal.getObra().getNomeObra() : null,
                notaFiscal.getDataVencimento(),
                totalPago,
                valorNota,
                saldo,
                notaFiscal.getStatusNotaFiscal() != null ? notaFiscal.getStatusNotaFiscal().name() : null,
                pagamentos
        );
    }
}
