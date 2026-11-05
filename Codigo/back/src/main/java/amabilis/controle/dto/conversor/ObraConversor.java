package amabilis.controle.dto.conversor;

import java.util.List;
import java.util.stream.Collectors;

import amabilis.controle.domain.Endereco;
import amabilis.controle.domain.Obra;
import amabilis.controle.dto.CardObraMapsDTO;
import amabilis.controle.dto.CriarObraDTO;
import amabilis.controle.dto.RetornoItemObraDTO;
import amabilis.controle.dto.RetornoObraDTO;

public class ObraConversor {

    public static Obra converterParaEntidade(CriarObraDTO dto, Obra obra){
        obra.setCentroDeCusto(dto.centroDeCusto());
        obra.setNomeObra(dto.nomeObra());
        obra.setConstrutora(dto.construtora());
        obra.setStatusObra(dto.statusObra());
        obra.setOrcamento(dto.orcamento());
        obra.setCustoReal(dto.custoReal());



        if(dto.endereco() != null){
            obra.setEndereco(dto.endereco());
        }

        return obra;
    }

    public static RetornoObraDTO converterParaDTO(Obra obra, int notasFiscais){

        List<RetornoItemObraDTO> itensDTO = null;

        if (obra.getItens() != null) {
            itensDTO = obra.getItens().stream().map(ItemObraConversor::converterParaDTO).collect(Collectors.toList());
        }
        
        int totalAtividades = obra.getItens() != null ? obra.getItens().size() : 0;

        return new RetornoObraDTO(
                obra.getId(),
                obra.getCentroDeCusto(),
                obra.getNomeObra(),
                obra.getEndereco(),
                obra.getConstrutora(),
                obra.getStatusObra() != null ? obra.getStatusObra().getDescricao() : null,
                obra.getOrcamento(),
                obra.getCustoReal(),
                totalAtividades,
                notasFiscais,
                itensDTO);
    }


    public static CardObraMapsDTO converterParaCardObraMapsDTO(Obra obra) {
    String enderecoFormatado = obra.getEndereco() != null
            ? String.format("%s, %s - %s, %s - %s",
                    obra.getEndereco().logradouro(),
                    obra.getEndereco().numeroEndereco(),
                    obra.getEndereco().bairro(),
                    obra.getEndereco().cidade(),
                    obra.getEndereco().estado())
            : "Endereço não informado";

    Double latitude = obra.getEndereco() != null ? obra.getEndereco().latitude() : null;
    Double longitude = obra.getEndereco() != null ? obra.getEndereco().longitude() : null;

    return new CardObraMapsDTO(
            obra.getId(),
            obra.getNomeObra(),
            obra.getStatusObra() != null ? obra.getStatusObra().getDescricao() : null,
            enderecoFormatado,
            latitude,
            longitude
    );
}

}
