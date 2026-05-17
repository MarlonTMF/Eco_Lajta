package com.ucb.ecollajta.usecases;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.dto.events.response.EventResponseModel;
import com.ucb.ecollajta.model.events.Event;
import com.ucb.ecollajta.model.events.EventAttendance;
import com.ucb.ecollajta.service.EventService;
import com.ucb.ecollajta.service.UserService;
import com.ucb.ecollajta.model.events.EventAttended;

import jakarta.transaction.Transactional;

@Component
public class RegisterAttendanceUseCase {
    private final EventService eventService;
    private final UserService userService;

    public RegisterAttendanceUseCase(EventService eventService, UserService userService) {
        this.eventService = eventService;
        this.userService = userService;
    }

    public Result<EventResponseModel> execute(Long eventId, Long userId, Optional<EventAttended> attendanceStatus) {
        try {
            var userResult = userService.getOne(userId);
            if (userResult.isFailure()) {
                return Result.failure("error al obtener usuario", userResult.getErrors().toString());
            }

            eventService.registerAttendance(eventId, userResult.getValue(), attendanceStatus);
            return eventService.getOne(eventId);

        } catch (Exception e) {
            return Result.failure(e.getClass().getSimpleName(), e.getMessage());
        }
    }
}
