package com.ucb.ecollajta.service;



import java.util.List;

import javax.naming.NameNotFoundException;

import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.dto.events.EventCreateDto;
import com.ucb.ecollajta.dto.events.EventUpdateDto;
import com.ucb.ecollajta.mappers.EventMapper;
import com.ucb.ecollajta.model.Event;
import com.ucb.ecollajta.model.EventStatus;
import com.ucb.ecollajta.repository.events.EventRepository;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    public Result<Event> insertOne(EventCreateDto dtoRequest){
        try{
            var event = EventMapper.toEvent(dtoRequest);
            return Result.success(eventRepository.save(event));
        }catch(Exception e){
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
    public Result<List<Event>> getAll(){
        try{
            return Result.success(eventRepository.findAll());
        }catch(Exception e){
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
    public Result<List<Event>> insertMany(List<EventCreateDto> dtos){
        try {
            var events = dtos.stream().map(EventMapper::toEvent).toList();
            return Result.success(eventRepository.saveAll(events));
        }catch(Exception e) {
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
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
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
    public Result<Event> updateOne(EventUpdateDto dto, Long id){
        try{
            var event = eventRepository.findById(id);
            if(event.isEmpty()) {
                throw new NameNotFoundException("Evento no encontrado");
            }
            var updatedEvent = EventMapper.toEvent(dto, event.get());
            return Result.success(eventRepository.saveAndFlush(updatedEvent));
        }catch(Exception e) {
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
    public Result<Event> updateEventStatus(Long id, String status){
        try{
            var event = eventRepository.findById(id);
            if(event.isEmpty()) {
                throw new NameNotFoundException("Evento no encontrado");
            }
            var eventToUpdate = event.get();
            eventToUpdate.setStatus(EventStatus.valueOf(status));
            return Result.success(eventRepository.saveAndFlush(eventToUpdate));
        }catch(Exception e) {
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
}
