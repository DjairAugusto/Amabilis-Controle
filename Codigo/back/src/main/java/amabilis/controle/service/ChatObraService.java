package amabilis.controle.service;

import amabilis.controle.domain.ItemObra;
import amabilis.controle.domain.Obra;
import amabilis.controle.domain.enums.StatusItemObra;
import amabilis.controle.domain.notaFiscal.NotaFiscal;
import amabilis.controle.dto.ChatRequestDTO;
import amabilis.controle.dto.ChatResponseDTO;
import amabilis.controle.dto.groq.GroqChoiceDTO;
import amabilis.controle.dto.groq.GroqMessageDTO;
import amabilis.controle.dto.groq.GroqRequestDTO;
import amabilis.controle.dto.groq.GroqResponseDTO;
import amabilis.controle.repository.ObraRepository;
import amabilis.controle.repository.notaFiscal.NotaFiscalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatObraService {

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    @Autowired
    private ObraRepository obraRepository;

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.model}")
    private String groqModel;

    private final RestClient restClient = RestClient.create();

    public ChatResponseDTO chat(Long obraId, ChatRequestDTO request) {
        Obra obra = obraRepository.findById(obraId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Obra não encontrada com o ID: " + obraId));

        String duvida = request.mensagem().toLowerCase();
        String contexto = construirContextoObra(obra);

        // Estratégia de Contexto Dinâmico: Busca notas fiscais apenas se necessário
        if (duvida.contains("nota") || duvida.contains("gasto") || duvida.contains("pagamento") || duvida.contains("fornecedor")) {
            List<NotaFiscal> notas = notaFiscalRepository.findTop10ByObraIdOrderByDataEmissaoDesc(obraId);
            if (!notas.isEmpty()) {
                contexto += "\n\nResumo de Notas Fiscais Recentes:\n" + 
                            notas.stream()
                            .map(n -> "NF: " + n.getNumeroDocumento() + " | Valor: R$ " + n.getValorTotal() + " | Fornecedor: " + (n.getFornecedor() != null ? n.getFornecedor().getRazaoSocial() : "N/A"))
                            .collect(Collectors.joining("\n"));
            }
        }

        String systemPrompt = "Você é o consultor sênior do sistema Amabilis Controle. " +
                      "Responda à dúvida do usuário baseando-se EXCLUSIVAMENTE nos dados:\n" + contexto +
                      "\n\nDiretrizes de resposta:" +
                      "\n1. Forneça o valor solicitado de forma clara, mas complete a frase com uma unidade de medida ou contexto (ex: 'O custo total pago é de R$ 2.387,00, mantendo a obra dentro do cronograma financeiro')." +
                      "\n2. Mantenha o tom executivo: preciso, direto, mas atencioso." +
                      "\n3. Se o valor estiver muito alto ou baixo em relação ao orçamento, dê um aviso curto (ex: 'Este valor representa 40% do orçamento total')." +
                      "\nIMPORTANTE: Não utilize aspas, negrito ou formatação especial. " +
                      "Caso não saiba, responda apenas: 'Não possuo informações suficientes para responder a esta dúvida'.";

        GroqRequestDTO groqRequest = new GroqRequestDTO(
                groqModel,
                List.of(
                        new GroqMessageDTO("system", systemPrompt),
                        new GroqMessageDTO("user", request.mensagem())
                ),
                0.1
        );

        try {
            GroqResponseDTO groqResponse = restClient.post()
                    .uri(GROQ_API_URL)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(groqRequest)
                    .retrieve()
                    .body(GroqResponseDTO.class);

            if (groqResponse == null || groqResponse.choices() == null || groqResponse.choices().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "O serviço de IA não retornou uma resposta válida.");
            }

            String respostaCrua = groqResponse.choices().get(0).message().content();
            // Limpeza final para remover aspas que a IA insiste em colocar
            String respostaLimpa = respostaCrua.replaceAll("^\"|\"$", "").replace("\\\"", "\"");

            return new ChatResponseDTO(respostaLimpa);

        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Erro ao comunicar com o serviço de IA.");
        }
    }

    private String construirContextoObra(Obra obra) {
        StringBuilder sb = new StringBuilder();
        sb.append("Nome: ").append(nvl(obra.getNomeObra())).append("\n");
        sb.append("Centro de Custo: ").append(nvl(obra.getCentroDeCusto())).append("\n");
        sb.append("Status: ").append(obra.getStatusObra() != null ? obra.getStatusObra().getDescricao() : "N/A").append("\n");
        sb.append("Orçamento: R$ ").append(obra.getOrcamento()).append("\n");
        sb.append("Custo Real: R$ ").append(obra.getCustoReal()).append("\n");
        
        if (obra.getItens() != null) {
            sb.append("Total de Tarefas: ").append(obra.getItens().size()).append("\n");
        }
        return sb.toString();
    }

    private String nvl(String value) {
        return value != null ? value : "N/A";
    }
}