package com.ucb.ecollajta.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeReader;
import com.google.zxing.qrcode.QRCodeWriter;
import com.ucb.ecollajta.common.Result;
import com.ucb.ecollajta.dto.events.QRPayloadAttendance;
import com.ucb.ecollajta.utils.EncryptionUtils;

import java.awt.image.BufferedImage;

import org.springframework.stereotype.Service;

@Service
public class QRService {
    private final ObjectMapper mapper;
    private final EncryptionUtils encryptionUtils;
    public QRService(EncryptionUtils encryptionUtils, ObjectMapper mapper) {
        this.encryptionUtils = encryptionUtils;
        this.mapper = mapper;
    }
    public Result<BufferedImage> generateQrCode(QRPayloadAttendance payload){
    try{
        QRCodeWriter writer = new QRCodeWriter();
        String payloadString = mapper.writeValueAsString(payload);
        String encryptedPayload = encryptionUtils.encrypt(payloadString);
        BitMatrix bitMatrix = writer.encode(encryptedPayload, BarcodeFormat.QR_CODE, 250, 250);
        return Result.success(MatrixToImageWriter.toBufferedImage(bitMatrix));
    }catch(Exception e){
        return Result.failure("Error generating QR code", e.getMessage());
    }
}

    public Result<QRPayloadAttendance> decodeQrCode(BufferedImage qrImage){
        try{
            QRCodeReader reader = new QRCodeReader();
            BinaryBitmap bitmap = new BinaryBitmap(
                new HybridBinarizer(new BufferedImageLuminanceSource(qrImage))
            );
            String encryptedText = reader.decode(bitmap).getText();
            String json = encryptionUtils.decrypt(encryptedText);
            QRPayloadAttendance payload = mapper.readValue(json, QRPayloadAttendance.class);
            return Result.success(payload);
        }catch(Exception e){
            return Result.failure("Error decoding QR code", e.getMessage());
        }
    }
}
