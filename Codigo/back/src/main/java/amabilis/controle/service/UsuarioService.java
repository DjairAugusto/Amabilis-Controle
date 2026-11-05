package amabilis.controle.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import amabilis.controle.domain.Usuario;
import amabilis.controle.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.auth.username:admin@amabilis.com}")
    private String emailDefault;

    @Value("${app.auth.password:amabilis123}")
    private String senhaDefault;

    @Value("${app.auth.nome:Administrador}")
    private String nomeDefault;

    @PostConstruct
    public void init() {
        Optional<Usuario> adminOpt = usuarioRepository.findByEmail(emailDefault);
        if (adminOpt.isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome(nomeDefault);
            admin.setEmail(emailDefault);
            admin.setSenha(passwordEncoder.encode(senhaDefault));
            usuarioRepository.save(admin);
        }
    }

    public Usuario criarUsuario(String nome, String email, String senhaPlana) {
        Usuario novo = new Usuario();
        novo.setNome(nome);
        novo.setEmail(email);
        novo.setSenha(passwordEncoder.encode(senhaPlana));
        return usuarioRepository.save(novo);
    }
    
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public boolean verificarSenha(String senhaPlana, String senhaHash) {
        return passwordEncoder.matches(senhaPlana, senhaHash);
    }
}