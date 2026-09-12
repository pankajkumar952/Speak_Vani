package com.speakvaani.service;

import com.speakvaani.dto.AuthRequest;
import com.speakvaani.dto.AuthResponse;
import com.speakvaani.dto.UserDto;
import com.speakvaani.entity.User;
import com.speakvaani.exception.ApiException;
import com.speakvaani.repository.UserRepository;
import com.speakvaani.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "EMAIL_EXISTS", "Email is already registered");
        }

        String name = request.name() != null ? request.name() : "Speaker";

        User user = User.builder()
            .name(name)
            .email(request.email().toLowerCase().trim())
            .passwordHash(passwordEncoder.encode(request.password()))
            .build();

        User saved = userRepository.save(user);
        String token = tokenProvider.generateToken(saved.getId(), saved.getEmail());

        return new AuthResponse(token, saved.getId(), saved.getName(), saved.getEmail());
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    public UserDto getUserProfile(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));

        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());
    }
}
