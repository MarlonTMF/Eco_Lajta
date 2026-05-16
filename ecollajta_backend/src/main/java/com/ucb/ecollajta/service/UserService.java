package com.ucb.ecollajta.service;

import com.ucb.ecollajta.model.User;
import com.ucb.ecollajta.model.UserRole;
import com.ucb.ecollajta.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        log.debug("Searching user by email: {}", email);
        return userRepository.findByEmail(email);
    }

    @Transactional
    public User createFromGoogle(String email, String fullName, String googleSub, String photoUrl) {
        log.info("Creating user from Google login, email: {}", email);
        User user = User.builder()
            .email(email)
            .fullName(fullName)
            .googleSub(googleSub)
            .photoUrl(photoUrl)
            .role(UserRole.ROLE_CITIZEN)
            .build();
        User saved = userRepository.save(user);
        log.info("User created with id: {}", saved.getId());
        return saved;
    }
}
