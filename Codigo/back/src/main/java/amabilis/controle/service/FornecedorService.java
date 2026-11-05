package amabilis.controle.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import amabilis.controle.dto.conversor.FornecedorConversor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import amabilis.controle.domain.Fornecedor;
import amabilis.controle.domain.enums.Documento;
import amabilis.controle.dto.FornecedorDTO;
import amabilis.controle.repository.FornecedorRepository;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FornecedorService {
    @Autowired
    private FornecedorRepository fornecedorRepository;


    //CREATE
    public FornecedorDTO salvar(FornecedorDTO dto){
        Fornecedor fornecedor = FornecedorConversor.converterParaEntidade(dto);

        if (fornecedor.getCodigoFornecedor() == null || fornecedor.getCodigoFornecedor().trim().isEmpty()) {
            String novoCodigo = gerarProximoCodigo();
            fornecedor.setCodigoFornecedor(novoCodigo);
        }

        Fornecedor salvo = fornecedorRepository.save(fornecedor);
        return FornecedorConversor.converterParaDTO(salvo);
    }

    //READ (Todos)
    public List<FornecedorDTO> listarTodos(){
        return fornecedorRepository.findAll().stream().map(FornecedorConversor::converterParaDTO)
                                                    .collect(Collectors.toList());
    }

    //READ (Por ID)
    public FornecedorDTO buscarPorId(Long id){
        Fornecedor fornecedor = fornecedorRepository.findById(id)
    .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado com ID: " + id));
        return FornecedorConversor.converterParaDTO(fornecedor);
    }

    public FornecedorDTO buscarPorDocumento(String documento){
        Fornecedor fornecedor = fornecedorRepository.findByDocumento(documento)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fornecedor não encontrado"));
        return FornecedorConversor.converterParaDTO(fornecedor);
    }

    //UPDATE
    public FornecedorDTO atualizar(Long id, FornecedorDTO dto){
        Fornecedor existente = fornecedorRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Fornecedor não encontrado com ID: " + id));

        existente.setCodigoFornecedor(dto.codigoFornecedor());
        existente.setRazaoSocial(dto.razaoSocial());
        existente.setNomeFantasia(dto.nomeFantasia());
        existente.setDocumento(dto.documento());
        existente.setStatusFornecedor(dto.statusFornecedor());
        existente.setEndereco(dto.endereco());
        existente.setInscricaoEstadual(dto.inscricaoEstadual());
        existente.setInscricaoMunicipal(dto.inscricaoMunicipal());

        if (dto.tipoDocumento() != null) {
            existente.setTipoDocumento(Documento.valueOf(dto.tipoDocumento().toUpperCase()));
        }

        Fornecedor atualizado = fornecedorRepository.save(existente);
        return FornecedorConversor.converterParaDTO(atualizado);
    }


    //DELETE
    public void deletar(Long id){
        if(!fornecedorRepository.existsById(id)){
            throw new RuntimeException("Fornecedor não encontrado com ID: " + id);
        }
        fornecedorRepository.deleteById(id);
    }


    private String gerarProximoCodigo() {
        Optional<Fornecedor> ultimoFornecedor = fornecedorRepository.findTopByOrderByIdDesc();

        if (ultimoFornecedor.isPresent() && ultimoFornecedor.get().getCodigoFornecedor() != null) {
            String ultimoCodigo = ultimoFornecedor.get().getCodigoFornecedor(); 
            
            String apenasNumeros = ultimoCodigo.replaceAll("\\D+", ""); 
            
            if (!apenasNumeros.isEmpty()) {
                int proximoNumero = Integer.parseInt(apenasNumeros) + 1;
                return String.format("F%04d", proximoNumero); 
            }
        }
        
        return "F0001"; 
    }

}
