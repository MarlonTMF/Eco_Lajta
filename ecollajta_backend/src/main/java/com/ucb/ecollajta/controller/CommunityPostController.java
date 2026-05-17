package com.ucb.ecollajta.controller;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.model.CommunityPost;
import com.ucb.ecollajta.repository.community.CommunityPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
@Tag(name = "Comunidad", description = "Publicaciones de la comunidad y reacciones")
public class CommunityPostController {

    private final CommunityPostRepository communityPostRepository;

    @Operation(summary = "Listar publicaciones", description = "Obtiene todas las publicaciones ordenadas por más recientes")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Publicaciones obtenidas correctamente")
    })
    @GetMapping
    public ResponseEntity<Result<List<CommunityPost>>> getAll() {
        List<CommunityPost> posts = communityPostRepository.findAll();
        // Sort by ID desc so newest posts appear first
        posts.sort((p1, p2) -> p2.getId().compareTo(p1.getId()));
        return ResponseEntity.ok(Result.success(posts));
    }

    @Operation(summary = "Crear publicación", description = "Crea una publicación de la comunidad")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Publicación creada correctamente")
    })
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

    @Operation(summary = "Dar o quitar like", description = "Marca una publicación como liked o no liked")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Publicación actualizada correctamente"),
        @ApiResponse(responseCode = "404", description = "Publicación no encontrada")
    })
    @PostMapping("/like")
    public ResponseEntity<Result<CommunityPost>> likePost(
        @Parameter(description = "ID de la publicación", required = true)
        @RequestParam Long id,
        @Parameter(description = "true para dar like, false para quitarlo", required = true)
        @RequestParam boolean liked
    ) {
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
