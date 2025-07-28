package com.project.server.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("chat")
public class ChatController {

    @PostMapping("/conversation")
    public ResponseEntity<?> reply(@RequestBody Map<String, String> item) {
        String query = item.get("query");
        String res = "answer to " + query + " will be something";

        return ResponseEntity.status(HttpStatus.OK).body(res);
    }
}
