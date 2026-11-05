package amabilis.controle.service.notaFiscal;

import amabilis.controle.domain.Fornecedor;
import amabilis.controle.domain.Obra;
import amabilis.controle.domain.enums.StatusNotaFiscal;
import amabilis.controle.domain.notaFiscal.ItemNotaFiscal;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import amabilis.controle.dto.conversor.NotaFiscalConversor;
import amabilis.controle.dto.notaFiscal.*;
import amabilis.controle.repository.FornecedorRepository;
import amabilis.controle.repository.ItemObraRepository;
import amabilis.controle.repository.ObraRepository;
import amabilis.controle.repository.notaFiscal.NotaFiscalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import amabilis.controle.repository.TarefaRepository;
import amabilis.controle.repository.notaFiscal.ItemNotaFiscalRepository;
import amabilis.controle.dto.PaginaResponseDTO;
import amabilis.controle.dto.notaFiscal.FiltroNotaFiscalDTO;
import amabilis.controle.specification.NotaFiscalEspecificacao;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@Service
public class NotaFiscalService {

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @Autowired
    private ObraRepository obraRepository;

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @Autowired
    private ItemNotaFiscalService itemNotaFiscalService;

    @Autowired
    private ItemNotaFiscalRepository itemNotaFiscalRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private ItemObraRepository itemObraRepository;

    public NotaFiscalComItensResponseDTO buscarPorId(long id) {
        NotaFiscal notaFiscal = notaFiscalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return NotaFiscalConversor.converterParaDTOComItens(notaFiscal);
    }

    public PaginaResponseDTO<NotaFiscalResponseDTO> listarPorObraComFiltros(
            long obraId, FiltroNotaFiscalDTO filtro, Pageable paginacao) {

        Specification<NotaFiscal> especificacao = Specification
                .where(NotaFiscalEspecificacao.porObra(obraId))
                .and(NotaFiscalEspecificacao.porStatus(filtro.statusNotaFiscal()))
                .and(NotaFiscalEspecificacao.porFornecedor(filtro.fornecedorId()))
                .and(NotaFiscalEspecificacao.porNumeroDocumento(filtro.numeroDocumento()))
                .and(NotaFiscalEspecificacao.porDataEmissao(filtro.dataEmissao()))
                .and(NotaFiscalEspecificacao.porDataVencimento(filtro.dataVencimento()));

        return PaginaResponseDTO.de(
                notaFiscalRepository.findAll(especificacao, paginacao)
                        .map(NotaFiscalConversor::converterParaDTO)
        );
    }

    @Transactional
    public NotaFiscalComItensResponseDTO criar(long obraId, CriarNotaFiscalComItensRequestDTO dto) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Obra não encontrada"));

        if (dto.valorTotal() != null && dto.valorTotal().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valor total deve ser maior que zero");
        }

        if (notaFiscalRepository.existsByNumeroDocumento(dto.numeroDocumento())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Já existe uma nota fiscal com esse número de documento");
        }

        Fornecedor fornecedor = fornecedorRepository.findById(dto.fornecedorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fornecedor não encontrado"));

        NotaFiscal notaFiscalCriada = new NotaFiscal();
        notaFiscalCriada.setObra(obra);
        notaFiscalCriada.setFornecedor(fornecedor);
        notaFiscalCriada.setValorTotal(dto.valorTotal());
        notaFiscalCriada.setDataEmissao(dto.dataEmissao());
        notaFiscalCriada.setDataVencimento(dto.dataVencimento());
        notaFiscalCriada.setNumeroDocumento(dto.numeroDocumento());
        notaFiscalCriada.setStatusNotaFiscal(StatusNotaFiscal.PENDENTE);
        notaFiscalCriada.setValorTotalPago(BigDecimal.ZERO);

        notaFiscalRepository.save(notaFiscalCriada);

        if(dto.itens() != null) {
            List<ItemNotaFiscal> itens = salvarItens(notaFiscalCriada, dto.itens());
            notaFiscalCriada.getItens().addAll(itens);
            notaFiscalRepository.save(notaFiscalCriada);
        }

        return NotaFiscalConversor.converterParaDTOComItens(notaFiscalCriada);
    }

    private List<ItemNotaFiscal> salvarItens(NotaFiscal notaFiscal, List<CriarItemNotaFiscalRequestDTO> itensDto) {
        if (itensDto == null) {
            return null;
        }
        return itensDto.stream().map(item -> itemNotaFiscalService.criar(notaFiscal, item)).toList();
    }

    @Transactional
    public NotaFiscalComItensResponseDTO atualizar(long id, AtualizarNotaFiscalComItensRequestDTO dto) {
        NotaFiscal notaFiscal = notaFiscalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if(dto.fornecedorId() != null) {
            Fornecedor fornecedor = fornecedorRepository.findById(dto.fornecedorId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fornecedor não encontrado"));

            notaFiscal.setFornecedor(fornecedor);
        }

        if(dto.dataEmissao() != null) {
            notaFiscal.setDataEmissao(dto.dataEmissao());
        }

        if(dto.dataVencimento() != null) {
            notaFiscal.setDataVencimento(dto.dataVencimento());
        }

        if(dto.numeroDocumento() != null) {
            if (!dto.numeroDocumento().equals(notaFiscal.getNumeroDocumento())
                    && notaFiscalRepository.existsByNumeroDocumento(dto.numeroDocumento())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Já existe uma nota fiscal com esse número de documento");
            }
            notaFiscal.setNumeroDocumento(dto.numeroDocumento());
        }

        if (dto.valorTotal() != null) {
            if (dto.valorTotal().compareTo(BigDecimal.ZERO) < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valor total deve ser maior que zero");
            }
            notaFiscal.setValorTotal(dto.valorTotal());
        }

        if(dto.itens() != null) {
            sincronizarItens(notaFiscal, dto.itens());
        }

        notaFiscalRepository.save(notaFiscal);

        return NotaFiscalConversor.converterParaDTOComItens(notaFiscal);
    }

    private void sincronizarItens(NotaFiscal notaFiscal, List<CriarItemNotaFiscalRequestDTO> itensRecebidos) {
        if (itensRecebidos == null) {
            return;
        }

        List<Long> idsEnviados = itensRecebidos.stream()
                .map(CriarItemNotaFiscalRequestDTO::id)
                .filter(java.util.Objects::nonNull)
                .toList();

        List<ItemNotaFiscal> itensParaRemover = notaFiscal.getItens().stream()
                .filter(itemNf -> itemNf.getId() != 0 && !idsEnviados.contains(itemNf.getId()))
                .toList();

        for (ItemNotaFiscal itemRemover : itensParaRemover) {
            if (itemObraRepository.existsByRecursosAlocadosId(itemRemover.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "O item de id " + itemRemover.getId() + " não pode ser removido pois já está alocado a uma tarefa da obra.");
            }
        }

        notaFiscal.getItens().removeAll(itensParaRemover);

        for (CriarItemNotaFiscalRequestDTO itemDto : itensRecebidos) {
            if (itemDto.id() != null) {
                itemNotaFiscalService.atualizar(notaFiscal, itemDto);
            } else {
                ItemNotaFiscal novo = itemNotaFiscalService.criar(notaFiscal, itemDto);
                notaFiscal.getItens().add(novo);
            }
        }
    }

    @Transactional
    public void deletar(long id) {
        NotaFiscal notaFiscal = notaFiscalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nota fiscal não encontrada"));

        if (notaFiscal.getItens() != null) {
            for (ItemNotaFiscal item : notaFiscal.getItens()) {
                if (itemObraRepository.existsByRecursosAlocadosId(item.getId())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "A nota fiscal não pode ser removida pois possui itens alocados a uma tarefa da obra.");
                }
            }
        }
        
        notaFiscalRepository.delete(notaFiscal);
    }
}
