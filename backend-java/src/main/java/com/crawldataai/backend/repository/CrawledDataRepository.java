package com.crawldataai.backend.repository;

import com.crawldataai.backend.document.CrawledData;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CrawledDataRepository extends MongoRepository<CrawledData, String> {
    List<CrawledData> findByRequestId(Long requestId);
}
