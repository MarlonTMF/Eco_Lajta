package com.ucb.ecollajta.events.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.events.dto.EventCreateDto;
import com.ucb.ecollajta.events.model.Event;
import com.ucb.ecollajta.events.service.EventService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController()
@RequestMapping("/api/events")
public class EventController {
    
    private final EventService eventService;
    public EventController(EventService service) {
        this.eventService = service;
    }

    @GetMapping()
    public Result<List<Event>> getAll() {
        return this.eventService.getAll();
    }
    
    @GetMapping("/one")
    public Result<Event> getOne(@RequestParam Long id) {
        return this.eventService.getOne(id);
    }

    @PostMapping("")
    public Result<Event> save(@RequestBody EventCreateDto requestDto) {
        return this.eventService.insertOne(requestDto);
    }
    @PostMapping("many")
    public Result<List<Event>> saveMany(@RequestBody List<EventCreateDto> requestDtos) {
        return this.eventService.insertMany(requestDtos);
    }
}
