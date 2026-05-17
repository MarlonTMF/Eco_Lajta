package com.ucb.ecollajta.dto.events;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EventCreateDto", description = "Datos para crear un evento")
public record EventCreateDto(
    @Schema(example = "Reforestación Urbana Sector Norte")
    String title,
    @Schema(example = "Campaña de reforestación comunitaria")
    String description,
    @Schema(example = "Sector Norte, Cochabamba")
    String locationName,
    @Schema(example = "2026-08-24T08:00:00-04:00")
    OffsetDateTime startsAt,
    @Schema(example = "2026-08-24T13:00:00-04:00")
    OffsetDateTime endsAt,
    @Schema(example = "500")
    int pointsReward,
    @Schema(example = "-66.155700")
    BigDecimal longitude,
    @Schema(example = "-17.385150")
    BigDecimal latitude,
    @Schema(example = "100")
    Integer slotsTotal,
    @Schema(example = "Distrito Sur")
    String district,
    @Schema(example = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600")
    String imageUrl
) {
}
