package com.ucb.ecollajta.events.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;

public record EventUpdateDto(
    Optional<Long> id,
    Optional<String> title,
    Optional<String> description,
    Optional<String> locationName,
    Optional<OffsetDateTime> startsAt,
    Optional<OffsetDateTime> endsAt,
    Optional<Integer> pointsReward,
    Optional<BigDecimal> longitude,
    Optional<BigDecimal> latitude
) {

}
