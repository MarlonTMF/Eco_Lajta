package com.ucb.ecollajta.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.dto.events.EventCreateDto;
import com.ucb.ecollajta.dto.events.EventUpdateDto;
import com.ucb.ecollajta.model.Event;
import com.ucb.ecollajta.service.EventService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController()
@RequestMapping("/api/events")
public class EventController {
    
    private final EventService eventService;
    public EventController(EventService service) {
        this.eventService = service;
    }

    @GetMapping()
    public ResponseEntity<Result<List<Event>>> getAll() {
        var result = this.eventService.getAll();
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    
    @GetMapping("/one")
    public ResponseEntity<Result<Event>> getOne(@RequestParam Long id) {
        var result = this.eventService.getOne(id);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }

    @PostMapping("")
    public ResponseEntity<Result<Event>> save(@RequestBody EventCreateDto requestDto) {
        var result = this.eventService.insertOne(requestDto);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @PostMapping("many")
    public ResponseEntity<Result<List<Event>>> saveMany(@RequestBody List<EventCreateDto> requestDtos) {
        var result = this.eventService.insertMany(requestDtos);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Result<Event>> updateOne(@PathVariable Long id, @RequestBody EventUpdateDto requestDto) {
        var result = this.eventService.updateOne(requestDto, id);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @PutMapping("/cancel/{id}")
    public ResponseEntity<Result<Event>> updateStatus(@PathVariable Long id) {
        var result = this.eventService.updateEventStatus(id, "cancelled");
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
}
