package com.ucb.ecollajta.dto.rewards;

public record RewardCreateDto(
    String name,
    String description,
    Integer pointsCost,
    Integer stock,
    String provider,
    String category,
    String imageUrl,
    String icon
) {

}
