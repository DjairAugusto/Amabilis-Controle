package amabilis.controle.service.relatorio;

import amabilis.controle.domain.Endereco;
import amabilis.controle.domain.Obra;
import amabilis.controle.repository.ObraRepository;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.awt.Color;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public abstract class RelatorioBaseExcelService {

    @Autowired
    protected ObraRepository obraRepository;

    protected Obra buscarObra(long obraId) {
        return obraRepository.findById(obraId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Obra não encontrada!"));
    }

    protected XSSFSheet criarPlanilha(XSSFWorkbook arquivoExcel, Obra obra, String prefixoPlanilha) {
        String safeSheetName = (prefixoPlanilha + " " + obra.getNomeObra()).replaceAll("[:\\\\/*?|\\[\\]]", "_");
        if (safeSheetName.length() > 31) {
            safeSheetName = safeSheetName.substring(0, 31);
        }
        return arquivoExcel.createSheet(safeSheetName);
    }

    protected Map<String, XSSFCellStyle> criarEstilos(XSSFWorkbook arquivoExcel) {
        Map<String, XSSFCellStyle> estilos = new HashMap<>();

        XSSFFont fonte = arquivoExcel.createFont();
        fonte.setFontName("Calibri");
        
        arquivoExcel.getCellStyleAt(0).setFont(fonte);

        XSSFFont fonteCabecalho = arquivoExcel.createFont();
        fonteCabecalho.setFontName("Calibri");
        fonteCabecalho.setBold(true);

        DataFormat format = arquivoExcel.createDataFormat();
        XSSFColor azulClaro = new XSSFColor(new Color(221, 235, 247), null);
        XSSFColor cinzaClaro = new XSSFColor(new Color(237, 237, 237), null);

        XSSFCellStyle formatoDinheiro = criarEstiloComBorda(arquivoExcel, fonte);
        formatoDinheiro.setDataFormat(format.getFormat("R$ #,##0.00"));
        estilos.put("formatoDinheiro", formatoDinheiro);

        XSSFCellStyle estiloPadrao = criarEstiloComBorda(arquivoExcel, fonte);
        estilos.put("estiloPadrao", estiloPadrao);

        XSSFCellStyle formatoData = criarEstiloComBorda(arquivoExcel, fonte);
        formatoData.setDataFormat(format.getFormat("dd/MM/yyyy"));
        estilos.put("formatoData", formatoData);

        XSSFCellStyle estiloCabecalho = criarEstiloComBorda(arquivoExcel, fonteCabecalho);
        estiloCabecalho.setFillForegroundColor(cinzaClaro);
        estiloCabecalho.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        estilos.put("cabecalhoTabela", estiloCabecalho);

        XSSFCellStyle celulaAzulLinha1 = criarEstiloFundoAzul(arquivoExcel, fonte, azulClaro);
        celulaAzulLinha1.setBorderBottom(BorderStyle.NONE);
        estilos.put("celulaAzulLinha1", celulaAzulLinha1);

        XSSFCellStyle celulaAzulLinha2 = criarEstiloFundoAzul(arquivoExcel, fonte, azulClaro);
        celulaAzulLinha2.setBorderTop(BorderStyle.NONE);
        estilos.put("celulaAzulLinha2", celulaAzulLinha2);

        XSSFCellStyle azulDinheiroLinha2 = criarEstiloFundoAzul(arquivoExcel, fonte, azulClaro);
        azulDinheiroLinha2.setDataFormat(format.getFormat("R$ #,##0.00"));
        azulDinheiroLinha2.setBorderTop(BorderStyle.NONE);
        estilos.put("azulDinheiroLinha2", azulDinheiroLinha2);

        return estilos;
    }

    protected XSSFCellStyle criarEstiloComBorda(XSSFWorkbook arquivoExcel, Font fonte) {
        XSSFCellStyle estilo = arquivoExcel.createCellStyle();
        estilo.setFont(fonte);
        estilo.setBorderTop(BorderStyle.THIN);
        estilo.setBorderBottom(BorderStyle.THIN);
        estilo.setBorderLeft(BorderStyle.THIN);
        estilo.setBorderRight(BorderStyle.THIN);
        return estilo;
    }

    protected XSSFCellStyle criarEstiloFundoAzul(XSSFWorkbook arquivoExcel, Font fonte, XSSFColor corFundo) {
        XSSFCellStyle estilo = criarEstiloComBorda(arquivoExcel, fonte);
        estilo.setFillForegroundColor(corFundo);
        estilo.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return estilo;
    }

    protected void criarCabecalhoPrincipal(XSSFSheet planilha, Obra obra, BigDecimal valorTotal, Map<String, XSSFCellStyle> estilos, String tipoRelatorio, String tituloColunaTotal) {
        XSSFCellStyle azulLinha1 = estilos.get("celulaAzulLinha1");
        XSSFCellStyle azulLinha2 = estilos.get("celulaAzulLinha2");
        XSSFCellStyle azulDinheiro2 = estilos.get("azulDinheiroLinha2");

        XSSFRow linha1 = planilha.createRow(0);
        Cell celulaTitulo1 = linha1.createCell(0);
        celulaTitulo1.setCellValue("CONSTRUTORA " + obra.getConstrutora().nome() + " | OBRA: " + obra.getNomeObra() + " | LOCAL: " + formatarEndereco(obra.getEndereco()));
        celulaTitulo1.setCellStyle(azulLinha1);

        for (int coluna = 1; coluna <= 8; coluna++) {
            linha1.createCell(coluna).setCellStyle(azulLinha1);
        }
        Cell celulaTituloCusto = linha1.createCell(9);
        celulaTituloCusto.setCellValue(tituloColunaTotal);
        celulaTituloCusto.setCellStyle(azulLinha1);

        XSSFRow linha2 = planilha.createRow(1);
        Cell celulaSubtitulo = linha2.createCell(0);
        celulaSubtitulo.setCellValue(tipoRelatorio);
        celulaSubtitulo.setCellStyle(azulLinha2);

        Cell celulaCustoReal = linha2.createCell(1);
        if (obra.getCustoReal() != null) {
            celulaCustoReal.setCellValue(obra.getCustoReal().doubleValue());
        }
        celulaCustoReal.setCellStyle(azulDinheiro2);

        for (int coluna = 2; coluna <= 8; coluna++) {
            linha2.createCell(coluna).setCellStyle(azulLinha2);
        }

        Cell celulaValorTotal = linha2.createCell(9);
        celulaValorTotal.setCellValue(valorTotal.doubleValue());
        celulaValorTotal.setCellStyle(azulDinheiro2);

        planilha.addMergedRegion(new CellRangeAddress(0, 0, 0, 8));
        planilha.addMergedRegion(new CellRangeAddress(1, 1, 0, 8));
    }

    protected void criarCabecalhoTabela(XSSFSheet planilha, XSSFCellStyle estiloCabecalho, String[] cabecalhos) {
        XSSFRow linhaCabecalho = planilha.createRow(3);
        for (int i = 0; i < cabecalhos.length; i++) {
            Cell celula = linhaCabecalho.createCell(i);
            celula.setCellValue(cabecalhos[i]);
            celula.setCellStyle(estiloCabecalho);
        }
    }

    protected void criarCelula(XSSFRow linha, int indice, Object valor, XSSFCellStyle estilo) {
        Cell celula = linha.createCell(indice);
        celula.setCellStyle(estilo);

        switch (valor) {
            case null -> {}
            case String str -> celula.setCellValue(str);
            case Number num -> celula.setCellValue(num.doubleValue());
            case LocalDate date -> celula.setCellValue(date);
            default -> celula.setCellValue(valor.toString());
        }
    }

    protected void ajustarLarguraColunas(XSSFSheet planilha, int numColunas) {
        for (int i = 0; i < numColunas; i++) {
            planilha.autoSizeColumn(i);
        }
    }

    protected void escreverResposta(XSSFWorkbook arquivoExcel, HttpServletResponse response) throws java.io.IOException {
        try (ServletOutputStream outputStream = response.getOutputStream()) {
            arquivoExcel.write(outputStream);
        }
    }

    protected String formatarEndereco(Endereco endereco) {
        if (endereco == null) {
            return "";
        }
        return String.format("%s, %s - %s, %s - %s",
                endereco.logradouro() != null ? endereco.logradouro() : "",
                endereco.numeroEndereco() != null ? endereco.numeroEndereco() : "",
                endereco.bairro() != null ? endereco.bairro() : "",
                endereco.cidade() != null ? endereco.cidade() : "",
                endereco.estado() != null ? endereco.estado() : "");
    }
}
