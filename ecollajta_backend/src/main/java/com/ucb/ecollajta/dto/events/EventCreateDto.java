package com.ucb.ecollajta.dto.events;

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
    BigDecimal latitude,
    Integer slotsTotal,
    String district,
    String imageUrl
) {
}
