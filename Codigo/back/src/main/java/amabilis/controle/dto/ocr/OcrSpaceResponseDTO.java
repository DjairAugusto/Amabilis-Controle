package amabilis.controle.dto.ocr;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OcrSpaceResponseDTO(
        @JsonProperty("ParsedResults") List<OcrParsedResultDTO> parsedResults,
        @JsonProperty("IsErroredOnProcessing") boolean isErroredOnProcessing
) {
}
