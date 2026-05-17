package com.ucb.ecollajta.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "TokenDto", description = "Token de Google enviado para autenticación")
public class TokenDto {
    @Schema(example = "eyJhbGciOi...", requiredMode = Schema.RequiredMode.REQUIRED)
    private String token;
}
