package amabilis.controle.repository.notaFiscal;

import amabilis.controle.domain.enums.StatusNotaFiscal;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface NotaFiscalRepository extends JpaRepository<NotaFiscal, Long>,
        JpaSpecificationExecutor<NotaFiscal> {

    List<NotaFiscal> findByObraId(long obraId);
    List<NotaFiscal> findTop10ByObraIdOrderByDataEmissaoDesc(long obraId);
    int countByObraId(long obraId);
    Boolean existsByNumeroDocumento(String numeroDocumento);
    List<NotaFiscal> findByStatusNotaFiscalAndDataVencimentoBefore(StatusNotaFiscal status, LocalDate data);

    @Query("""
            SELECT nf FROM NotaFiscal nf
            WHERE nf.statusNotaFiscal IN :statuses
            AND nf.obra.id = :obraId
            ORDER BY nf.dataVencimento ASC
            """)
    List<NotaFiscal> findAllByStatusInAndObraId(
            @Param("statuses") List<StatusNotaFiscal> statuses,
            @Param("obraId") Long obraId
    );
}