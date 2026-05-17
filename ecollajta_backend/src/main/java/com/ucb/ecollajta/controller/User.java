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

    @GetMapping
    public ResponseEntity<com.ucb.ecollajta.common.Result<java.util.List<com.ucb.ecollajta.model.dto.AdminUserDTO>>> getAllUsers() {
        var result = userService.getAllUsers();
        if (result.isSuccess()) {
            var dtos = result.getValue().stream()
                .map(userMapper::toAdminDto)
                .toList();
            return ResponseEntity.ok(com.ucb.ecollajta.common.Result.success(dtos));
        }
        return ResponseEntity.badRequest().body(com.ucb.ecollajta.common.Result.failure(result.getErrors()));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public ResponseEntity<com.ucb.ecollajta.common.Result<com.ucb.ecollajta.model.dto.AdminUserDTO>> updateUser(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody com.ucb.ecollajta.model.dto.AdminUserUpdateDTO dto) {
        var result = userService.update(id, dto);
        if (result.isSuccess()) {
            return ResponseEntity.ok(com.ucb.ecollajta.common.Result.success(userMapper.toAdminDto(result.getValue())));
        }
        return ResponseEntity.badRequest().body(com.ucb.ecollajta.common.Result.failure(result.getErrors()));
    }
}
