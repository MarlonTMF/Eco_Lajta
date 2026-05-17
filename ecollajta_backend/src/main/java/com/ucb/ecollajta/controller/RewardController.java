package com.ucb.ecollajta.controller;

import org.springframework.web.bind.annotation.RestController;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.dto.rewards.RewardCreateDto;
import com.ucb.ecollajta.model.Reward;
import com.ucb.ecollajta.service.RewardService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;



@RestController()
@RequestMapping("/api/rewards")
public class RewardController {
    private final RewardService rewardService;
    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }
    @GetMapping("")
    public ResponseEntity<Result<List<Reward>>> getAllRewards() {
        var result = rewardService.getAll();
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.status(500).body(result);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Result<Reward>> getRewardById(@RequestParam Long id) {
        var result = rewardService.getOne(id);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.status(404).body(result);
    }
    @PostMapping("")
    public ResponseEntity<Result<Reward>> registerReward(@RequestBody RewardCreateDto requestDto) {
        var reward = this.rewardService.insertOne(requestDto);
        return reward.isSuccess() ? ResponseEntity.ok(reward) : ResponseEntity.status(500).body(reward);
    }
    @PostMapping("/many")
    public ResponseEntity<Result<List<Reward>>> registerRewards(@RequestBody List<RewardCreateDto> requestDtos) {
        var rewards = this.rewardService.insertMany(requestDtos);
        return rewards.isSuccess() ? ResponseEntity.ok(rewards) : ResponseEntity.status(500).body(rewards);
    }
    
    
}
