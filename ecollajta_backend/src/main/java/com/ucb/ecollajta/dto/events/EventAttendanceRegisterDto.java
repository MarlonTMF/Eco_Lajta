package com.ucb.ecollajta.dto.events;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EventAttendanceRegisterDto", description = "Datos para registrar asistencia a un evento")
public record EventAttendanceRegisterDto(
    @Schema(example = "1")
    Long eventId
) {

}
