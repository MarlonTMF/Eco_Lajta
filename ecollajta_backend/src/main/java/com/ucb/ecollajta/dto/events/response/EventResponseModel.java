package com.ucb.ecollajta.dto.events.response;

import java.time.LocalDateTime;

public record EventResponseModel(
    Long id,
    String title,
    String description,
    String locationName,
    LocalDateTime startsAt,
    LocalDateTime endsAt,
    Integer pointsReward,
    Double longitude,
    Double latitude
) {

}
