package com.ucb.ecollajta.model.dto;

import com.ucb.ecollajta.model.UserRole;

public record UserMeDTO (
    Long id,
    String fullName,
    String email,
    String photoUrl,
    UserRole role,
    Integer pointsBalance
) {
}
