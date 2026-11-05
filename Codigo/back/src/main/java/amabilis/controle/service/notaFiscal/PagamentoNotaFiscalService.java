package amabilis.controle.service.notaFiscal;

import amabilis.controle.domain.notaFiscal.NotaFiscal;
import amabilis.controle.domain.notaFiscal.PagamentoNotaFiscal;
import amabilis.controle.dto.PaginaResponseDTO;
import amabilis.controle.dto.conversor.PagamentoNotaFiscalConversor;
import amabilis.controle.dto.notaFiscal.CardPagamentoNotaFiscalDTO;
import amabilis.controle.dto.notaFiscal.FiltroCardsPagamentoDTO;
import amabilis.controle.dto.notaFiscal.NovoPagamentoNotaFiscalDTO;
import amabilis.controle.dto.notaFiscal.PagamentoNotaFiscalDTO;
import amabilis.controle.dto.notaFiscal.StatusNotaFiscalRequestDTO;
import amabilis.controle.dto.notaFiscal.AgendarPagamentoDTO;
import amabilis.controle.domain.enums.StatusPagamento;
import amabilis.controle.repository.notaFiscal.NotaFiscalRepository;
import amabilis.controle.repository.notaFiscal.PagamentoNotaFiscalRepository;
import amabilis.controle.repository.ObraRepository;
import amabilis.controle.domain.Obra;
import amabilis.controle.specification.NotaFiscalEspecificacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class PagamentoNotaFiscalService {

    @Autowired
    private PagamentoNotaFiscalRepository pagamentoNotaFiscalRepository;

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @Autowired
    private ObraRepository obraRepository;

    public PaginaResponseDTO<CardPagamentoNotaFiscalDTO> listarCardsPagamentos(FiltroCardsPagamentoDTO filtro, Pageable paginacao) {

        Specification<NotaFiscal> especificacao = Specification
                .where(NotaFiscalEspecificacao.porTermo(filtro.termo()))
                .and(NotaFiscalEspecificacao.porNomeObra(filtro.nomeObra()))
                .and(NotaFiscalEspecificacao.porStatus(filtro.statusNotaFiscal()))
                .and(NotaFiscalEspecificacao.porDataVencimentoEntre(filtro.dataVencimentoInicio(), filtro.dataVencimentoFim()));

        return PaginaResponseDTO.de(
                notaFiscalRepository.findAll(especificacao, paginacao)
                        .map(PagamentoNotaFiscalConversor::converterParaCardDTO)
        );
    }

    public List<CardPagamentoNotaFiscalDTO> listarCardsPagamentos() {
        return notaFiscalRepository.findAll().stream()
                .map(PagamentoNotaFiscalConversor::converterParaCardDTO)
                .toList();
    }

    @Transactional
    public PagamentoNotaFiscalDTO registrarPagamento(long notaFiscalId, NovoPagamentoNotaFiscalDTO dto) {
        NotaFiscal notaFiscal = notaFiscalRepository.findById(notaFiscalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nota fiscal não encontrada"));

        PagamentoNotaFiscal novoPagamento = new PagamentoNotaFiscal();
        novoPagamento.setNotaFiscal(notaFiscal);
        novoPagamento.setValorPago(dto.valorPago());
        novoPagamento.setDataPagamento(dto.dataPagamento());
        novoPagamento.setStatusPagamento(StatusPagamento.PAGO);

        novoPagamento = pagamentoNotaFiscalRepository.save(novoPagamento);

        BigDecimal valorAtual = notaFiscal.getValorTotalPago() == null ? BigDecimal.ZERO : notaFiscal.getValorTotalPago();
        BigDecimal valorPago = dto.valorPago() == null ? BigDecimal.ZERO : dto.valorPago();
        notaFiscal.setValorTotalPago(valorAtual.add(valorPago));

        if(dto.proximaDataPagamento() != null){
            notaFiscal.setDataVencimento(dto.proximaDataPagamento());
        }

        notaFiscalRepository.save(notaFiscal);

        Obra obra = notaFiscal.getObra();
        if (obra != null) {
            BigDecimal custoRealAtual = obra.getCustoReal() == null ? BigDecimal.ZERO : obra.getCustoReal();
            obra.setCustoReal(custoRealAtual.add(valorPago));
            obraRepository.save(obra);
        }

        return PagamentoNotaFiscalConversor.converterParaDTO(novoPagamento);
    }

    @Transactional
    public List<PagamentoNotaFiscalDTO> registrarPagamentosAgendados(long notaFiscalId, List<AgendarPagamentoDTO> dtos) {
        NotaFiscal notaFiscal = notaFiscalRepository.findById(notaFiscalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nota fiscal não encontrada"));

        LocalDate hoje = LocalDate.now();
        BigDecimal totalPago = BigDecimal.ZERO;

        List<PagamentoNotaFiscal> pagamentos = dtos.stream().map(dto -> {
            PagamentoNotaFiscal pag = new PagamentoNotaFiscal();
            pag.setNotaFiscal(notaFiscal);
            pag.setValorPago(dto.valorPago());
            pag.setDataPagamento(dto.dataPagamento());
            pag.setStatusPagamento(definirStatusPagamentoAgendado(dto.dataPagamento(), hoje));
            return pag;
        }).toList();

        List<PagamentoNotaFiscal> salvos = pagamentoNotaFiscalRepository.saveAll(pagamentos);

        for (PagamentoNotaFiscal p : salvos) {
            if (StatusPagamento.PAGO.equals(p.getStatusPagamento())) {
                totalPago = totalPago.add(p.getValorPago());
            }
        }

        if (totalPago.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal valorAtual = notaFiscal.getValorTotalPago() == null ? BigDecimal.ZERO : notaFiscal.getValorTotalPago();
            notaFiscal.setValorTotalPago(valorAtual.add(totalPago));
            notaFiscalRepository.save(notaFiscal);

            Obra obra = notaFiscal.getObra();
            if (obra != null) {
                BigDecimal custoRealAtual = obra.getCustoReal() == null ? BigDecimal.ZERO : obra.getCustoReal();
                obra.setCustoReal(custoRealAtual.add(totalPago));
                obraRepository.save(obra);
            }
        }

        return salvos.stream().map(PagamentoNotaFiscalConversor::converterParaDTO).toList();
    }

    private StatusPagamento definirStatusPagamentoAgendado(LocalDate dataPagamento, LocalDate hoje) {
        if (dataPagamento == null) return StatusPagamento.PAGO;
        return (dataPagamento.isEqual(hoje) || dataPagamento.isBefore(hoje)) ? StatusPagamento.PAGO : StatusPagamento.AGENDADO;
    }

    @Transactional
    public void alterarStatus(Long notaFiscalId, StatusNotaFiscalRequestDTO dto) {
        NotaFiscal notaFiscal = notaFiscalRepository.findById(notaFiscalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nota fiscal não encontrada"));
        
        notaFiscal.setStatusNotaFiscal(dto.status());
        notaFiscalRepository.save(notaFiscal);
    }

    @Transactional
    public void deletar(Long id) {
        PagamentoNotaFiscal pagamento = pagamentoNotaFiscalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pagamento não encontrado"));
        
        NotaFiscal notaFiscal = pagamento.getNotaFiscal();
        if (notaFiscal != null && pagamento.getValorPago() != null) {
            BigDecimal valorAtual = notaFiscal.getValorTotalPago() == null ? BigDecimal.ZERO : notaFiscal.getValorTotalPago();
            notaFiscal.setValorTotalPago(valorAtual.subtract(pagamento.getValorPago()));
            notaFiscalRepository.save(notaFiscal);

            Obra obra = notaFiscal.getObra();
            if (obra != null) {
                BigDecimal custoRealAtual = obra.getCustoReal() == null ? BigDecimal.ZERO : obra.getCustoReal();
                obra.setCustoReal(custoRealAtual.subtract(pagamento.getValorPago()));
                obraRepository.save(obra);
            }
        }

        pagamentoNotaFiscalRepository.deleteById(id);
    }

    @Transactional
    public void processarPagamentosAgendados() {
        LocalDate hoje = LocalDate.now();
        List<PagamentoNotaFiscal> pagamentosAgendados = pagamentoNotaFiscalRepository
                .findByStatusPagamentoAndDataPagamentoLessThanEqual(StatusPagamento.AGENDADO, hoje);

        if (pagamentosAgendados.isEmpty()) {
            return;
        }

        for (PagamentoNotaFiscal pagamento : pagamentosAgendados) {
            pagamento.setStatusPagamento(StatusPagamento.PAGO);
            
            NotaFiscal notaFiscal = pagamento.getNotaFiscal();
            if (notaFiscal != null) {
                BigDecimal valorAtual = notaFiscal.getValorTotalPago() == null ? BigDecimal.ZERO : notaFiscal.getValorTotalPago();
                BigDecimal valorPago = pagamento.getValorPago() == null ? BigDecimal.ZERO : pagamento.getValorPago();
                notaFiscal.setValorTotalPago(valorAtual.add(valorPago));
                notaFiscalRepository.save(notaFiscal);

                Obra obra = notaFiscal.getObra();
                if (obra != null) {
                    BigDecimal custoRealAtual = obra.getCustoReal() == null ? BigDecimal.ZERO : obra.getCustoReal();
                    obra.setCustoReal(custoRealAtual.add(valorPago));
                    obraRepository.save(obra);
                }
            }
        }
        
        pagamentoNotaFiscalRepository.saveAll(pagamentosAgendados);
    }
}
