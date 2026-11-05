package amabilis.controle.repository;

import amabilis.controle.domain.ItemObra;
import amabilis.controle.domain.Obra;
import amabilis.controle.domain.Tarefa;
import amabilis.controle.dto.relatorio.RelatorioCustoLinhaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface ItemObraRepository extends JpaRepository<ItemObra, Long> {

    Optional<ItemObra> findByTarefaAndObra(Tarefa tarefa, Obra obra);

    boolean existsByRecursosAlocadosId(Long itemNotaFiscalId);

    @Query(value = """
            SELECT new amabilis.controle.dto.relatorio.RelatorioCustoLinhaDTO(
                infs.id,
                nf.dataEmissao,
                nf.dataVencimento,
                (SELECT MIN(p.dataPagamento) FROM PagamentoNotaFiscal p WHERE p.notaFiscal = nf),
                nf.numeroDocumento,
                forn.nomeFantasia,
                t.codigoTarefa,
                t.descricao,
                r.codigoHierarquico,
                r.descricao,
                infs.valorItem
            )
            FROM ItemObra io
            JOIN io.recursosAlocados infs
            JOIN infs.notaFiscal nf
            LEFT JOIN nf.fornecedor forn
            LEFT JOIN io.tarefa t
            LEFT JOIN infs.recurso r
            WHERE io.obra.id = :obraId
              AND (cast(:dataEmissaoInicio as LocalDate) IS NULL OR nf.dataEmissao >= :dataEmissaoInicio)
              AND (cast(:dataEmissaoFim    as LocalDate) IS NULL OR nf.dataEmissao <= :dataEmissaoFim)
              AND (cast(:dataEmissao       as LocalDate) IS NULL OR nf.dataEmissao = :dataEmissao)
              AND (cast(:dataVencimento    as LocalDate) IS NULL OR nf.dataVencimento = :dataVencimento)
              AND (cast(:fornecedorId      as Long)      IS NULL OR forn.id = :fornecedorId)
              AND (cast(:codigoTarefa      as String)    IS NULL OR t.codigoTarefa = :codigoTarefa)
              AND (cast(:codigoRecurso     as String)    IS NULL OR r.codigoHierarquico = :codigoRecurso)
              AND (cast(:codigoNf          as String)    IS NULL OR nf.numeroDocumento = :codigoNf)
            """,
            countQuery = """
            SELECT COUNT(infs)
            FROM ItemObra io
            JOIN io.recursosAlocados infs
            JOIN infs.notaFiscal nf
            LEFT JOIN nf.fornecedor forn
            LEFT JOIN io.tarefa t
            LEFT JOIN infs.recurso r
            WHERE io.obra.id = :obraId
              AND (cast(:dataEmissaoInicio as LocalDate) IS NULL OR nf.dataEmissao >= :dataEmissaoInicio)
              AND (cast(:dataEmissaoFim    as LocalDate) IS NULL OR nf.dataEmissao <= :dataEmissaoFim)
              AND (cast(:dataEmissao       as LocalDate) IS NULL OR nf.dataEmissao = :dataEmissao)
              AND (cast(:dataVencimento    as LocalDate) IS NULL OR nf.dataVencimento = :dataVencimento)
              AND (cast(:fornecedorId      as Long)      IS NULL OR forn.id = :fornecedorId)
              AND (cast(:codigoTarefa      as String)    IS NULL OR t.codigoTarefa = :codigoTarefa)
              AND (cast(:codigoRecurso     as String)    IS NULL OR r.codigoHierarquico = :codigoRecurso)
              AND (cast(:codigoNf          as String)    IS NULL OR nf.numeroDocumento = :codigoNf)
            """)
    Page<RelatorioCustoLinhaDTO> buscarRelatorioCustos(
            @Param("obraId") Long obraId,
            @Param("dataEmissaoInicio") LocalDate dataEmissaoInicio,
            @Param("dataEmissaoFim") LocalDate dataEmissaoFim,
            @Param("dataEmissao") LocalDate dataEmissao,
            @Param("dataVencimento") LocalDate dataVencimento,
            @Param("fornecedorId") Long fornecedorId,
            @Param("codigoTarefa") String codigoTarefa,
            @Param("codigoRecurso") String codigoRecurso,
            @Param("codigoNf") String codigoNf,
            Pageable pageable
    );

    Optional<ItemObra> findFirstByRecursosAlocadosId(Long recursoAlocadoId);
}
