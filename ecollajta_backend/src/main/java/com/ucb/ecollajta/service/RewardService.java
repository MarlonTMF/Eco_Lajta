package com.ucb.ecollajta.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.dto.rewards.RewardCreateDto;
import com.ucb.ecollajta.model.Reward;
import com.ucb.ecollajta.repository.rewards.RewardRepository;

@Service
public class RewardService {
    private final RewardRepository rewardRepository;

    public RewardService(RewardRepository rewardRepository) {
        this.rewardRepository = rewardRepository;
    }
    public Result<Reward> insertOne(RewardCreateDto requestDto) {
        try {
            var reward = new Reward();
            reward.setName(requestDto.name());
            reward.setDescription(requestDto.description());
            reward.setPointsCost(requestDto.pointsCost());
            reward.setStock(requestDto.stock());
            var savedReward = rewardRepository.save(reward);
            return Result.success(savedReward);
        } catch (Exception e) {
            return Result.failure("Error saving reward: " , e.getMessage());
        }
    }
    public Result<List<Reward>> insertMany(List<RewardCreateDto> requestDtos) {
        try {
            var rewards = requestDtos.stream().map(dto -> {
                var reward = new Reward();
                reward.setName(dto.name());
                reward.setDescription(dto.description());
                reward.setPointsCost(dto.pointsCost());
                reward.setStock(dto.stock());
                return reward;
            }).toList();
            var savedRewards = rewardRepository.saveAll(rewards);
            return Result.success(savedRewards);
        } catch (Exception e) {
            return Result.failure("Error saving rewards: " , e.getMessage());
        }
    }
    public Result<Reward> getOne(Long id) {
        try {
            var reward = rewardRepository.findById(id);
            if (reward.isPresent()) {
                return Result.success(reward.get());
            } else {
                return Result.failure("Reward not found","Reward not found with id: " + id);
            }
        } catch (Exception e) {
            return Result.failure("Error fetching reward: " , e.getMessage());
        }
    }
    public Result<Reward> updateOne(Long id, RewardCreateDto requestDto) {
        try {
            var rewardOpt = rewardRepository.findById(id);
            if (rewardOpt.isPresent()) {
                var reward = rewardOpt.get();
                reward.setName(requestDto.name());
                reward.setDescription(requestDto.description());
                reward.setPointsCost(requestDto.pointsCost());
                reward.setStock(requestDto.stock());
                var updatedReward = rewardRepository.save(reward);
                return Result.success(updatedReward);
            } else {
                return Result.failure("Reward not found","Reward not found with id: " + id);
            }
        } catch (Exception e) {
            return Result.failure("Error updating reward: " , e.getMessage());
        }
    }
    public Result<List<Reward>> getAll(){
        try {
            var rewards = rewardRepository.findAll();
            return Result.success(rewards);
        } catch (Exception e) {
            return Result.failure("Error fetching rewards: " , e.getMessage());
        }
    }
}
