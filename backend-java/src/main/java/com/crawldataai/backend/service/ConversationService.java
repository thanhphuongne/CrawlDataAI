package com.crawldataai.backend.service;

import com.crawldataai.backend.document.Conversation;
import com.crawldataai.backend.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository repository;

    public Conversation getOrCreateGeneralConversation(Long userId) {
        return repository.findByUserIdAndRequestId(userId, null)
                .orElseGet(() -> repository.save(
                        Conversation.builder()
                                .userId(userId)
                                .requestId(null)
                                .build()
                ));
    }

    public void addMessage(Long userId, Long requestId, String role, String content) {
        Conversation conversation = repository.findByUserIdAndRequestId(userId, requestId)
                .orElseGet(() -> Conversation.builder()
                        .userId(userId)
                        .requestId(requestId)
                        .build());
        
        conversation.getMessages().add(
                Conversation.Message.builder()
                        .role(role)
                        .content(content)
                        .build()
        );
        
        repository.save(conversation);
    }
}
