package com.crawldataai.backend.repository;

import com.crawldataai.backend.entity.SubmitRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<SubmitRequest, Long> {
    List<SubmitRequest> findByCreatedById(Long userId);
}
