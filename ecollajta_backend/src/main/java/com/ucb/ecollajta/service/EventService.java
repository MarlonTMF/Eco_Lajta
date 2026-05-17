package com.ucb.ecollajta.service;



import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.naming.NameNotFoundException;

import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.dto.events.EventCreateDto;
import com.ucb.ecollajta.dto.events.EventUpdateDto;
import com.ucb.ecollajta.dto.events.response.EventResponseModel;
import com.ucb.ecollajta.mappers.EventMapper;
import com.ucb.ecollajta.model.User;
import com.ucb.ecollajta.model.events.Event;
import com.ucb.ecollajta.model.events.EventAttendance;
import com.ucb.ecollajta.model.events.EventAttended;
import com.ucb.ecollajta.model.events.EventStatus;
import com.ucb.ecollajta.repository.events.EventRepository;

import jakarta.transaction.Transactional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    public Result<EventResponseModel> insertOne(EventCreateDto dtoRequest){
        try{
            var event = EventMapper.toEvent(dtoRequest);
            var savedEvent = eventRepository.save(event);
            return Result.success(EventMapper.toModel(savedEvent));
        }catch(Exception e){
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
    public Result<List<EventResponseModel>> getAll(){
        try{
            var events = eventRepository.findAll();
            var eventModels = events.stream().map(EventMapper::toModel).toList();
            return Result.success(eventModels);
        }catch(Exception e){
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
    public Result<List<EventResponseModel>> insertMany(List<EventCreateDto> dtos){
        try {
            var events = dtos.stream().map(EventMapper::toEvent).toList();
            var savedEvents = eventRepository.saveAll(events);
            var eventModels = savedEvents.stream().map(EventMapper::toModel).toList();
            return Result.success(eventModels);
        }catch(Exception e) {
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
    public Result<EventResponseModel> getOne(Long id){
        try {
            var event = eventRepository.findById(id);
            if(event.isEmpty()) {
                throw new NameNotFoundException("Evento no encontrado");
            }
            return Result.success(EventMapper.toModel(event.get()));
        }catch(Exception e) {
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
    public Result<EventResponseModel> updateOne(EventUpdateDto dto, Long id){
        try{
            var event = eventRepository.findById(id);
            if(event.isEmpty()) {
                throw new NameNotFoundException("Evento no encontrado");
            }
            var updatedEvent = EventMapper.toEvent(dto, event.get());
            return Result.success(EventMapper.toModel(eventRepository.saveAndFlush(updatedEvent)));
        }catch(Exception e) {
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
    public Result<EventResponseModel> updateEventStatus(Long id, String status){
        try{
            var event = eventRepository.findById(id);
            if(event.isEmpty()) {
                throw new NameNotFoundException("Evento no encontrado");
            }
            var eventToUpdate = event.get();
            eventToUpdate.setStatus(EventStatus.valueOf(status));
            return Result.success(EventMapper.toModel(eventRepository.saveAndFlush(eventToUpdate)));
        }catch(Exception e) {
            return Result.failure(e.getClass().getSimpleName(),e.getMessage());
        }
    }
    @Transactional
    public Result<EventAttendance> registerAttendance(Long eventId, User user,Optional<EventAttended> attendanceStatus){
        var event = eventRepository.findById(eventId);
        var attendance = new EventAttendance();
        attendance.setUser(user);
        attendance.setEvent(event.get());
        attendance.setAttended(attendanceStatus.orElse(EventAttended.stand_by));
            
        if(event.get().getAttendances() == null) {
            event.get().setAttendances(new ArrayList<>());
        } 
        event.get().getAttendances().add(attendance);
        eventRepository.saveAndFlush(event.get());
        
        return Result.success(attendance);
    }
    @Transactional
    public Result<EventResponseModel> cancelAttendance(Long eventId, User user){
        try {
            var event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NameNotFoundException("Evento no encontrado"));
            var attendance = event.getAttendances().stream()
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new NameNotFoundException("Asistencia no encontrada para el usuario en este evento"));
            attendance.setAttended(EventAttended.cancelled);
            eventRepository.saveAndFlush(event);
            return Result.success(EventMapper.toModel(event));
        } catch (Exception e) {
            return Result.failure(e.getClass().getSimpleName(), e.getMessage());
        }
    }
}
