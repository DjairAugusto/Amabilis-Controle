package amabilis.controle.service.relatorio;

import amabilis.controle.domain.Obra;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import amabilis.controle.domain.notaFiscal.PagamentoNotaFiscal;
import amabilis.controle.repository.notaFiscal.NotaFiscalRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class RelatorioPagamentosExcelService extends RelatorioBaseExcelService {

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    public void gerarRelatorio(long obraId, HttpServletResponse response) {
        Obra obra = buscarObra(obraId);
        String[] cabecalhoPagamento = {"N° DO DOCTO", "EMISSÃO", "VENCTO", "DATA PAGTO", "VALOR PAGO"};

        try (XSSFWorkbook arquivoExcel = new XSSFWorkbook()) {
            Map<String, XSSFCellStyle> estilos = criarEstilos(arquivoExcel);
            XSSFSheet planilha = criarPlanilha(arquivoExcel, obra, "Pagamentos");

            List<NotaFiscal> notasFiscais = notaFiscalRepository.findByObraId(obraId);
            BigDecimal valorTotal = calcularValorTotalPago(notasFiscais);

            criarCabecalhoPrincipal(planilha, obra, valorTotal, estilos, "REGISTRO DE PAGAMENTOS DA OBRA", "TOTAL PAGO");
            criarCabecalhoTabela(planilha, estilos.get("cabecalhoTabela"), cabecalhoPagamento);

            preencherDadosPagamentos(planilha, notasFiscais, estilos);
            ajustarLarguraColunas(planilha, 10);

            escreverResposta(arquivoExcel, response);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erro ao gerar relatório de pagamentos", e);
        }
    }

    private BigDecimal calcularValorTotalPago(List<NotaFiscal> notasFiscais) {
        BigDecimal total = BigDecimal.ZERO;
        
        for (NotaFiscal nf : notasFiscais) {
            if (nf.getPagamentos() != null) {
                for (PagamentoNotaFiscal pagamento : nf.getPagamentos()) {
                    if (pagamento.getValorPago() != null) {
                        total = total.add(pagamento.getValorPago());
                    }
                }
            }
        }
        return total;
    }

    private void preencherDadosPagamentos(XSSFSheet planilha, List<NotaFiscal> notasFiscais, Map<String, XSSFCellStyle> estilos) {
        int indiceLinha = 4;
        XSSFCellStyle estiloPadrao = estilos.get("estiloPadrao");
        XSSFCellStyle formatoDinheiro = estilos.get("formatoDinheiro");
        XSSFCellStyle formatoData = estilos.get("formatoData");

        for (NotaFiscal notaFiscal : notasFiscais) {
            if (notaFiscal.getPagamentos() != null && !notaFiscal.getPagamentos().isEmpty()) {
                for (PagamentoNotaFiscal pagamento : notaFiscal.getPagamentos()) {
                    XSSFRow linhaDados = planilha.createRow(indiceLinha++);

                    criarCelula(linhaDados, 0, notaFiscal.getNumeroDocumento(), estiloPadrao);
                    criarCelula(linhaDados, 1, notaFiscal.getDataEmissao(), notaFiscal.getDataEmissao() != null ? formatoData : estiloPadrao);
                    criarCelula(linhaDados, 2, notaFiscal.getDataVencimento(), notaFiscal.getDataVencimento() != null ? formatoData : estiloPadrao);
                    
                    Object dataPagto = pagamento.getDataPagamento();
                    criarCelula(linhaDados, 3, dataPagto != null ? dataPagto : "", (dataPagto != null) ? formatoData : estiloPadrao);

                    Cell celulaValor = linhaDados.createCell(4);
                    if (pagamento.getValorPago() != null) {
                        celulaValor.setCellValue(pagamento.getValorPago().doubleValue());
                    }
                    celulaValor.setCellStyle(formatoDinheiro);
                }
            }
        }
    }
}
