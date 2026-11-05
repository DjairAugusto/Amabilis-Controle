package amabilis.controle.service.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import amabilis.controle.repository.notaFiscal.NotaFiscalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotaFiscalScheduler {

    private static final Logger logger = LoggerFactory.getLogger(NotaFiscalScheduler.class);

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @Autowired
    private PagamentoNotaFiscalService pagamentoNotaFiscalService;

    @Scheduled(cron = "0 0 7 * * *", zone = "America/Sao_Paulo")
    @Transactional
    public void verificarNotasFiscaisVencidas() {
        logger.info("Iniciando verificação de notas fiscais vencidas.");
        LocalDate hoje = LocalDate.now();

        List<NotaFiscal> notasPendentesVencidas = notaFiscalRepository.findByStatusNotaFiscalAndDataVencimentoBefore(
                StatusNotaFiscal.PENDENTE, hoje);

        if (!notasPendentesVencidas.isEmpty()) {
            logger.info("Encontradas {} notas fiscais pendentes vencidas. Atualizando status...", notasPendentesVencidas.size());
            for (NotaFiscal notaFiscal : notasPendentesVencidas) {
                notaFiscal.setStatusNotaFiscal(StatusNotaFiscal.VENCIDA);
            }
            notaFiscalRepository.saveAll(notasPendentesVencidas);
            logger.info("Notais fiscais atualizadas com sucesso para VENCIDA.");
        } else {
            logger.info("Nenhuma nota fiscal pendente vencida encontrada.");
        }
    }

    @Scheduled(cron = "0 0 7 * * *", zone = "America/Sao_Paulo")
    public void verificarPagamentosAgendados() {
        logger.info("Iniciando processamento de pagamentos agendados para o dia de hoje.");
        pagamentoNotaFiscalService.processarPagamentosAgendados();
        logger.info("Processamento de pagamentos agendados finalizado com sucesso.");
    }
}
