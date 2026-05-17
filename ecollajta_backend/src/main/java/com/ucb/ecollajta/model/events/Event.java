package com.ucb.ecollajta.model.events;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "location_name", length = 200)
    private String locationName;

    @Column(name = "starts_at", nullable = false)
    private LocalDateTime startsAt;

    @Column(name = "ends_at")
    private LocalDateTime endsAt;

    @Column(name = "points_reward", nullable = false)
    private Integer pointsReward = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.published;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name= "latitude", nullable= false , precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name= "longitude", nullable= false ,precision = 9, scale = 6)
    private BigDecimal longitude;

    // ── New admin-panel fields ──
    @Column(name = "slots_total")
    @Builder.Default
    private Integer slotsTotal = 50;

    @Column(name = "slots_filled")
    @Builder.Default
    private Integer slotsFilled = 0;

    @Column(name = "qr_scans")
    @Builder.Default
    private Integer qrScans = 0;

    @Column(length = 100)
    @Builder.Default
    private String district = "";

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @Builder.Default
    private List<EventAttendance> attendances = new ArrayList<>();
    
}
