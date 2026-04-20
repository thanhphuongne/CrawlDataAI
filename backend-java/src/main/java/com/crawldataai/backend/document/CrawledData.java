package com.crawldataai.backend.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "crawled_data")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrawledData {

    @Id
    private String id;

    private Long requestId;

    private String url;

    private List<Map<String, Object>> data;

    private boolean validated = false;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
