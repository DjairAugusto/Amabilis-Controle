package amabilis.controle.service.notaFiscal;

import amabilis.controle.domain.ItemObra;
import amabilis.controle.domain.Obra;
import amabilis.controle.domain.Recurso;
import amabilis.controle.domain.Tarefa;
import amabilis.controle.domain.notaFiscal.ItemNotaFiscal;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import amabilis.controle.dto.conversor.ItemNotaFiscalConversor;
import amabilis.controle.dto.notaFiscal.AlocacaoItensRequestDTO;
import amabilis.controle.dto.notaFiscal.CriarItemNotaFiscalRequestDTO;
import amabilis.controle.dto.notaFiscal.ItemNotaFiscalResponseDTO;
import amabilis.controle.repository.RecursoRepository;
import amabilis.controle.repository.TarefaRepository;
import amabilis.controle.repository.ItemObraRepository;
import amabilis.controle.repository.notaFiscal.ItemNotaFiscalRepository;
import amabilis.controle.repository.notaFiscal.NotaFiscalRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ItemNotaFiscalService {

    @Autowired
    private ItemNotaFiscalRepository itemNotaFiscalRepository;

    @Autowired
    private RecursoRepository recursoRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private ItemObraRepository itemObraRepository;

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    public List<ItemNotaFiscalResponseDTO> listarPorNotaFiscal(Long notaFiscalId) {
        List<ItemNotaFiscal> itens = itemNotaFiscalRepository.findByNotaFiscalId(notaFiscalId);

        // Dentro do seu método listarPorNotaFiscal:

        return itens.stream()
                .map(item -> {
                    // 🟢 Mude a chamada para findFirstByRecursosAlocadosId
                    Long tarefaIdVinculada = itemObraRepository.findFirstByRecursosAlocadosId(item.getId())
                            .map(itemObra -> itemObra.getTarefa() != null ? itemObra.getTarefa().getId() : null)
                            .orElse(null);

                    return ItemNotaFiscalConversor.converterParaDTO(item, tarefaIdVinculada);
                })
                .toList();
    }

    @Transactional
    public ItemNotaFiscal criar(NotaFiscal notaFiscal, CriarItemNotaFiscalRequestDTO dto) {
        if (dto.valorItem().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O valor do item não pode ser negativo");
        }

        Recurso recurso = recursoRepository.findById(dto.recursoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recurso não encontrado"));

        ItemNotaFiscal itemNotaFiscal = new ItemNotaFiscal();
        itemNotaFiscal.setNotaFiscal(notaFiscal);
        itemNotaFiscal.setRecurso(recurso);
        itemNotaFiscal.setValorItem(dto.valorItem());
        itemNotaFiscalRepository.save(itemNotaFiscal);

        return itemNotaFiscal;
    }

    @Transactional
    public ItemNotaFiscal atualizar(NotaFiscal notaFiscal, CriarItemNotaFiscalRequestDTO dto) {
        if (dto.id() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id do item é obrigatório para atualizar");
        }

        ItemNotaFiscal item = itemNotaFiscalRepository.findById(dto.id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado"));

        if (item.getNotaFiscal() == null || item.getNotaFiscal().getId() != notaFiscal.getId()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item não pertence à nota fiscal informada");
        }

        if (dto.valorItem() != null && dto.valorItem().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O valor do item não pode ser negativo");
        }

        if (dto.recursoId() != null) {
            Recurso recurso = recursoRepository.findById(dto.recursoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recurso não encontrado"));
            item.setRecurso(recurso);
        }

        if (dto.valorItem() != null) {
            item.setValorItem(dto.valorItem());
        }

        itemNotaFiscalRepository.save(item);
        return item;
    }

    @Transactional
    public void processarLote(Long notaFiscalId, List<AlocacaoItensRequestDTO> lote) {
        NotaFiscal notaFiscal = notaFiscalRepository.findById(notaFiscalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nota Fiscal não encontrada: " + notaFiscalId));

        Obra obraContexto = notaFiscal.getObra();

        for (AlocacaoItensRequestDTO dto : lote) {
            Tarefa tarefa = tarefaRepository.findById(dto.tarefaId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada: " + dto.tarefaId()));

            ItemNotaFiscal itemNf = itemNotaFiscalRepository.findById(dto.itemNotaFiscalId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item da NF não encontrado: " + dto.itemNotaFiscalId()));

            if (itemNf.getNotaFiscal().getId() != notaFiscalId) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Atenção: O item não pertence a esta Nota Fiscal.");
            }

            ItemObra itemObra = itemObraRepository.findByTarefaAndObra(tarefa, obraContexto)
                    .orElse(null);

            if(itemObra == null){
                itemObra = new ItemObra();
                itemObra.setTarefa(tarefa);
                itemObra.setObra(obraContexto);
            }

            itemObra.getRecursosAlocados().add(itemNf);
            itemObraRepository.save(itemObra);
        }
    }
}
