package com.crawldataai.backend.service;

import com.crawldataai.backend.dto.AuthResponse;
import com.crawldataai.backend.dto.LoginRequest;
import com.crawldataai.backend.entity.User;
import com.crawldataai.backend.repository.UserRepository;
import com.crawldataai.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .accountName(user.getAccountName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse register(User userRequest) {
        var user = User.builder()
                .accountName(userRequest.getAccountName())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .role(User.Role.USER)
                .isVerified(true) // For now, auto-verify for demo
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .accountName(user.getAccountName())
                .role(user.getRole().name())
                .build();
    }
}
