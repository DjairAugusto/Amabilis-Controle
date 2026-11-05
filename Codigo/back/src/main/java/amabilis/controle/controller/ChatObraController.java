package amabilis.controle.controller;

import amabilis.controle.dto.ChatRequestDTO;
import amabilis.controle.dto.ChatResponseDTO;
import amabilis.controle.service.ChatObraService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatObraController {

    @Autowired
    private ChatObraService chatObraService;

    @PostMapping("/obra/{obraId}")
    public ResponseEntity<ChatResponseDTO> chat(@PathVariable Long obraId, @Valid @RequestBody ChatRequestDTO dto) {
        return ResponseEntity.ok(chatObraService.chat(obraId, dto));
    }
}
