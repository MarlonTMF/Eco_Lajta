package com.ucb.ecollajta.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.dto.events.EventAttendanceRegisterDto;
import com.ucb.ecollajta.dto.events.EventCreateDto;
import com.ucb.ecollajta.dto.events.EventUpdateDto;
import com.ucb.ecollajta.dto.events.QRPayloadAttendance;
import com.ucb.ecollajta.dto.events.response.EventResponseModel;
import com.ucb.ecollajta.model.User;
import com.ucb.ecollajta.model.events.Event;
import com.ucb.ecollajta.model.events.EventAttendance;
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

import javax.imageio.ImageIO;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController()
@RequestMapping("/api/events")
public class EventController {
    
    private final EventService eventService;
    private final QRService qrService;
    private final RegisterAttendanceUseCase registerAttendanceUseCase;
    public EventController(EventService service, RegisterAttendanceUseCase registerAttendanceUseCase, QRService qrService) {
        this.eventService = service;
        this.registerAttendanceUseCase = registerAttendanceUseCase;
        this.qrService = qrService;
    }

    @GetMapping()
    public ResponseEntity<Result<List<EventResponseModel>>> getAll() {
        var result = this.eventService.getAll();
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    
    @GetMapping("/one")
    public ResponseEntity<Result<EventResponseModel>> getOne(@RequestParam Long id) {
        var result = this.eventService.getOne(id);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }

    @PostMapping("")
    public ResponseEntity<Result<EventResponseModel>> save(@RequestBody EventCreateDto requestDto) {
        var result = this.eventService.insertOne(requestDto);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @PostMapping("many")
    public ResponseEntity<Result<List<EventResponseModel>>> saveMany(@RequestBody List<EventCreateDto> requestDtos) {
        var result = this.eventService.insertMany(requestDtos);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Result<EventResponseModel>> updateOne(@PathVariable Long id, @RequestBody EventUpdateDto requestDto) {
        var result = this.eventService.updateOne(requestDto, id);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @PutMapping("/cancel/{id}")
    public ResponseEntity<Result<EventResponseModel>> updateStatus(@PathVariable Long id) {
        var result = this.eventService.updateEventStatus(id, "cancelled");
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @PostMapping("/attendance")
    public ResponseEntity<Result<EventResponseModel>> registerAttendance(
        @RequestBody EventAttendanceRegisterDto dto,
        @AuthenticationPrincipal User user
    ) {
        var result = this.registerAttendanceUseCase.execute(dto.eventId(), user.getId(), Optional.of(EventAttended.confirmed));
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @PutMapping("/cancel/attendance/{eventId}")
    public ResponseEntity<Result<EventResponseModel>> cancelAttendance(
        @PathVariable long eventId,
        @AuthenticationPrincipal User user
    ) {
        var result = this.eventService.cancelAttendance(eventId, user);
        return result.isSuccess() ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
    @GetMapping(value = "/attendance/qr/{eventId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrCode(
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
    @PostMapping(value = "/attendance/qr/decode", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Result<EventResponseModel>> decodeQrFromFile(
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
