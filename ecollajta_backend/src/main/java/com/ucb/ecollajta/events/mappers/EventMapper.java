package com.ucb.ecollajta.events.mappers;


import org.springframework.stereotype.Component;

import com.ucb.ecollajta.events.dto.EventCreateDto;
import com.ucb.ecollajta.events.dto.EventUpdateDto;
import com.ucb.ecollajta.events.model.Event;

@Component
public class EventMapper {
    public static Event toEvent(EventCreateDto dto) {
        var event = new Event();
        event.setTitle(dto.title());
        event.setDescription(dto.description());
        event.setLocationName(dto.locationName());
        event.setStartsAt(dto.startsAt().toLocalDateTime());
        event.setEndsAt(dto.endsAt().toLocalDateTime());
        event.setPointsReward(dto.pointsReward());
        event.setLongitude(dto.longitude());
        event.setLatitude(dto.latitude());
        return event;
    }
    public static Event toEvent(EventUpdateDto dto, Event event){
        var updatedEvent = new Event();
        updatedEvent.setId(dto.id().orElse(event.getId()));
        updatedEvent.setTitle(dto.title().orElse(event.getTitle()));
        updatedEvent.setDescription(dto.description().orElse(event.getDescription()));
        updatedEvent.setLocationName(dto.locationName().orElse(event.getLocationName()));
        updatedEvent.setStartsAt(dto.startsAt().orElse(event.getStartsAt().atOffset(java.time.ZoneOffset.UTC)).toLocalDateTime());
        updatedEvent.setEndsAt(dto.endsAt().orElse(event.getEndsAt().atOffset(java.time.ZoneOffset.UTC)).toLocalDateTime());
        updatedEvent.setPointsReward(dto.pointsReward().orElse(event.getPointsReward()));
        updatedEvent.setLongitude(dto.longitude().orElse(event.getLongitude()));
        updatedEvent.setCreatedAt(event.getCreatedAt());
        updatedEvent.setLatitude(dto.latitude().orElse(event.getLatitude()));
        return updatedEvent;
    }
}
