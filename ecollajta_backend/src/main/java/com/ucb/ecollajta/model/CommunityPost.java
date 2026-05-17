package com.ucb.ecollajta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "community_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String author;

    private String authorTitle;

    private String avatar;

    private boolean isAvatarImage;

    private String timeAgo;

    private String category;

    private String categoryClass;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String image;

    private int likes;

    private int commentsCount;

    private boolean likedByUser;
}
