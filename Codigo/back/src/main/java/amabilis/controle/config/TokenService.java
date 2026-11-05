package amabilis.controle.config;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    @Value("${app.auth.secret:amabilis-secret-key-change-me}")
    private String secret;

    @Value("${app.auth.token-expiration-minutes:480}")
    private long tokenExpirationMinutes;

    public String gerarToken(String usuario) {
        Date issuedAt = Date.from(Instant.now());
        Date expiration = Date.from(Instant.now().plusSeconds(tokenExpirationMinutes * 60));

        return Jwts.builder()
            .subject(usuario)
            .issuedAt(issuedAt)
            .expiration(expiration)
            .signWith(secretKey())
            .compact();
    }

    public String validarToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(secretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        } catch (JwtException | IllegalArgumentException ex) {
            return null;
        }
    }

    private SecretKey secretKey() {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = digest.digest(secret.getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Falha ao preparar chave JWT", ex);
        }
    }
}
