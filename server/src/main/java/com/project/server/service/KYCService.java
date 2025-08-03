package com.project.server.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.server.model.DigilockerReq;
import com.project.server.model.KYCData;
import com.project.server.repository.KYCRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class KYCService {

    @Autowired
    private KYCRepository kycRepo;

    public void saveVerification(String reqId, String validUpto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Date date = Date.from(OffsetDateTime.parse(validUpto).toInstant());

        KYCData data = new KYCData(date, reqId, username);
        kycRepo.save(data);
    };

    public KYCData getKYCData() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<KYCData> data = kycRepo.findById(username);
        return data.orElse(null);
    };

    public KYCData getKYCByRequestId(String id) {
        Optional<KYCData> data = kycRepo.findByRequestId(id);
        return data.orElse(null);
    };

    public KYCData verifyKYC(String clientId, String secret, String inst, String reqId) {
        KYCData data = getKYCByRequestId(reqId);
        if (data == null) return null;

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://dg-sandbox.setu.co/api/digilocker/" + data.getRequestId() + "/aadhaar";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-client-id", clientId);
            headers.set("x-client-secret", secret);
            headers.set("x-product-instance-id", inst);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(headers);

            ResponseEntity<?> res = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );
            if (res.getStatusCode().is2xxSuccessful() && res.getBody() != null) {
                String pdf = getAadhaarPDF(clientId, secret, inst, data.getRequestId());
                data.setPdf(pdf);
                return updateVerification((String) res.getBody(), data);
            } else {
                log.info("Server responded with !200 status for AADHAAR fetch");
                return null;
            }
        } catch (Exception ex) {
            log.info("Some Error occurred during fetching AADHAAR: {}, Stacktrace: {}", ex.getMessage(), ex.getStackTrace());
            return null;
        }
    };

    private String getAddress(JsonNode addressNode) {
        return addressNode.path("house").toString().replaceAll("^\"|\"$", "") + ", "
                + addressNode.path("street").toString().replaceAll("^\"|\"$", "") + ", "
                + addressNode.path("vtc").toString().replaceAll("^\"|\"$", "") + ", "
                + addressNode.path("locality").toString().replaceAll("^\"|\"$", "") + ", "
                + addressNode.path("subDistrict").toString().replaceAll("^\"|\"$", "") + " "
                + addressNode.path("district").toString().replaceAll("^\"|\"$", "") + ", "
                + addressNode.path("state").toString().replaceAll("^\"|\"$", "") + " - "
                + addressNode.path("pin").toString().replaceAll("^\"|\"$", "") + ", "
                + addressNode.path("country").toString().replaceAll("^\"|\"$", "");
    };

    public String getAadhaarPDF(String clientId, String secret, String inst, String reqid) {
        String responseUrl = null;
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://dg-sandbox.setu.co/api/digilocker/" + reqid + "/document";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-client-id", clientId);
            headers.set("x-client-secret", secret);
            headers.set("x-product-instance-id", inst);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("docType", "AADHAAR");
            requestBody.put("format", "pdf");
            requestBody.put("consent", "Y");

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<?> res = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            if (res.getStatusCode().is2xxSuccessful() && res.getBody() != null) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode json = mapper.readTree((String) res.getBody());
                responseUrl = json.path("fileUrl").toString().replaceAll("^\"|\"$", "");
            }
        } catch (Exception ex) {
            log.info("Error occurred fetching AADHAAR PDF: {}, cause: {}, trace: {}",
                    ex.getClass(), ex.getMessage(), ex.getStackTrace()
            );
        }

        log.info("ADDHAAR info download URL: {}", responseUrl);
        return responseUrl;
    };

    public KYCData updateVerification(String res, KYCData data) {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode json = null;
        try {
            json = mapper.readTree(res);
        } catch (Exception ex) {
            log.info("Exception: {}", ex.getClass());
            log.info("Error occurred during JSON parsing: {}", ex.getMessage());
            return null;
        }
        JsonNode parent = json.path("aadhaar");
        JsonNode addressNode = parent.path("address");

        String dob = parent.path("dateOfBirth").toString();
        String photo = parent.path("photo").toString().replaceAll("^\"|\"$", "");
        String name = parent.path("name").toString();
        String maskedNumber = parent.path("maskedNumber").toString();
        String gender = parent.path("gender").toString();
        String phone = parent.path("phone").toString();
        String address = getAddress(addressNode);
        String postOffice = addressNode.path("postOffice").toString();
        String validUntil = parent.path("xml").path("validUntil").toString();

        log.info("Data is, dob: {}, photo: {}, name: {}, aadhaar: {}, gender: {}, phone: {}, address: {}, postOffice: {}, validUntil: {}",
                dob, photo, name, maskedNumber, gender, phone, address, postOffice, validUntil);

        data.setName(name);
        data.setDob(dob);
        try {
            validUntil = validUntil.replaceAll("^\"|\"$", "");
            data.setValidUntil(Date.from(OffsetDateTime.parse(validUntil).toInstant()));
        } catch (Exception e) {
            log.info("Could not parse Date: {}", validUntil);
        }
        data.setGender(gender);
        data.setPhone(phone);
        data.setPhoto(photo);
        data.setMaskedNumber(maskedNumber);
        data.setAddress(address);
        data.setPostOffice(postOffice);

        return kycRepo.save(data);
    };

}
