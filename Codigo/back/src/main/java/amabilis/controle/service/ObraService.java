package amabilis.controle.service;

import java.util.List;
import java.util.stream.Collectors;

import amabilis.controle.domain.enums.StatusItemObra;
import amabilis.controle.dto.*;
import amabilis.controle.dto.conversor.ObraConversor;
import amabilis.controle.repository.TarefaRepository;
import amabilis.controle.specification.ObraEspecificacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import amabilis.controle.domain.ItemObra;
import amabilis.controle.domain.Obra;
import amabilis.controle.domain.Tarefa;
import amabilis.controle.repository.ItemObraRepository;
import amabilis.controle.repository.ObraRepository;
import amabilis.controle.repository.notaFiscal.NotaFiscalRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ObraService {
    
    @Autowired
    private ObraRepository obraRepository;

    @Autowired
    private ItemObraRepository itemObraRepository;

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    //CREATE
    @Transactional
    public RetornoObraDTO salvar(CriarObraDTO dto){
        //validaçao de unicidade do centro de custo
        if(obraRepository.existsByCentroDeCusto(dto.centroDeCusto())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Código de Centro de Custo já existente.");
        }
        Obra obra = ObraConversor.converterParaEntidade(dto, new Obra());
        Obra salva = obraRepository.save(obra);
        return ObraConversor.converterParaDTO(salva, 0);
    }

    //READ (todas)
    public List<RetornoObraDTO> listarTodas(){
        return obraRepository.findAll().stream().map(obra -> {
            int qtdNfs = notaFiscalRepository.countByObraId(obra.getId());
            return ObraConversor.converterParaDTO(obra, qtdNfs);
        }).collect(Collectors.toList());
    }

    //READ (por id)
    public RetornoObraDTO buscarPorId(Long id){
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Obra não encontrada com o ID: " + id));
        int qtdNfs = notaFiscalRepository.countByObraId(obra.getId());
        return ObraConversor.converterParaDTO(obra, qtdNfs);
    }

    //UPDATE
    @Transactional
    public RetornoObraDTO atualizar(Long id, CriarObraDTO dto){
        Obra existente = obraRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Obra não encontrada com o ID: " + id));

        Obra atualizada = obraRepository.save(ObraConversor.converterParaEntidade(dto, existente));
        int qtdNfs = notaFiscalRepository.countByObraId(atualizada.getId());
        return ObraConversor.converterParaDTO(atualizada, qtdNfs);
    }

    //DELETE
    public void deletar(Long id){
        if (!obraRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Obra não encontrada com o ID: " + id);
        }
        obraRepository.deleteById(id);
    }

    @Transactional
    public void atribuirTarefa(long obraId, AlocacaoTarefasRequestDTO dto) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Obra não encontrada"));

        sincronizarTarefasDaObra(obra, dto.tarefaIds());
    }

    private void sincronizarTarefasDaObra(Obra obra, List<Long> novaListaTarefasIds) {
        if (obra.getItens() != null) {
            List<ItemObra> paraRemover = obra.getItens().stream()
                    .filter(item -> !novaListaTarefasIds.contains(item.getTarefa().getId()))
                    .toList();

            obra.getItens().removeAll(paraRemover);
        }

        java.util.Set<Long> tarefasExistentes = obra.getItens() != null
                ? obra.getItens().stream().map(item -> item.getTarefa().getId()).collect(Collectors.toSet())
                : java.util.Collections.emptySet();

        for (Long tarefaId : novaListaTarefasIds) {
            if (!tarefasExistentes.contains(tarefaId)) {
                Tarefa tarefa = tarefaRepository.findById(tarefaId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada com o ID: " + tarefaId));

                ItemObra itemObra = new ItemObra();
                itemObra.setObra(obra);
                itemObra.setTarefa(tarefa);
                itemObra.setStatus(StatusItemObra.PENDENTE);

                itemObraRepository.save(itemObra);
            }
        }
    }

    public void atualizarStatus(long itemId, StatusItemObraRequestDTO dto) {
        ItemObra item = itemObraRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado"));

        item.setStatus(dto.status());
        itemObraRepository.save(item);
    }

    public List<CardObraDTO> listarCards() {
        return obraRepository.findAll().stream()
                .map(this::converterParaCardObraDTO)
                .collect(Collectors.toList());
    }

    private CardObraDTO converterParaCardObraDTO(Obra obra) {
        long totalAtividades = calcularTotalAtividades(obra);
        long concluidas = calcularAtividadesConcluidas(obra);
        double porcentagem = calcularPorcentagem(totalAtividades, concluidas);
        long totalNFs = notaFiscalRepository.countByObraId(obra.getId());
        String enderecoFormatado = formatarEndereco(obra);

        return new CardObraDTO(
                obra.getId(),
                obra.getNomeObra(),
                obra.getStatusObra() != null ? obra.getStatusObra().getDescricao() : null,
                enderecoFormatado,
                totalAtividades,
                concluidas,
                porcentagem,
                totalNFs,
                obra.getCentroDeCusto()
        );
    }

    private long calcularTotalAtividades(Obra obra) {
        return obra.getItens() != null ? obra.getItens().size() : 0;
    }

    private long calcularAtividadesConcluidas(Obra obra) {
        if (obra.getItens() == null) return 0;
        return obra.getItens().stream()
                .filter(i -> i.getStatus() != null && "FINALIZADO".equals(i.getStatus().name()))
                .count();
    }

    private double calcularPorcentagem(long total, long concluidas) {
        return total > 0 ? ((double) concluidas / total) * 100 : 0.0;
    }

    private String formatarEndereco(Obra obra) {
        if (obra.getEndereco() == null) return "Endereço não informado";
        return String.format("%s, %s - %s",
                obra.getEndereco().logradouro(),
                obra.getEndereco().numeroEndereco(),
                obra.getEndereco().bairro());
    }


    public List<CardObraMapsDTO> listarCardsMaps() {
        return obraRepository.findAll().stream()
            .map(ObraConversor::converterParaCardObraMapsDTO)
            .collect(Collectors.toList());
    }



    public PaginaResponseDTO<CardObraDTO> listarCardsPaginados(String termo, Pageable paginacao) {
        Specification<Obra> especificacao = Specification.where(ObraEspecificacao.porTermo(termo));

        Page<Obra> paginaObras = obraRepository.findAll(especificacao, paginacao);

        // O map da própria página (Page) aceita o seu método privado converterParaCardObraDTO perfeitamente!
        return PaginaResponseDTO.de(paginaObras.map(this::converterParaCardObraDTO));
    }


}
