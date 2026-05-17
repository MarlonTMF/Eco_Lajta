package com.ucb.ecollajta.model.mapper;

import com.ucb.ecollajta.model.User;
import org.springframework.stereotype.Component;
import com.ucb.ecollajta.model.dto.UserMeDTO;

@Component
public class UserMapper {
    public UserMeDTO toMeDto(User user) {
        return new UserMeDTO(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getPhotoUrl(),
            user.getRole(),
            user.getPointsBalance()
        );
    }
}
