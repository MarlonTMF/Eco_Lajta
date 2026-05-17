package com.ucb.ecollajta.controller;

import com.ucb.ecollajta.common.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Value("${IMAGEKIT_PRIVATE_KEY}")
    private String privateKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("")
    public ResponseEntity<Result<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadUrl = "https://upload.imagekit.io/api/v1/files/upload";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            String authHeader = "Basic " + Base64.getEncoder().encodeToString((privateKey + ":").getBytes());
            headers.set("Authorization", authHeader);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());
            body.add("fileName", file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.jpg");
            body.add("useUniqueFileName", "true");

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(uploadUrl, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                java.util.regex.Matcher m = java.util.regex.Pattern.compile("\"url\":\"([^\"]+)\"").matcher(response.getBody());
                if (m.find()) {
                    String imageUrl = m.group(1);
                    return ResponseEntity.ok(Result.success(imageUrl));
                }
                return ResponseEntity.badRequest().body(Result.failure("UPLOAD_FAILED", "Could not parse URL from response."));
            } else {
                return ResponseEntity.badRequest().body(Result.failure("UPLOAD_FAILED", "Failed to upload image."));
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Result.failure("UPLOAD_ERROR", e.getMessage()));
        }
    }
}
