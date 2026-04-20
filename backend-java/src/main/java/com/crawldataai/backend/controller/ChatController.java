package com.crawldataai.backend.controller;

import com.crawldataai.backend.entity.User;
import com.crawldataai.backend.service.AIService;
import com.crawldataai.backend.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final AIService aiService;
    private final ConversationService conversationService;

    @MessageMapping("/chat")
    public void processMessage(@Payload Map<String, Object> payload, Principal principal) {
        String content = (String) payload.get("content");
        Long requestId = payload.get("request_id") != null ? Long.valueOf(payload.get("request_id").toString()) : null;
        
        // This is a simplified version. In real app, load User from Principal
        // For now, assume we have user metadata or email in Principal
        
        // Save user message
        // conversationService.addMessage(userId, requestId, "user", content);
        
        // Generate AI response
        String response = aiService.generateResponse(content);
        
        Map<String, Object> chatResponse = new HashMap<>();
        chatResponse.put("message", response);
        chatResponse.put("request_id", requestId);
        
        messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/messages", chatResponse);
    }
}
