package com.ucb.ecollajta.model.dto;

import com.ucb.ecollajta.model.UserRole;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "UserMeDTO", description = "Datos del usuario autenticado")
public record UserMeDTO (
    @Schema(example = "1")
    Long id,
    @Schema(example = "Juan Pérez")
    String fullName,
    @Schema(example = "juan@example.com")
    String email,
    @Schema(example = "https://example.com/photo.jpg")
    String photoUrl,
    @Schema(example = "ROLE_USER")
    UserRole role,
    @Schema(example = "1200")
    Integer pointsBalance
) {
}
