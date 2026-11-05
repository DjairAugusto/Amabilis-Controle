package amabilis.controle.dto.groq;

import java.util.List;

public record GroqResponseDTO(List<GroqChoiceDTO> choices) {}
