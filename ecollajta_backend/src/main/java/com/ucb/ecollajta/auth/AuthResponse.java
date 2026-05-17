package com.ucb.ecollajta.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AuthResponse", description = "Respuesta del login con token JWT y rol")
public record AuthResponse (String token, String role) {
}
