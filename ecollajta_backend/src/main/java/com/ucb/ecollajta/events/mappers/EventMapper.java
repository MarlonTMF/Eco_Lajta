package com.ucb.ecollajta.events.mappers;


import org.springframework.stereotype.Component;

import com.ucb.ecollajta.events.dto.EventCreateDto;
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
        return event;
    }
}
