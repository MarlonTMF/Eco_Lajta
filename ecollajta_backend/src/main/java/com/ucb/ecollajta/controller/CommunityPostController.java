package com.ucb.ecollajta.controller;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.model.CommunityPost;
import com.ucb.ecollajta.repository.community.CommunityPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityPostController {

    private final CommunityPostRepository communityPostRepository;

    @GetMapping
    public ResponseEntity<Result<List<CommunityPost>>> getAll() {
        List<CommunityPost> posts = communityPostRepository.findAll();
        // Sort by ID desc so newest posts appear first
        posts.sort((p1, p2) -> p2.getId().compareTo(p1.getId()));
        return ResponseEntity.ok(Result.success(posts));
    }

    @PostMapping
    public ResponseEntity<Result<CommunityPost>> create(@RequestBody CommunityPost post) {
        if (post.getAuthor() == null || post.getAuthor().isEmpty()) {
            post.setAuthor("Usuario Anónimo");
        }
        if (post.getCategory() == null) {
            post.setCategory("COMUNIDAD");
        }
        if (post.getCategoryClass() == null) {
            post.setCategoryClass("feed-community");
        }
        post.setTimeAgo("HACE UN MOMENTO");
        CommunityPost saved = communityPostRepository.save(post);
        return ResponseEntity.ok(Result.success(saved));
    }

    @PostMapping("/like")
    public ResponseEntity<Result<CommunityPost>> likePost(@RequestParam Long id, @RequestParam boolean liked) {
        var opt = communityPostRepository.findById(id);
        if (opt.isPresent()) {
            CommunityPost post = opt.get();
            post.setLikedByUser(liked);
            if (liked) {
                post.setLikes(post.getLikes() + 1);
            } else {
                post.setLikes(Math.max(0, post.getLikes() - 1));
            }
            CommunityPost saved = communityPostRepository.save(post);
            return ResponseEntity.ok(Result.success(saved));
        }
        return ResponseEntity.notFound().build();
    }
}
