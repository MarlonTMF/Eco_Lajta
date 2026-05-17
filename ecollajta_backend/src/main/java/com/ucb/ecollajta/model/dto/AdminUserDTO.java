package com.ucb.ecollajta.model.dto;

public record AdminUserDTO(
    Long id,
    String fullName,
    String email,
    String photoUrl,
    String ci,
    String phone,
    String zone,
    Integer pointsBalance,
    Boolean isActive,
    String role
) {}
