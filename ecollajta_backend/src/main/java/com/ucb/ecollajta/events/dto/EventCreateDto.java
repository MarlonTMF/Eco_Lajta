package com.ucb.ecollajta.events.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record EventCreateDto(
    String title,
    String description,
    String locationName,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    int pointsReward,
    BigDecimal longitude,
    BigDecimal latitude
) {
}
