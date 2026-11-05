package amabilis.controle.dto.conversor;

import amabilis.controle.domain.notaFiscal.NotaFiscal;
import amabilis.controle.dto.notaFiscal.ItemNotaFiscalResponseDTO;
import amabilis.controle.dto.notaFiscal.NotaFiscalResponseDTO;
import amabilis.controle.dto.notaFiscal.NotaFiscalComItensResponseDTO;
import amabilis.controle.dto.FornecedorDTO;

import java.util.ArrayList;
import java.util.List;

public class NotaFiscalConversor {

    public static NotaFiscalResponseDTO converterParaDTO(NotaFiscal notaFiscal) {
        if (notaFiscal == null) {
            return null;
        }

        FornecedorDTO fornecedorDTO = notaFiscal.getFornecedor() != null
                ? FornecedorConversor.converterParaDTO(notaFiscal.getFornecedor())
                : null;

        return new NotaFiscalResponseDTO(
                notaFiscal.getId(),
                notaFiscal.getNumeroDocumento(),
                notaFiscal.getDataEmissao(),
                notaFiscal.getDataVencimento(),
                notaFiscal.getValorTotal(),
                notaFiscal.getValorTotalPago(),
                notaFiscal.getStatusNotaFiscal(),
                fornecedorDTO
        );
    }

    public static NotaFiscalComItensResponseDTO converterParaDTOComItens(NotaFiscal notaFiscal) {
        if (notaFiscal == null) {
            return null;
        }

        FornecedorDTO fornecedorDTO = notaFiscal.getFornecedor() != null
                ? FornecedorConversor.converterParaDTO(notaFiscal.getFornecedor())
                : null;

        List<ItemNotaFiscalResponseDTO> itensDTO = new ArrayList<>();
        if (notaFiscal.getItens() != null) {
            itensDTO = notaFiscal.getItens().stream()
                    .map(item -> ItemNotaFiscalConversor.converterParaDTO(item, null))
                    .toList();
        }

        return new NotaFiscalComItensResponseDTO(
                notaFiscal.getId(),
                notaFiscal.getNumeroDocumento(),
                notaFiscal.getDataEmissao(),
                notaFiscal.getDataVencimento(),
                notaFiscal.getValorTotal(),
                fornecedorDTO,
                itensDTO
        );
    }
}

