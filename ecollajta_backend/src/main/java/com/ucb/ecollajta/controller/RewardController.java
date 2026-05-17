package com.ucb.ecollajta.controller;

import org.springframework.web.bind.annotation.RestController;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.dto.rewards.RewardCreateDto;
import com.ucb.ecollajta.model.Reward;
import com.ucb.ecollajta.service.RewardService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;



@RestController()
@RequestMapping("/api/rewards")
@Tag(name = "Recompensas", description = "Gestión de recompensas")
public class RewardController {
    private final RewardService rewardService;
    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }
    @Operation(summary = "Listar recompensas")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Recompensas obtenidas correctamente")
    })
    @GetMapping("")
    public ResponseEntity<Result<List<Reward>>> getAllRewards() {
        var result = rewardService.getAll();
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.status(500).body(result);
    }
    @Operation(summary = "Obtener recompensa por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Recompensa obtenida correctamente"),
        @ApiResponse(responseCode = "404", description = "Recompensa no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Result<Reward>> getRewardById(
        @Parameter(description = "ID de la recompensa", required = true)
        @PathVariable Long id
    ) {
        var result = rewardService.getOne(id);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.status(404).body(result);
    }
    @Operation(summary = "Crear recompensa")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Recompensa creada correctamente")
    })
    @PostMapping("")
    public ResponseEntity<Result<Reward>> registerReward(@RequestBody RewardCreateDto requestDto) {
        var reward = this.rewardService.insertOne(requestDto);
        return reward.isSuccess() ? ResponseEntity.ok(reward) : ResponseEntity.status(500).body(reward);
    }
    @Operation(summary = "Crear varias recompensas")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Recompensas creadas correctamente")
    })
    @PostMapping("/many")
    public ResponseEntity<Result<List<Reward>>> registerRewards(@RequestBody List<RewardCreateDto> requestDtos) {
        var rewards = this.rewardService.insertMany(requestDtos);
        return rewards.isSuccess() ? ResponseEntity.ok(rewards) : ResponseEntity.status(500).body(rewards);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Result<Reward>> updateReward(@PathVariable Long id, @RequestBody RewardCreateDto requestDto) {
        var reward = this.rewardService.updateOne(id, requestDto);
        return reward.isSuccess() ? ResponseEntity.ok(reward) : ResponseEntity.status(404).body(reward);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Result<String>> deleteReward(@PathVariable Long id) {
        var result = this.rewardService.deleteOne(id);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.status(404).body(result);
    }
    
}
