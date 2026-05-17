package com.ucb.ecollajta.dto.events;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EventUpdateDto", description = "Campos opcionales para actualizar un evento")
public record EventUpdateDto(
    @Schema(description = "ID opcional del evento", example = "1")
    Optional<Long> id,
    @Schema(description = "Título opcional")
    Optional<String> title,
    @Schema(description = "Descripción opcional")
    Optional<String> description,
    @Schema(description = "Nombre de ubicación opcional")
    Optional<String> locationName,
    @Schema(description = "Fecha de inicio opcional")
    Optional<OffsetDateTime> startsAt,
    @Schema(description = "Fecha de fin opcional")
    Optional<OffsetDateTime> endsAt,
    @Schema(description = "Puntos de recompensa opcionales")
    Optional<Integer> pointsReward,
    @Schema(description = "Longitud opcional")
    Optional<BigDecimal> longitude,
    @Schema(description = "Latitud opcional")
    Optional<BigDecimal> latitude,
    @Schema(description = "Número total de cupos opcional")
    Optional<Integer> slotsTotal,
    @Schema(description = "Distrito opcional")
    Optional<String> district,
    @Schema(description = "URL de imagen opcional")
    Optional<String> imageUrl
    
) {

}
