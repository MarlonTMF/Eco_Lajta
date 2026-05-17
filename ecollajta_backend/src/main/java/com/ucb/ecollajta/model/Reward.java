package com.ucb.ecollajta.model;

import java.util.HashSet;
import java.util.Set;

import com.google.auto.value.AutoValue.Builder;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "rewards")
public class Reward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "stock", nullable = false)
    private Integer stock;
    @Column(name = "points_cost", nullable = false)
    private Integer pointsCost;

    @Column(name = "provider", length = 100)
    private String provider;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "icon", length = 50)
    private String icon;

    @JsonIgnore
    @ManyToMany(mappedBy = "rewards")
    private Set<User> users = new HashSet<>();
}
