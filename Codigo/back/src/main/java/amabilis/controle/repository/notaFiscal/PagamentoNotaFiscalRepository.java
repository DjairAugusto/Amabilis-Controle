package amabilis.controle.repository.notaFiscal;

import amabilis.controle.domain.notaFiscal.PagamentoNotaFiscal;
import amabilis.controle.domain.enums.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;

public interface PagamentoNotaFiscalRepository extends JpaRepository<PagamentoNotaFiscal, Long>, JpaSpecificationExecutor<PagamentoNotaFiscal> {

    List<PagamentoNotaFiscal> findByNotaFiscalId(long notaFiscalId);

    List<PagamentoNotaFiscal> findByStatusPagamentoAndDataPagamentoLessThanEqual(StatusPagamento status, LocalDate data);
}
