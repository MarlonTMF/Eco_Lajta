package com.ucb.ecollajta.service;

import com.ucb.ecollajta.exception.ResourceNotFoundException;
import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.model.User;
import com.ucb.ecollajta.model.UserRole;
import com.ucb.ecollajta.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Transactional(readOnly = true)
    public Optional<User> findByCi(String ci) {
        return userRepository.findByCi(ci);
    }

    @Transactional
    public User createFromGoogle(String email, String fullName, String googleSub, String photoUrl) {
        log.info("Creating user from Google login, email: {}", email);
        
        UserRole userRole = UserRole.ROLE_CITIZEN;
        if ("marlontomasmarzofernandez@gmail.com".equalsIgnoreCase(email) || "christian.ledezma@ucb.edu.bo".equalsIgnoreCase(email)) {
            userRole = UserRole.ROLE_ADMIN;
            log.info("Elevating new user role to ROLE_ADMIN during registration for: {}", email);
        }

        User user = User.builder()
            .email(email)
            .fullName(fullName)
            .googleSub(googleSub)
            .photoUrl(photoUrl)
            .role(userRole)
            .build();
        User saved = userRepository.save(user);
        log.info("User created with id: {}", saved.getId());
        return saved;
    }

    public User getActualUser() {
        String email = SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    public Result<User> getOne(Long id) {
        return userRepository.findById(id)
            .map(Result::success)
            .orElseGet(() -> Result.failure("UserNotFound", "User with id " + id + " not found"));
    }
    public Result<User> save(User user) {
        try {
            return Result.success(userRepository.saveAndFlush(user));
        } catch (Exception e) {
            return Result.failure(e.getClass().getSimpleName(), e.getMessage());
        }
    }

    public Result<java.util.List<User>> getAllUsers() {
        return Result.success(userRepository.findAll());
    }

    @Transactional
    public Result<User> update(Long id, com.ucb.ecollajta.model.dto.AdminUserUpdateDTO dto) {
        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isEmpty()) {
            return Result.failure("UserNotFound", "User not found with id " + id);
        }
        User user = optUser.get();
        if (dto.fullName() != null) user.setFullName(dto.fullName());
        if (dto.ci() != null) user.setCi(dto.ci());
        if (dto.phone() != null) user.setPhone(dto.phone());
        if (dto.zone() != null) user.setAddressLine(dto.zone()); // mapping zone to addressLine for now
        if (dto.pointsBalance() != null) user.setPointsBalance(dto.pointsBalance());
        if (dto.isActive() != null) user.setIsActive(dto.isActive());
        if (dto.role() != null) {
            try {
                user.setRole(UserRole.valueOf(dto.role()));
            } catch (IllegalArgumentException e) {
                // ignore or handle
            }
        }
        return Result.success(userRepository.save(user));
    }
}
