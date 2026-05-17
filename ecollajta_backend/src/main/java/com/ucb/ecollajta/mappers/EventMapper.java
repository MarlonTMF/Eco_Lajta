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
        event.setStartsAt(dto.startsAt() != null ? dto.startsAt().toLocalDateTime() : java.time.LocalDateTime.now().plusDays(7));
        event.setEndsAt(dto.endsAt() != null ? dto.endsAt().toLocalDateTime() : java.time.LocalDateTime.now().plusDays(8));
        event.setPointsReward(dto.pointsReward());
        event.setLongitude(dto.longitude() != null ? dto.longitude() : new java.math.BigDecimal("-66.1570"));
        event.setLatitude(dto.latitude() != null ? dto.latitude() : new java.math.BigDecimal("-17.3935"));
        event.setAttendances(null);
        event.setSlotsTotal(dto.slotsTotal() != null ? dto.slotsTotal() : 50);
        event.setDistrict(dto.district() != null ? dto.district() : "");
        event.setImageUrl(dto.imageUrl() != null ? dto.imageUrl() : "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600");
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
        updatedEvent.setSlotsTotal(dto.slotsTotal().orElse(event.getSlotsTotal()));
        updatedEvent.setDistrict(dto.district().orElse(event.getDistrict()));
        updatedEvent.setImageUrl(dto.imageUrl().orElse(event.getImageUrl()));
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
