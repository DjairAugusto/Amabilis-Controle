package amabilis.controle.service.notaFiscal;

import amabilis.controle.domain.Fornecedor;
import amabilis.controle.domain.Recurso;
import amabilis.controle.dto.FornecedorDTO;
import amabilis.controle.dto.RecursoBasicoDTO;
import amabilis.controle.dto.conversor.FornecedorConversor;
import amabilis.controle.dto.conversor.RecursoConversor;
import amabilis.controle.dto.groq.GroqMessageDTO;
import amabilis.controle.dto.groq.GroqRequestDTO;
import amabilis.controle.dto.groq.GroqResponseDTO;
import amabilis.controle.dto.notaFiscal.ItemNotaFiscalExtraidoGroqDTO;
import amabilis.controle.dto.notaFiscal.ItemNotaFiscalOcrResponseDTO;
import amabilis.controle.dto.notaFiscal.NotaFiscalExtraidaGroqDTO;
import amabilis.controle.dto.notaFiscal.NotaFiscalOcrResponseDTO;
import amabilis.controle.dto.ocr.OcrLineDTO;
import amabilis.controle.dto.ocr.OcrSpaceResponseDTO;
import amabilis.controle.repository.FornecedorRepository;
import amabilis.controle.repository.RecursoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotaFiscalOcrService {

    private static final String OCR_API_URL = "https://api.ocr.space/parse/image";
    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    private static final String EXTRACTION_PROMPT = """
            Please extract all invoice-level fields and every line item from the attached invoice and return the data only as a single valid JSON object. Use the values exactly as they appear on the invoice when present (do not normalize text fields beyond trimming whitespace). Do not include any explanatory text, markdown, or commentary only JSON. If a field is missing on the invoice, set its value to null. Use numeric types for prices and totals. Use ISO 8601 format for dates when a date is present.
                    Required JSON structure and fields (use these exact keys)

                    numero_documento: string or null
                    data_emissao: string (ISO 8601) or null
                    data_vencimento: string (ISO 8601) or null
                    fornecedor: string or null
                    fornecedor_cnpj: string or null
                    valor_total_nota: number or null
                    valor_total_produtos: number or null

                    itens: array of objects, each with the following keys:
                    descricao: string or null
                    unidade_medida: string or null
                    valor_total: number or null

                    Strict output rule
                    Return only the JSON object that follows the structure above. No extra keys, no surrounding text, no comments.""";

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @Autowired
    private RecursoRepository recursoRepository;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${ocr.space.api.key}")
    private String ocrApiKey;

    @Value("${groq.model}")
    private String groqModel;

    private final RestClient restClient = RestClient.create();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public NotaFiscalOcrResponseDTO extrair(MultipartFile arquivo) {
        String textoOcr = extrairTextoOcr(arquivo);
        NotaFiscalExtraidaGroqDTO dadosExtraidos = extrairDadosComGroq(textoOcr);
        return montarResposta(dadosExtraidos);
    }

    private String extrairTextoOcr(MultipartFile arquivo) {
        MultiValueMap<String, Object> form = new LinkedMultiValueMap<>();
        form.add("file", criarResourceDoArquivo(arquivo));
        form.add("url", "");
        form.add("language", "por");
        form.add("isOverlayRequired", "true");
        form.add("FileType", "Auto");
        form.add("IsCreateSearchablePDF", "false");
        form.add("isSearchablePdfHideTextLayer", "true");
        form.add("detectOrientation", "false");
        form.add("isTable", "false");
        form.add("scale", "true");
        form.add("OCREngine", "2");

        OcrSpaceResponseDTO resposta;
        try {
            resposta = restClient.post()
                    .uri(OCR_API_URL)
                    .header("apikey", ocrApiKey)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(form)
                    .retrieve()
                    .body(OcrSpaceResponseDTO.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Erro ao comunicar com o serviço de OCR.");
        }

        if (resposta == null || resposta.isErroredOnProcessing()
                || resposta.parsedResults() == null || resposta.parsedResults().isEmpty()) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(422), "Não foi possível extrair o texto do anexo enviado.");
        }

        String linhas = resposta.parsedResults().stream()
                .filter(resultado -> resultado.textOverlay() != null && resultado.textOverlay().lines() != null)
                .flatMap(resultado -> resultado.textOverlay().lines().stream())
                .map(OcrLineDTO::lineText)
                .filter(texto -> texto != null && !texto.isBlank())
                .collect(Collectors.joining("\n"));

        if (linhas.isBlank()) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(422), "Não foi possível extrair o texto do anexo enviado.");
        }

        return linhas;
    }

    private ByteArrayResource criarResourceDoArquivo(MultipartFile arquivo) {
        try {
            byte[] bytes = arquivo.getBytes();
            return new ByteArrayResource(bytes) {
                @Override
                public String getFilename() {
                    return arquivo.getOriginalFilename();
                }
            };
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não foi possível ler o arquivo enviado.");
        }
    }

    private NotaFiscalExtraidaGroqDTO extrairDadosComGroq(String textoOcr) {
        GroqRequestDTO groqRequest = new GroqRequestDTO(
                groqModel,
                List.of(
                        new GroqMessageDTO("system", EXTRACTION_PROMPT),
                        new GroqMessageDTO("user", textoOcr)
                ),
                0.1
        );

        GroqResponseDTO groqResponse;
        try {
            groqResponse = restClient.post()
                    .uri(GROQ_API_URL)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + groqApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(groqRequest)
                    .retrieve()
                    .body(GroqResponseDTO.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Erro ao comunicar com o serviço de IA.");
        }

        if (groqResponse == null || groqResponse.choices() == null || groqResponse.choices().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "O serviço de IA não retornou uma resposta válida.");
        }

        String conteudo = groqResponse.choices().get(0).message().content();
        String json = extrairJson(conteudo);

        try {
            return objectMapper.readValue(json, NotaFiscalExtraidaGroqDTO.class);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "A IA retornou um JSON inválido.");
        }
    }

    private String extrairJson(String conteudo) {
        String limpo = conteudo.replaceAll("(?i)```json", "").replace("```", "").trim();
        int inicio = limpo.indexOf('{');
        int fim = limpo.lastIndexOf('}');
        if (inicio == -1 || fim == -1 || fim < inicio) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "A IA não retornou um JSON válido.");
        }
        return limpo.substring(inicio, fim + 1);
    }

    private NotaFiscalOcrResponseDTO montarResposta(NotaFiscalExtraidaGroqDTO dados) {
        FornecedorDTO fornecedor = buscarFornecedorExistente(dados.fornecedorCnpj());

        List<ItemNotaFiscalOcrResponseDTO> itens = dados.itens() == null
                ? List.of()
                : dados.itens().stream()
                    .map(this::montarItem)
                    .collect(Collectors.toList());

        return new NotaFiscalOcrResponseDTO(
                dados.numeroDocumento(),
                dados.dataEmissao(),
                dados.dataVencimento(),
                dados.valorTotalNota(),
                dados.valorTotalProdutos(),
                fornecedor,
                itens
        );
    }

    private ItemNotaFiscalOcrResponseDTO montarItem(ItemNotaFiscalExtraidoGroqDTO item) {
        RecursoBasicoDTO recurso = buscarRecursoExistente(item.descricao());
        return new ItemNotaFiscalOcrResponseDTO(
                item.descricao(),
                item.unidadeMedida(),
                item.valorTotal(),
                recurso
        );
    }

    private FornecedorDTO buscarFornecedorExistente(String cnpj) {
        if (cnpj == null || cnpj.isBlank()) {
            return null;
        }

        String documento = cnpj.replaceAll("\\D", "");
        if (documento.isBlank()) {
            return null;
        }

        Optional<Fornecedor> fornecedor = fornecedorRepository.findByDocumento(documento);
        return fornecedor.map(FornecedorConversor::converterParaDTO).orElse(null);
    }

    private RecursoBasicoDTO buscarRecursoExistente(String descricao) {
        if (descricao == null || descricao.isBlank()) {
            return null;
        }

        Recurso recurso = recursoRepository.findByDescricaoContainingIgnoreCase(descricao.trim());
        return RecursoConversor.converterParaSemPaiDTO(recurso);
    }
}
