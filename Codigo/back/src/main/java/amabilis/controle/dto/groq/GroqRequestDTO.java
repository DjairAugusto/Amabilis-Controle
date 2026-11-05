package amabilis.controle.dto.groq;

import java.util.List;

public record GroqRequestDTO(
        String model,
        List<GroqMessageDTO> messages,
        double temperature
) {}
