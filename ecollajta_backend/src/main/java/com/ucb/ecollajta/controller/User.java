package com.ucb.ecollajta.controller;

import com.ucb.ecollajta.model.dto.UserMeDTO;
import com.ucb.ecollajta.model.mapper.UserMapper;
import com.ucb.ecollajta.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class User {
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<UserMeDTO> getMe() {
        return ResponseEntity.ok(userMapper.toMeDto(userService.getActualUser()));
    }
}
