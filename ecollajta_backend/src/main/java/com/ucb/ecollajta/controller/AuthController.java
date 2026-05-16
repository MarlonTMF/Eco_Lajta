package com.ucb.ecollajta.controller;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.ucb.ecollajta.auth.AuthResponse;
import com.ucb.ecollajta.auth.JwtService;
import com.ucb.ecollajta.auth.TokenDto;
import com.ucb.ecollajta.model.user.User;
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

            log.info("Google Client ID usado: {}", googleClientId);

            String[] parts = tokenDto.getToken().split("\\.");
            String tokenPayload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
            log.info("Token payload: {}", tokenPayload);

            log.info("Token recibido (primeros 50 chars): {}", tokenDto.getToken().substring(0, 50));


            GoogleIdToken idToken = verifier.verify(tokenDto.getToken());

            log.info("idToken resultado: {}", idToken);

            if (idToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String googleSub = payload.getSubject();
            String fullName = (String) payload.get("name");

            User user = userService.findByEmail(email)
                .orElseGet(() -> userService.createFromGoogle(email, fullName, googleSub));

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
