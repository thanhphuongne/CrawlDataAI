package com.crawldataai.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "submit_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String accountName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descriptions;

    @ManyToOne
    @JoinColumn(name = "supervisor_id", referencedColumnName = "id")
    private User supervisor;

    @Column(nullable = false)
    private String approver;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private boolean hasNotifyMail = false;

    private boolean supervisorApproved = false;

    private boolean approverApproved = false;

    @Enumerated(EnumType.STRING)
    private ProcessStatus status = ProcessStatus.WAITING;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "id")
    private User createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ProcessStatus {
        WAITING, APPROVED, CONFIRMED, REJECT, CANCEL, PROCESSING, COMPLETED, FAILED
    }
}
