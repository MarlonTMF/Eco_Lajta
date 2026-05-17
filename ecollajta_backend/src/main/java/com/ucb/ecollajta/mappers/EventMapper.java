package com.ucb.ecollajta.mappers;


import org.springframework.stereotype.Component;

import com.ucb.ecollajta.dto.events.EventCreateDto;
import com.ucb.ecollajta.dto.events.EventUpdateDto;
import com.ucb.ecollajta.dto.events.response.EventResponseModel;
import com.ucb.ecollajta.model.events.Event;

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
        event.setAttendances(null);
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
        updatedEvent.setAttendances(null);
        return updatedEvent;
    }
    public static EventResponseModel toModel(Event event) {
        return new EventResponseModel(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getLocationName(),
            event.getStartsAt(),
            event.getEndsAt(),
            event.getPointsReward(),
            event.getLongitude().doubleValue(),
            event.getLatitude().doubleValue()
        );
    }
}
