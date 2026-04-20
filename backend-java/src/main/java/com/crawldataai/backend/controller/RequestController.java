package com.crawldataai.backend.controller;

import com.crawldataai.backend.entity.SubmitRequest;
import com.crawldataai.backend.entity.User;
import com.crawldataai.backend.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService service;

    @PostMapping
    public ResponseEntity<SubmitRequest> createRequest(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> payload
    ) {
        String requirement = payload.get("requirement");
        return ResponseEntity.ok(service.createRequest(user, requirement));
    }

    @GetMapping
    public ResponseEntity<List<SubmitRequest>> getMyRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getRequestsByUser(user.getId()));
    }
}
