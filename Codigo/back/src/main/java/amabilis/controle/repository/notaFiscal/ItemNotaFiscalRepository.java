package amabilis.controle.repository.notaFiscal;

import amabilis.controle.domain.notaFiscal.ItemNotaFiscal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemNotaFiscalRepository extends JpaRepository<ItemNotaFiscal, Long> {
    List<ItemNotaFiscal> findByNotaFiscalId(long notaFiscalId);
}
