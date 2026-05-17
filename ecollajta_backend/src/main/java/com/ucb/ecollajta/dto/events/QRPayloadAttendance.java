package com.ucb.ecollajta.dto.events;

public record QRPayloadAttendance(
    Long eventId,
    String ci
) {
    public static QRPayloadAttendance fromString(String payload) {
        String[] parts = payload.split(":");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid QR payload format");
        }
        Long eventId = Long.parseLong(parts[0]);
        String ci = parts[1];
        return new QRPayloadAttendance(eventId, ci);
    }
}
