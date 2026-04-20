package com.crawldataai.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CrawlerService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.python.url:http://localhost:8000}")
    private String pythonBaseUrl;

    public void triggerCrawling(Long requestId, String requirement) {
        String url = pythonBaseUrl + "/api/data/crawl";
        
        Map<String, Object> payload = new HashMap<>();
        payload.put("request_id", requestId);
        payload.put("requirement", requirement);
        
        try {
            restTemplate.postForObject(url, payload, Map.class);
        } catch (Exception e) {
            // Log error
            System.err.println("Failed to trigger crawling in Python: " + e.getMessage());
        }
    }
}
