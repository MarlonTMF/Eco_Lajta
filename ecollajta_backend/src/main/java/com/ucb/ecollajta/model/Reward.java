package com.ucb.ecollajta.model;

import java.util.HashSet;
import java.util.Set;

import com.google.auto.value.AutoValue.Builder;

import jakarta.persistence.*;
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

    @ManyToMany(mappedBy = "rewards")
    private Set<User> users = new HashSet<>();
}
