package amabilis.controle.controller.notaFiscal;

import amabilis.controle.dto.notaFiscal.NotaFiscalOcrResponseDTO;
import amabilis.controle.service.notaFiscal.NotaFiscalOcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/nota-fiscal/ocr")
public class NotaFiscalOcrController {

    @Autowired
    private NotaFiscalOcrService notaFiscalOcrService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NotaFiscalOcrResponseDTO> extrair(@RequestParam("arquivo") MultipartFile arquivo) {
        return ResponseEntity.ok(notaFiscalOcrService.extrair(arquivo));
    }
}
