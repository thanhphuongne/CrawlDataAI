package com.crawldataai.backend.repository;

import com.crawldataai.backend.document.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String> {
    Optional<Conversation> findByUserIdAndRequestId(Long userId, Long requestId);
}
