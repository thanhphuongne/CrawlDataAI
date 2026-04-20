package com.crawldataai.backend.service;

import com.crawldataai.backend.entity.SubmitRequest;
import com.crawldataai.backend.entity.User;
import com.crawldataai.backend.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository repository;
    private final CrawlerService crawlerService;

    public SubmitRequest createRequest(User user, String requirement) {
        SubmitRequest request = SubmitRequest.builder()
                .accountName(user.getAccountName())
                .descriptions(requirement)
                .createdBy(user)
                .status(SubmitRequest.ProcessStatus.WAITING)
                .build();
        
        SubmitRequest saved = repository.save(request);
        
        // Trigger crawling
        crawlerService.triggerCrawling(saved.getId(), requirement);
        
        return saved;
    }

    public List<SubmitRequest> getRequestsByUser(Long userId) {
        return repository.findByCreatedById(userId);
    }

    public SubmitRequest updateRequestStatus(Long id, SubmitRequest.ProcessStatus status) {
        SubmitRequest request = repository.findById(id).orElseThrow();
        request.setStatus(status);
        return repository.save(request);
    }
}
