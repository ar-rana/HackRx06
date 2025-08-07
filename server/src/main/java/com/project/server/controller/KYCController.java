package com.project.server.controller;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.project.server.model.DigilockerReq;
import com.project.server.model.KYCData;
import com.project.server.model.User;
import com.project.server.service.KYCService;
import com.project.server.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("verification")
@Slf4j
public class KYCController {

    @Value("${digilocker.client.id}")
    private String clientId;

    @Value("${digilocker.client.secret}")
    private String secret;

    @Value("${digilocker.product.instance}")
    private String inst;

    @Value("${digilocker.redirect.url}")
    private String redirectUrl;

    @Autowired
    private KYCService kycService;

    @Autowired
    private UserService userService;

    @GetMapping("/start/kyc")
    public ResponseEntity<String> startKycProcedure() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://dg-sandbox.setu.co/api/digilocker";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-client-id", clientId);
            headers.set("x-client-secret", secret);
            headers.set("x-product-instance-id", inst);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("redirectUrl", "http://localhost:8080/verification/kyc/callback");

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<?> res = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    DigilockerReq.class
            );
            if (res.getStatusCode().is2xxSuccessful() && res.getBody() != null) {
                DigilockerReq responseBody = ((DigilockerReq) res.getBody());
                log.info("Response for KYC: {}", responseBody.toString());
                kycService.saveVerification(responseBody.getId(), responseBody.getValidUpto());

                return ResponseEntity.status(HttpStatus.TEMPORARY_REDIRECT).body(responseBody.getUrl());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception ex) {
            log.info("Error occurred of: {}, while starting KYC: {}", ex.getClass(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    @GetMapping("/kyc/callback")
    public void callback(@RequestParam(required = true) Boolean success,
                         @RequestParam(required = true) String id, HttpServletResponse response) throws IOException {
        log.info("KYC status: {} for id: {}", success, id);
        if (!success) {
            log.info("KYC auth FAILED for id: {}", id);
            response.sendRedirect(redirectUrl + "error");
            return;
        }
        KYCData data = kycService.verifyKYC(clientId, secret, inst, id);
        if (data == null || data.getValidUntil().before(new Date())) {
            log.error("KYC Callback Data: {}, Expired: {}", data != null, data.getValidUntil());
            response.sendRedirect(redirectUrl + "error");
            return;
        }

        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/kyc")
    public ResponseEntity<KYCData> getKYCData() {
        KYCData data = kycService.getKYCData();
        if (data == null || data.getValidUntil() == null || data.getValidUntil().before(new Date())) {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            log.info("KYC unavailable/expired for user: {}; expired: {}", username, data != null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userService.getUser();
        if (!user.isVerified()) {
            user.setVerified(true);
            userService.updateUser(user);
        }
        data.setRequestId(null);
        data.setExpirationDate(null);

        return ResponseEntity.status(HttpStatus.OK).body(data);
    }
}
