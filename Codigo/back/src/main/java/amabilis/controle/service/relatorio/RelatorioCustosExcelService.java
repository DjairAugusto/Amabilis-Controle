package amabilis.controle.service.relatorio;

import amabilis.controle.domain.ItemObra;
import amabilis.controle.domain.Obra;
import amabilis.controle.domain.notaFiscal.ItemNotaFiscal;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class RelatorioCustosExcelService extends RelatorioBaseExcelService {

    public void gerarRelatorio(long obraId, HttpServletResponse response) {
        Obra obra = buscarObra(obraId);
        List<ItemObra> itensObra = obra.getItens();
        String[] cabecalhoCustos = {"EMISSÃO", "VENCTO", "PAGTO", "N° DO DOCTO", "FORNECEDOR", "COD.TAREFA", "DESCRIÇÃO TAREFA", "COD.RECURSO", "DESCRIÇÃO RECURSO", "VALOR"};
        
        try (XSSFWorkbook arquivoExcel = new XSSFWorkbook()) {
            Map<String, XSSFCellStyle> estilos = criarEstilos(arquivoExcel);
            XSSFSheet planilha = criarPlanilha(arquivoExcel, obra, "Custos");
            
            BigDecimal valorTotal = calcularValorTotal(itensObra);

            criarCabecalhoPrincipal(planilha, obra, valorTotal, estilos, "REGISTRO DE DESPESAS DA OBRA", "CUSTO TOTAL");
            criarCabecalhoTabela(planilha, estilos.get("cabecalhoTabela"), cabecalhoCustos);
            preencherDadosCustos(planilha, itensObra, estilos);
            ajustarLarguraColunas(planilha, 10);

            escreverResposta(arquivoExcel, response);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erro ao gerar relatório de custos", e);
        }
    }

    private BigDecimal calcularValorTotal(List<ItemObra> itensObra) {
        BigDecimal total = BigDecimal.ZERO;
        for (ItemObra itemObra : itensObra) {
            for (ItemNotaFiscal itemNf : itemObra.getRecursosAlocados()) {
                if (itemNf.getValorItem() != null) {
                    total = total.add(itemNf.getValorItem());
                }
            }
        }
        return total;
    }

    private void preencherDadosCustos(XSSFSheet planilha, List<ItemObra> itensObra, Map<String, XSSFCellStyle> estilos) {
        int indiceLinha = 4;
        XSSFCellStyle estiloPadrao = estilos.get("estiloPadrao");
        XSSFCellStyle formatoDinheiro = estilos.get("formatoDinheiro");
        XSSFCellStyle formatoData = estilos.get("formatoData");

        for (ItemObra itemObra : itensObra) {
            for (ItemNotaFiscal itemNf : itemObra.getRecursosAlocados()) {
                NotaFiscal notaFiscal = itemNf.getNotaFiscal();
                XSSFRow linhaDados = planilha.createRow(indiceLinha++);

                criarCelula(linhaDados, 0, notaFiscal.getDataEmissao(), notaFiscal.getDataEmissao() != null ? formatoData : estiloPadrao);
                criarCelula(linhaDados, 1, notaFiscal.getDataVencimento(), notaFiscal.getDataVencimento() != null ? formatoData : estiloPadrao);

                Object dataPagto = (notaFiscal.getPagamentos() != null && !notaFiscal.getPagamentos().isEmpty()) 
                        ? notaFiscal.getPagamentos().getFirst().getDataPagamento() 
                        : "";
                criarCelula(linhaDados, 2, dataPagto, (dataPagto != null) ? formatoData : estiloPadrao);

                criarCelula(linhaDados, 3, notaFiscal.getNumeroDocumento(), estiloPadrao);
                
                if (notaFiscal.getFornecedor() != null) {
                    criarCelula(linhaDados, 4, notaFiscal.getFornecedor().getNomeFantasia(), estiloPadrao);
                }

                if (itemObra.getTarefa() != null) {
                    criarCelula(linhaDados, 5, itemObra.getTarefa().getCodigoTarefa(), estiloPadrao);
                    criarCelula(linhaDados, 6, itemObra.getTarefa().getDescricao(), estiloPadrao);
                }

                if (itemNf.getRecurso() != null) {
                    criarCelula(linhaDados, 7, itemNf.getRecurso().getCodigoHierarquico(), estiloPadrao);
                    criarCelula(linhaDados, 8, itemNf.getRecurso().getDescricao(), estiloPadrao);
                }

                Cell celulaValor = linhaDados.createCell(9);
                if (itemNf.getValorItem() != null) {
                    celulaValor.setCellValue(itemNf.getValorItem().doubleValue());
                }
                celulaValor.setCellStyle(formatoDinheiro);
            }
        }
    }
}
