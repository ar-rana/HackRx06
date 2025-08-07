package com.project.server.controller;

import java.util.Map;

import com.project.server.model.ChatDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("chat")
@Slf4j
public class ChatController {

    @PostMapping(value = "/conversation", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> reply(@ModelAttribute ChatDTO chatDTO) {
        log.info("Query received: {}", chatDTO.getQuery());
        if (chatDTO.getDocument() != null) {
            MultipartFile file = chatDTO.getDocument();
            log.info("Multipart file name: {} type: {}", file.getResource().getFilename(), getMediaType(file.getResource().getFilename()));
        }
        String res = "answer to " + chatDTO.getQuery() + " will be something...someday...maybe; file: %s";

        return ResponseEntity.status(HttpStatus.OK).body(String.format(res, chatDTO.getDocument() != null));
    }

    private String getMediaType(String name) {
        if (name == null) return "N/A";
        int i = name.indexOf('.');
        System.out.println("customer: " + name);
        StringBuilder sb = new StringBuilder();
        for (int j = i + 1;j < name.length(); j++) {
            sb.append(name.charAt(j));
        }
        return sb.toString();
    }
}
