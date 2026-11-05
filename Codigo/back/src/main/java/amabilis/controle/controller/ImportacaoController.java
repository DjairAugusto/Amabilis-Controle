package amabilis.controle.controller;

import amabilis.controle.service.ImportacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/importar")
public class ImportacaoController {

    @Autowired
    private ImportacaoService importacaoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> importar(@RequestParam("arquivo") MultipartFile arquivo) {
        try {
            importacaoService.importarExcel(arquivo);
            return ResponseEntity.ok("Importação concluída com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro na importação: " + e.getMessage());
        }
    }
}