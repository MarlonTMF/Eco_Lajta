package com.ucb.ecollajta.service;

import com.ucb.ecollajta.model.user.User;
import com.ucb.ecollajta.model.user.UserRole;
import com.ucb.ecollajta.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        log.debug("Searching user by email: {}", email);
        return userRepository.findByEmail(email);
    }

    @Transactional
    public User createFromGoogle(String email, String fullName, String googleSub) {
        log.info("Creating user from Google login, email: {}", email);
        User user = User.builder()
            .email(email)
            .fullName(fullName)
            .googleSub(googleSub)
            .role(UserRole.ROLE_CITIZEN)
            .build();
        User saved = userRepository.save(user);
        log.info("User created with id: {}", saved.getId());
        return saved;
    }
}
