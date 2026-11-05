package amabilis.controle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import amabilis.controle.config.TokenService;
import amabilis.controle.domain.Usuario;
import amabilis.controle.dto.LoginRequestDTO;
import amabilis.controle.dto.LoginResponseDTO;
import amabilis.controle.service.UsuarioService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO request) {
        String email = request.email().trim().toLowerCase();
        
        Usuario usuario = usuarioService.buscarPorEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));
            
        boolean credenciaisValidas = usuarioService.verificarSenha(request.senha(), usuario.getSenha());

        if (!credenciaisValidas) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        String token = tokenService.gerarToken(email);

        LoginResponseDTO response = new LoginResponseDTO(
            token,
            "Bearer",
            usuario.getNome(),
            email
        );

        return ResponseEntity.ok(response);
    }
}
