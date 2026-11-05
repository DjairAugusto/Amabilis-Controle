package amabilis.controle.dto;

import amabilis.controle.domain.Endereco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FornecedorDTO(



    Long id,


    String codigoFornecedor,


    @NotBlank(message = "A razão social do fornecedor é obrigatória")
    String razaoSocial,


    String nomeFantasia,


    @NotBlank(message = "Tipo de documento é obrigatório")
    String tipoDocumento,


    @NotBlank(message = "O documento do fornecedor é obrigatório")
    String documento,


    @NotNull(message = "O status do fornecedor é obrigatório")
    Boolean statusFornecedor,


    Endereco endereco,



    //CAMPOS OPCIONAIS
    String inscricaoEstadual,
    String inscricaoMunicipal



) {

}
