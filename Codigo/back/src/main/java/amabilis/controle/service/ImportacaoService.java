package amabilis.controle.service;

import amabilis.controle.domain.GrupoRecurso;
import amabilis.controle.domain.Recurso;
import amabilis.controle.domain.Tarefa;
import amabilis.controle.domain.enums.TipoRecurso;
import amabilis.controle.domain.enums.TipoTarefa;
import amabilis.controle.domain.enums.UnidadeMedida;
import amabilis.controle.repository.GrupoRecursoRepository;
import amabilis.controle.repository.RecursoRepository;
import amabilis.controle.repository.TarefaRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;

@Service
public class ImportacaoService {

    @Autowired
    private GrupoRecursoRepository grupoRecursoRepository;

    @Autowired
    private RecursoRepository recursoRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    private TipoRecurso resolverTipoPeloCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) return TipoRecurso.MATERIAL;
        String primeiro = codigo.split("\\.")[0].trim();
        return switch (primeiro) {
            case "2" -> TipoRecurso.EQUIPAMENTO;
            case "3" -> TipoRecurso.SERVICO_DE_TERCEIRO;
            case "4" -> TipoRecurso.MAO_DE_OBRA_DIRETO;
            case "5" -> TipoRecurso.INDIRETO;
            default  -> TipoRecurso.MATERIAL;
        };
    }

    @Transactional
    public void importarExcel(MultipartFile arquivo) throws Exception {
        try (InputStream is = arquivo.getInputStream();
             Workbook wb = new HSSFWorkbook(is)) {

            importarRecursos(wb);
            importarTarefas(wb, "Banco Tarefas Diretas", TipoTarefa.DIRETA);
            importarTarefas(wb, "Banco Tarefas Indiretas", TipoTarefa.INDIRETA);
        }
    }

    // -----------------------------------------------------------------------
    // RECURSOS
    // -----------------------------------------------------------------------
    private void importarRecursos(Workbook wb) {
        Sheet sheet = wb.getSheet("Banco Recurso");
        if (sheet == null) return;

        Map<String, GrupoRecurso> gruposCache = new HashMap<>();

        for (int i = 4; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;

            String codigo    = getCellValue(row, 0);
            String nomeGrupo = getCellValue(row, 1);
            String descricao = getCellValue(row, 2);
            String unidade   = getCellValue(row, 3);

            if (codigo == null || nomeGrupo == null || descricao == null) continue;

            codigo    = codigo.trim();
            nomeGrupo = nomeGrupo.trim();
            descricao = descricao.trim();

            TipoRecurso tipo = resolverTipoPeloCodigo(codigo);

            GrupoRecurso grupo = gruposCache.computeIfAbsent(nomeGrupo, nome ->
                grupoRecursoRepository
                    .findByNomeGrupoAndTipoRecurso(nome, tipo)
                    .orElseGet(() -> {
                        GrupoRecurso g = new GrupoRecurso();
                        g.setNomeGrupo(nome);
                        g.setTipoRecurso(tipo);
                        return grupoRecursoRepository.save(g);
                    })
            );

            if (recursoRepository.findByCodigoHierarquico(codigo).isPresent()) continue;

            Recurso recurso = new Recurso();
            recurso.setCodigoHierarquico(codigo);
            recurso.setDescricao(descricao);
            recurso.setGrupoRecurso(grupo);
            recurso.setTipoRecurso(tipo);
            recurso.setUnidadeMedida(normalizarUnidade(unidade));
            recurso.setRecursoSuperior(null);

            recursoRepository.save(recurso);
        }
    }

    // -----------------------------------------------------------------------
    // TAREFAS
    // -----------------------------------------------------------------------
    private void importarTarefas(Workbook wb, String nomeAba, TipoTarefa tipoTarefa) {
        Sheet sheet = wb.getSheet(nomeAba);
        if (sheet == null) return;

        int colCodigo    = tipoTarefa == TipoTarefa.DIRETA ? 1 : 0;
        int colDescricao = tipoTarefa == TipoTarefa.DIRETA ? 2 : 1;
        int colUnidade   = tipoTarefa == TipoTarefa.DIRETA ? 3 : 2;

        Map<String, Tarefa> codigoMap = new LinkedHashMap<>();

        for (int i = 4; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;

            String codigo    = getCellValue(row, colCodigo);
            String descricao = getCellValue(row, colDescricao);
            String unidade   = getCellValue(row, colUnidade);

            if (codigo == null || descricao == null) continue;
            codigo    = codigo.trim();
            descricao = descricao.trim();

            if (tarefaRepository.findByCodigoTarefaAndTipoTarefa(codigo, tipoTarefa).isPresent()) continue;

            Tarefa pai = encontrarTarefaPai(codigo, codigoMap);

            Tarefa tarefa = new Tarefa();
            tarefa.setCodigoTarefa(codigo);
            tarefa.setDescricao(descricao);
            tarefa.setTipoTarefa(tipoTarefa);
            tarefa.setUnidadeMedida(normalizarUnidade(unidade));
            tarefa.setTarefaPai(pai);

            Tarefa salva = tarefaRepository.save(tarefa);

            // Salva no mapa com e sem ponto final para garantir que filhos achem o pai
            codigoMap.put(codigo, salva);
            if (!codigo.endsWith(".")) {
                codigoMap.put(codigo + ".", salva);
            }
        }
    }

    private Tarefa encontrarTarefaPai(String codigo, Map<String, Tarefa> codigoMap) {
    String[] partes = Arrays.stream(codigo.split("\\."))
        .filter(p -> !p.isEmpty())
        .toArray(String[]::new);

    if (partes.length <= 1) return null;

    // Tenta subindo níveis até achar um pai que existe
    for (int nivel = partes.length - 1; nivel >= 1; nivel--) {
        String paiSemPonto = String.join(".", Arrays.copyOfRange(partes, 0, nivel));
        String paiComPonto = paiSemPonto + ".";

        Tarefa pai = codigoMap.get(paiComPonto);
        if (pai == null) pai = codigoMap.get(paiSemPonto);
        if (pai != null) return pai;
    }

    return null;
}

    // -----------------------------------------------------------------------
    // UTILITÁRIOS
    // -----------------------------------------------------------------------
    private String getCellValue(Row row, int col) {
        if (col >= row.getLastCellNum()) return null;
        Cell cell = row.getCell(col);
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING  -> cell.getStringCellValue().trim().isEmpty() ? null : cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default      -> null;
        };
    }

    private UnidadeMedida normalizarUnidade(String unidade) {
        if (unidade == null) return null;
        try {
            return switch (unidade.trim().toUpperCase()) {
                case "M³"      -> UnidadeMedida.M3;
                case "PÇ"      -> UnidadeMedida.PC;
                case "MÊS"     -> UnidadeMedida.MES;
                case "BASTÃO"  -> UnidadeMedida.BASTAO;
                case "UND/MÊS" -> UnidadeMedida.UND_MES;
                case "LITRO"   -> UnidadeMedida.LITRO;
                case "CAIXA"   -> UnidadeMedida.CAIXA;
                default        -> UnidadeMedida.valueOf(unidade.trim().toUpperCase());
            };
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}