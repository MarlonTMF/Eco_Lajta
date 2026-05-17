package com.ucb.ecollajta.model.dto;

public record AdminUserUpdateDTO(
    String fullName,
    String ci,
    String phone,
    String zone,
    Integer pointsBalance,
    Boolean isActive,
    String role
) {}
