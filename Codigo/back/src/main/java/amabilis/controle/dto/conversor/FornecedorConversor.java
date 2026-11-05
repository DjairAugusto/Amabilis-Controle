package amabilis.controle.dto.conversor;

import amabilis.controle.domain.Fornecedor;
import amabilis.controle.domain.enums.Documento;
import amabilis.controle.dto.FornecedorDTO;

public class FornecedorConversor {

    public static Fornecedor converterParaEntidade(FornecedorDTO dto){
        Fornecedor fornecedor = new Fornecedor();
        fornecedor.setCodigoFornecedor(dto.codigoFornecedor());
        fornecedor.setRazaoSocial(dto.razaoSocial());
        fornecedor.setNomeFantasia(dto.nomeFantasia());
        fornecedor.setDocumento(dto.documento());
        fornecedor.setStatusFornecedor(dto.statusFornecedor());
        fornecedor.setEndereco(dto.endereco());
        fornecedor.setInscricaoEstadual(dto.inscricaoEstadual());
        fornecedor.setInscricaoMunicipal(dto.inscricaoMunicipal());

        if (dto.tipoDocumento() != null) {
            fornecedor.setTipoDocumento(Documento.valueOf(dto.tipoDocumento().toUpperCase()));
        }
        return fornecedor;
    }

    public static FornecedorDTO converterParaDTO(Fornecedor fornecedor) {
        return new FornecedorDTO(
                fornecedor.getId(),
                fornecedor.getCodigoFornecedor(),
                fornecedor.getRazaoSocial(),
                fornecedor.getNomeFantasia(),
                fornecedor.getTipoDocumento() != null ? fornecedor.getTipoDocumento().name() : null,
                fornecedor.getDocumento(),
                fornecedor.isStatusFornecedor(),
                fornecedor.getEndereco(),
                fornecedor.getInscricaoEstadual(),
                fornecedor.getInscricaoMunicipal()
        );
    }
}

