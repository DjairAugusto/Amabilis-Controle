package amabilis.controle.dto.ocr;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OcrParsedResultDTO(
        @JsonProperty("TextOverlay") OcrTextOverlayDTO textOverlay,
        @JsonProperty("ParsedText") String parsedText
) {
}
