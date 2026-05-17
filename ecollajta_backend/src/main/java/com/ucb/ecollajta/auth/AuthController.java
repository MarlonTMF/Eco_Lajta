package com.ucb.ecollajta.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.ucb.ecollajta.model.User;
import com.ucb.ecollajta.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@RequestBody TokenDto tokenDto) {
        if (tokenDto == null || tokenDto.getToken() == null || tokenDto.getToken().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();


            GoogleIdToken idToken = verifier.verify(tokenDto.getToken());

            if (idToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String googleSub = payload.getSubject();
            String photoUrl = (String) payload.get("picture");
            String fullName = (String) payload.get("name");

            User user = userService.findByEmail(email)
                .orElseGet(() -> {
                    try {
                        return userService.createFromGoogle(email, fullName, googleSub, photoUrl);
                    } catch (Exception e) {
                        log.error("Error creating user: {} - {}", e.getClass().getName(), e.getMessage());
                        throw new RuntimeException(e);
                    }
                });

            // Si el usuario existe pero no tiene el rol de administrador en la BD, lo actualizamos directamente
            if ("marlontomasmarzofernandez@gmail.com".equalsIgnoreCase(email) || "christian.ledezma@ucb.edu.bo".equalsIgnoreCase(email)) {
                if (user.getRole() != com.ucb.ecollajta.model.UserRole.ROLE_ADMIN) {
                    user.setRole(com.ucb.ecollajta.model.UserRole.ROLE_ADMIN);
                    var saveResult = userService.save(user);
                    if (saveResult.isSuccess()) user = saveResult.getValue();
                    log.info("Role successfully updated to ROLE_ADMIN in the database for: {}", email);
                }
            }

            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("role", user.getRole().name());

            String jwt = jwtService.generateToken(extraClaims, user);

            return ResponseEntity.ok(new AuthResponse(jwt, user.getRole().name()));

        } catch (Exception e) {
            log.error("Google login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
