package com.ucb.ecollajta.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.dto.events.EventAttendanceRegisterDto;
import com.ucb.ecollajta.dto.events.EventCreateDto;
import com.ucb.ecollajta.dto.events.EventUpdateDto;
import com.ucb.ecollajta.dto.events.QRPayloadAttendance;
import com.ucb.ecollajta.dto.events.response.EventResponseModel;
import com.ucb.ecollajta.model.User;
import com.ucb.ecollajta.model.events.EventAttended;
import com.ucb.ecollajta.service.EventService;
import com.ucb.ecollajta.service.QRService;
import com.ucb.ecollajta.usecases.RegisterAttendanceUseCase;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.MediaType;
import java.io.ByteArrayOutputStream;
import javax.imageio.ImageIO;


import java.awt.image.BufferedImage;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;




@RestController()
@RequestMapping("/api/events")
@Tag(name = "Eventos", description = "Gestión de eventos, asistencia y QR")
public class EventController {
    
    private final EventService eventService;
    private final QRService qrService;
    private final RegisterAttendanceUseCase registerAttendanceUseCase;
    public EventController(EventService service, RegisterAttendanceUseCase registerAttendanceUseCase, QRService qrService) {
        this.eventService = service;
        this.registerAttendanceUseCase = registerAttendanceUseCase;
        this.qrService = qrService;
    }
    @Operation(summary = "Listar eventos", description = "Obtiene todos los eventos disponibles")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Eventos obtenidos correctamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @GetMapping()
    public ResponseEntity<Result<List<EventResponseModel>>> getAll() {
        var result = this.eventService.getAll();
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    
    @Operation(summary = "Obtener un evento", description = "Busca un evento por su ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Evento obtenido correctamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @GetMapping("/one")
    public ResponseEntity<Result<EventResponseModel>> getOne(
        @Parameter(description = "ID del evento", required = true)
        @RequestParam Long id
    ) {
        var result = this.eventService.getOne(id);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }

    @Operation(summary = "Crear evento", description = "Registra un nuevo evento")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Evento creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @PostMapping("")
    public ResponseEntity<Result<EventResponseModel>> save(@RequestBody EventCreateDto requestDto) {
        var result = this.eventService.insertOne(requestDto);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @Operation(summary = "Crear varios eventos", description = "Registra múltiples eventos en una sola petición")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Eventos creados correctamente")
    })
    @PostMapping("many")
    public ResponseEntity<Result<List<EventResponseModel>>> saveMany(@RequestBody List<EventCreateDto> requestDtos) {
        var result = this.eventService.insertMany(requestDtos);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @Operation(summary = "Actualizar evento", description = "Actualiza los datos de un evento existente")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Evento actualizado correctamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Result<EventResponseModel>> updateOne(
        @Parameter(description = "ID del evento", required = true)
        @PathVariable Long id,
        @RequestBody EventUpdateDto requestDto
    ) {
        var result = this.eventService.updateOne(requestDto, id);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @Operation(summary = "Cancelar evento", description = "Marca un evento como cancelado")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Estado actualizado correctamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @PutMapping("/cancel/{id}")
    public ResponseEntity<Result<EventResponseModel>> updateStatus(
        @Parameter(description = "ID del evento", required = true)
        @PathVariable Long id
    ) {
        var result = this.eventService.updateEventStatus(id, "cancelled");
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @Operation(summary = "Registrar asistencia", description = "Registra al usuario autenticado en un evento")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Asistencia registrada correctamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @PostMapping("/attendance")
    public ResponseEntity<Result<EventResponseModel>> registerAttendance(
        @RequestBody EventAttendanceRegisterDto dto,
        @AuthenticationPrincipal User user
    ) {
        var result = this.registerAttendanceUseCase.execute(dto.eventId(), user.getId(), Optional.of(EventAttended.confirmed));
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @Operation(summary = "Cancelar asistencia", description = "Cancela la asistencia del usuario autenticado a un evento")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Asistencia cancelada correctamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    })
    @PutMapping("/cancel/attendance/{eventId}")
    public ResponseEntity<Result<EventResponseModel>> cancelAttendance(
        @Parameter(description = "ID del evento", required = true)
        @PathVariable long eventId,
        @AuthenticationPrincipal User user
    ) {
        var result = this.eventService.cancelAttendance(eventId, user);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @Operation(summary = "Generar QR de asistencia", description = "Genera una imagen PNG con el QR del evento")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "QR generado correctamente", content = @Content(mediaType = "image/png")),
        @ApiResponse(responseCode = "400", description = "No se pudo generar el QR")
    })
    @GetMapping(value = "/attendance/qr/{eventId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrCode(
        @Parameter(description = "ID del evento", required = true)
        @PathVariable Long eventId,
        @AuthenticationPrincipal User user
    ) {
        var payload = new QRPayloadAttendance(eventId, user.getCi());
        var result = this.qrService.generateQrCode(payload);

        if (result.isFailure()) {
            return ResponseEntity.badRequest().build();
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ImageIO.write(result.getValue(), "png", baos);
            return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(baos.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @Operation(summary = "Decodificar QR de asistencia", description = "Recibe una imagen y registra la asistencia si el QR es válido")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "QR procesado correctamente"),
        @ApiResponse(responseCode = "400", description = "QR inválido o archivo incorrecto"),
        @ApiResponse(responseCode = "500", description = "Error interno")
    })
    @PostMapping(value = "/attendance/qr/decode", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<EventResponseModel>> decodeQrFromFile(
        @Parameter(description = "Archivo de imagen con el QR", required = true)
        @RequestParam("file") MultipartFile file,
        @AuthenticationPrincipal User user
    ) {
        try {
            BufferedImage img = ImageIO.read(file.getInputStream());
            var decodeResult = qrService.decodeQrCode(img);
            if (decodeResult.isFailure()) {
                return ResponseEntity.badRequest().body(Result.failure(decodeResult.getErrors()));
            }
            var payload = decodeResult.getValue();
            var eventResult = registerAttendanceUseCase.execute(payload.eventId(),user.getId(),Optional.of(EventAttended.confirmed));
            return eventResult.isSuccess() ? ResponseEntity.ok(eventResult) : ResponseEntity.badRequest().body(eventResult);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Result.failure("qr", e.getMessage()));
        }
    }
    
}
