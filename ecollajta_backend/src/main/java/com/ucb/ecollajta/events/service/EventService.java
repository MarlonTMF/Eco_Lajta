package com.ucb.ecollajta.events.service;



import java.util.List;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.events.dto.EventCreateDto;
import com.ucb.ecollajta.events.mappers.EventMapper;
import com.ucb.ecollajta.events.model.Event;
import com.ucb.ecollajta.events.repository.EventRepository;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    public Result<Event> insertOne(EventCreateDto dtoRequest){
        try{
            var event = EventMapper.toEvent(dtoRequest);
            return Result.success(eventRepository.save(event));
        }catch(Exception e){
            return Result.failure("Save Event", "Error al guardar el evento");
        }
    }
    public Result<List<Event>> getAll(){
        try{
            return Result.success(eventRepository.findAll());
        }catch(Exception e){
            return Result.failure("Get All Events", "Error al obtener los eventos");
        }
    }
    public Result<List<Event>> insertMany(List<EventCreateDto> dtos){
        try {
            var events = dtos.stream().map(EventMapper::toEvent).toList();
            return Result.success(events);
        }catch(Exception e) {
            return Result.failure("Save Many Events", "Error al guardar los eventos");
        }
    }
    public Result<Event> getOne(Long id){
        try {
            var event = eventRepository.findById(id);
            if(event.isEmpty()) {
                throw new NameNotFoundException("Evento no encontrado");
            }
            return Result.success(event.get());
        }catch(Exception e) {
            return Result.failure(e.getCause().getMessage(), e.getMessage());
        }
    }
}
