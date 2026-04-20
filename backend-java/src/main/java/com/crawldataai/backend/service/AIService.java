package com.crawldataai.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIService {

    private final ChatClient chatClient;

    public String generateResponse(String message) {
        return chatClient.call(message);
    }
    
    // Add logic for intent analysis if needed, similar to aiService.js
}
